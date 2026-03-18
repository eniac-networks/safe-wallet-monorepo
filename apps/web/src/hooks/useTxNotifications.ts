import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { formatError } from '@safe-global/utils/utils/formatters'
import { selectNotifications, showNotification } from '@/store/notificationsSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { TxEvent, txSubscribe } from '@/services/tx/txEvents'
import { useCurrentChain } from './useChains'
import useTxQueue from './useTxQueue'
import { isSignableBy, isTransactionListItem } from '@/utils/transaction-guards'
import { TransactionStatus } from '@safe-global/safe-gateway-typescript-sdk'
import { selectPendingTxs } from '@/store/pendingTxsSlice'
import useIsSafeOwner from '@/hooks/useIsSafeOwner'
import useWallet from './wallets/useWallet'
import useSafeAddress from './useSafeAddress'
import { isWalletRejection } from '@/utils/wallets'
import { getTxLink } from '@/utils/tx-link'
import { useLazyGetTransactionDetailsQuery } from '@/store/api/gateway'
import { getExplorerLink } from '@safe-global/utils/utils/gateway'

const TxNotifications = {
  [TxEvent.SIGN_FAILED]: 'notifications.txSignFailed',
  [TxEvent.PROPOSED]: 'notifications.txProposed',
  [TxEvent.PROPOSE_FAILED]: 'notifications.txProposeFailed',
  [TxEvent.DELETED]: 'notifications.txDeleted',
  [TxEvent.SIGNATURE_PROPOSED]: 'notifications.txSignatureProposed',
  [TxEvent.SIGNATURE_PROPOSE_FAILED]: 'notifications.txSignatureProposeFailed',
  [TxEvent.EXECUTING]: 'notifications.txExecuting',
  [TxEvent.PROCESSING]: 'notifications.txProcessing',
  [TxEvent.PROCESSING_MODULE]: 'notifications.txProcessingModule',
  [TxEvent.ONCHAIN_SIGNATURE_REQUESTED]: 'notifications.txOnchainSignatureRequested',
  [TxEvent.ONCHAIN_SIGNATURE_SUCCESS]: 'notifications.txOnchainSignatureSuccess',
  [TxEvent.PROCESSED]: 'notifications.txProcessed',
  [TxEvent.REVERTED]: 'notifications.txReverted',
  [TxEvent.SUCCESS]: 'notifications.txSuccess',
  [TxEvent.FAILED]: 'notifications.txFailed',
}

enum Variant {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
}

const successEvents = [TxEvent.PROPOSED, TxEvent.SIGNATURE_PROPOSED, TxEvent.ONCHAIN_SIGNATURE_SUCCESS, TxEvent.SUCCESS]

const useTxNotifications = (): void => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const chain = useCurrentChain()
  const safeAddress = useSafeAddress()
  const [trigger] = useLazyGetTransactionDetailsQuery()

  /**
   * Show notifications of a transaction's lifecycle
   */

  useEffect(() => {
    if (!chain) return

    const entries = Object.entries(TxNotifications) as [keyof typeof TxNotifications, string][]

    const unsubFns = entries.map(([event, msgKey]) =>
      txSubscribe(event, async (detail) => {
        const isError = 'error' in detail
        if (isError && isWalletRejection(detail.error)) return
        const isSuccess = successEvents.includes(event)
        const baseMessage = t(msgKey)
        const message = isError ? `${baseMessage} ${formatError(detail.error)}` : baseMessage
        const txId = 'txId' in detail ? detail.txId : undefined
        const txHash = 'txHash' in detail ? detail.txHash : undefined
        const groupKey = 'groupKey' in detail && detail.groupKey ? detail.groupKey : txId || ''

        let humanDescription = 'Transaction'
        const id = txId || txHash
        if (id) {
          try {
            const { data: txDetails } = await trigger({ chainId: chain.chainId, txId: id })
            humanDescription = txDetails?.txInfo.humanDescription || humanDescription
          } catch {}
        }

        dispatch(
          showNotification({
            title: humanDescription,
            message,
            detailedMessage: isError ? detail.error.message : undefined,
            groupKey,
            variant: isError ? Variant.ERROR : isSuccess ? Variant.SUCCESS : Variant.INFO,
            link: txId
              ? getTxLink(txId, chain, safeAddress, t('transactions.viewTransaction'))
              : txHash
                ? getExplorerLink(txHash, chain.blockExplorerUriTemplate)
                : undefined,
          }),
        )
      }),
    )

    return () => {
      unsubFns.forEach((unsub) => unsub())
    }
  }, [dispatch, safeAddress, chain, trigger, t])

  /**
   * If there's at least one transaction awaiting confirmations, show a notification for it
   */

  const { page } = useTxQueue()
  const isOwner = useIsSafeOwner()
  const pendingTxs = useAppSelector(selectPendingTxs)
  const notifications = useAppSelector(selectNotifications)
  const wallet = useWallet()
  const notifiedAwaitingTxIds = useRef<Array<string>>([])

  const txsAwaitingConfirmation = useMemo(() => {
    if (!page?.results) {
      return []
    }

    return page.results.filter(isTransactionListItem).filter(({ transaction }) => {
      const isAwaitingConfirmations = transaction.txStatus === TransactionStatus.AWAITING_CONFIRMATIONS
      const isPending = !!pendingTxs[transaction.id]
      const canSign = isSignableBy(transaction, wallet?.address || '')
      return isAwaitingConfirmations && !isPending && canSign
    })
  }, [page?.results, pendingTxs, wallet?.address])

  useEffect(() => {
    if (!isOwner || txsAwaitingConfirmation.length === 0) {
      return
    }

    const txId = txsAwaitingConfirmation[0].transaction.id
    const hasNotified = notifiedAwaitingTxIds.current.includes(txId)

    if (hasNotified) {
      return
    }

    dispatch(
      showNotification({
        variant: 'info',
        message: t('notifications.txRequiresConfirmation'),
        link: chain && getTxLink(txId, chain, safeAddress, t('transactions.viewTransaction')),
        groupKey: txId,
      }),
    )

    notifiedAwaitingTxIds.current.push(txId)
  }, [chain, dispatch, isOwner, notifications, safeAddress, txsAwaitingConfirmation, t])
}

export default useTxNotifications
