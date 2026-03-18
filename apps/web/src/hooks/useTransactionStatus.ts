import { ReplaceTxHoverContext } from '@/components/transactions/GroupedTxListItems/ReplaceTxHoverProvider'
import { useAppSelector } from '@/store'
import { PendingStatus, selectPendingTxById } from '@/store/pendingTxsSlice'
import { isCancelledSwapOrder, isSignableBy } from '@/utils/transaction-guards'
import type { TransactionSummary } from '@safe-global/safe-gateway-typescript-sdk'
import { TransactionStatus } from '@safe-global/safe-gateway-typescript-sdk'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import useWallet from './wallets/useWallet'

const ReplacedStatus = 'WILL_BE_REPLACED'

type TxLocalStatus = TransactionStatus | PendingStatus | typeof ReplacedStatus

export const STATUS_LABELS: Record<TxLocalStatus, string> = {
  [TransactionStatus.AWAITING_CONFIRMATIONS]: 'transactions.awaitingConfirmations',
  [TransactionStatus.AWAITING_EXECUTION]: 'transactions.awaitingExecution',
  [TransactionStatus.CANCELLED]: 'transactions.cancelled',
  [TransactionStatus.FAILED]: 'transactions.failed',
  [TransactionStatus.SUCCESS]: 'transactions.success',
  [PendingStatus.SUBMITTING]: 'transactions.submitting',
  [PendingStatus.PROCESSING]: 'transactions.processing',
  [PendingStatus.RELAYING]: 'transactions.relaying',
  [PendingStatus.INDEXING]: 'transactions.indexing',
  [PendingStatus.SIGNING]: 'transactions.signing',
  [PendingStatus.NESTED_SIGNING]: 'transactions.signing',
  [ReplacedStatus]: 'transactions.willBeReplaced',
}

const WALLET_STATUS_LABELS: Record<TxLocalStatus, string> = {
  ...STATUS_LABELS,
  [TransactionStatus.AWAITING_CONFIRMATIONS]: 'transactions.needsYourConfirmation',
}

const useTransactionStatus = (txSummary: TransactionSummary): string => {
  const { t } = useTranslation()
  const { txStatus, id } = txSummary

  const { replacedTxIds } = useContext(ReplaceTxHoverContext)
  const wallet = useWallet()
  const pendingTx = useAppSelector((state) => selectPendingTxById(state, id))

  if (isCancelledSwapOrder(txSummary.txInfo)) {
    return t(STATUS_LABELS[TransactionStatus.CANCELLED])
  }

  if (replacedTxIds.includes(id)) {
    return t(STATUS_LABELS[ReplacedStatus])
  }

  const statuses = wallet?.address && isSignableBy(txSummary, wallet.address) ? WALLET_STATUS_LABELS : STATUS_LABELS
  const key = statuses[pendingTx?.status || txStatus]

  return key ? t(key) : ''
}

export default useTransactionStatus
