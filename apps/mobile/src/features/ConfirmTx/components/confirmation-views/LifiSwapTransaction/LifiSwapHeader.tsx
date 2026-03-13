import React from 'react'
import { SwapTransactionInfo, MultisigExecutionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { formatWithSchema } from '@/src/utils/date'
import { formatValue } from '@/src/utils/formatters'
import { SwapHeader } from '@/src/components/SwapHeader'
import { useTranslation } from 'react-i18next'

interface LifiSwapHeaderProps {
  txInfo: SwapTransactionInfo
  executionInfo: MultisigExecutionDetails
}

export function LifiSwapHeader({ txInfo, executionInfo }: LifiSwapHeaderProps) {
  const { t } = useTranslation()
  const { fromToken, toToken, fromAmount, toAmount } = txInfo
  const date = formatWithSchema(executionInfo.submittedAt, 'MMM d yyyy')
  const time = formatWithSchema(executionInfo.submittedAt, 'hh:mm a')

  const sellTokenValue = formatValue(fromAmount, fromToken.decimals)
  const buyTokenValue = formatValue(toAmount, toToken.decimals)

  return (
    <SwapHeader
      date={date}
      time={time}
      fromToken={fromToken}
      toToken={toToken}
      fromAmount={sellTokenValue}
      toAmount={buyTokenValue}
      fromLabel={t('swap.sell')}
      toLabel={t('swap.for')}
    />
  )
}
