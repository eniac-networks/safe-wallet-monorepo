import React, { useMemo } from 'react'
import { SwapOrderHeader } from './SwapOrderHeader'
import { YStack } from 'tamagui'
import { formatSwapOrderItemsForConfirmation, formatTwapOrderItemsForConfirmation } from '@/src/utils/swapOrderUtils'
import { ListTable } from '../../ListTable'
import { DataDecoded, MultisigExecutionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { OrderTransactionInfo } from '@safe-global/store/gateway/types'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { useAppSelector } from '@/src/store/hooks'
import { selectChainById } from '@/src/store/chains'
import { isTwapOrderTxInfo } from '@/src/utils/transaction-guards'
import { isSettingTwapFallbackHandler } from '@safe-global/utils/features/swap/helpers/utils'
import { TwapFallbackHandlerWarning } from '@/src/features/ConfirmTx/components/confirmation-views/SwapOrder/TwapFallbackHandlerWarning'
import { Alert } from '@/src/components/Alert'
import { useRecipientItem } from './hooks'
import { ParametersButton } from '@/src/features/ConfirmTx/components/ParametersButton'
import { ActionsRow } from '@/src/components/ActionsRow'
import { useTranslation } from 'react-i18next'

interface SwapOrderProps {
  executionInfo: MultisigExecutionDetails
  txInfo: OrderTransactionInfo
  decodedData?: DataDecoded | null
  txId: string
}

export function SwapOrder({ executionInfo, txInfo, decodedData, txId }: SwapOrderProps) {
  const { t } = useTranslation()
  const order = txInfo
  const isTwapOrder = isTwapOrderTxInfo(order)

  const activeSafe = useDefinedActiveSafe()
  const chain = useAppSelector((state) => selectChainById(state, activeSafe.chainId))

  const swapItems = useMemo(() => formatSwapOrderItemsForConfirmation(txInfo, chain, t), [txInfo, chain, t])

  const twapItems = useMemo(() => {
    return isTwapOrder ? formatTwapOrderItemsForConfirmation(order, t) : []
  }, [order, chain, t])

  const isChangingFallbackHandler = decodedData && isSettingTwapFallbackHandler(decodedData)

  const recipientItems = useRecipientItem(order)

  const showRecipientWarning = order.receiver && order.owner !== order.receiver

  return (
    <YStack gap="$4">
      {isChangingFallbackHandler && <TwapFallbackHandlerWarning />}
      <SwapOrderHeader executionInfo={executionInfo} txInfo={txInfo} />

      <ListTable items={swapItems}>
        <ParametersButton txId={txId} />
      </ListTable>
      {recipientItems.length > 0 && <ListTable items={recipientItems} />}
      {isTwapOrder && <ListTable items={twapItems} />}

      {showRecipientWarning && (
        <Alert
          type="warning"
          message={t('swap.recipientDiffers')}
          info={t('swap.doubleCheckAddress')}
          testID="recipient-warning-alert"
        />
      )}

      <ActionsRow txId={txId} decodedData={decodedData} />
    </YStack>
  )
}
