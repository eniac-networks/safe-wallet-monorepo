import React from 'react'
import { OrderTransactionInfo } from '@safe-global/store/gateway/types'
import { MultisigExecutionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { formatWithSchema } from '@/src/utils/date'
import { formatValue } from '@/src/utils/formatters'
import { SwapHeader } from '@/src/components/SwapHeader'
import { useTranslation } from 'react-i18next'

interface SwapOrderHeaderProps {
  txInfo: OrderTransactionInfo
  executionInfo: MultisigExecutionDetails
}

export function SwapOrderHeader({ txInfo, executionInfo }: SwapOrderHeaderProps) {
  const { t } = useTranslation()
  const { sellToken, buyToken, sellAmount, buyAmount, kind } = txInfo
  const date = formatWithSchema(executionInfo.submittedAt, 'MMM d yyyy')
  const time = formatWithSchema(executionInfo.submittedAt, 'hh:mm a')

  const sellTokenValue = formatValue(sellAmount, sellToken.decimals)
  const buyTokenValue = formatValue(buyAmount, buyToken.decimals)

  const isSellOrder = kind === 'sell'

  return (
    <SwapHeader
      date={date}
      time={time}
      fromToken={sellToken}
      toToken={buyToken}
      fromAmount={sellTokenValue}
      toAmount={buyTokenValue}
      fromLabel={isSellOrder ? t('swap.sell') : t('swap.forAtMost')}
      toLabel={isSellOrder ? t('swap.forAtLeast') : t('swap.buyExactly')}
    />
  )
}
