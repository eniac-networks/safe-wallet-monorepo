import React from 'react'
import { Logo } from '@/src/components/Logo'
import { View, Text } from 'tamagui'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { OrderTransactionInfo, StartTimeValue } from '@safe-global/store/gateway/types'
import { formatWithSchema, getPeriod } from '@safe-global/utils/utils/date'
import { formatValue, getLimitPrice, ellipsis } from '@/src/utils/formatters'
import { TwapOrderTransactionInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { formatAmount } from '@safe-global/utils/utils/formatNumber'
import { CopyButton } from '@/src/components/CopyButton'
import {
  getExecutionPrice,
  getSlippageInPercent,
  getOrderClass,
  getOrderFeeBps,
} from '@safe-global/utils/features/swap/helpers/utils'
import StatusLabel from '@/src/features/ConfirmTx/components/confirmation-views/SwapOrder/StatusLabel'
import { TouchableOpacity, Linking } from 'react-native'
import { type ListTableItem } from '@/src/features/ConfirmTx/components/ListTable'
import { TFunction } from 'i18next'

export const priceRow = (order: OrderTransactionInfo, t: TFunction) => {
  const { status, sellToken, buyToken } = order
  const executionPrice = getExecutionPrice(order)
  const limitPrice = getLimitPrice(order)

  if (status === 'fulfilled') {
    return {
      label: t('swap.executionPrice'),
      value: `1 ${buyToken.symbol} = ${formatAmount(executionPrice)} ${sellToken.symbol}`,
    }
  }

  return {
    label: t('swap.limitPrice'),
    value: `1 ${buyToken.symbol} = ${formatAmount(limitPrice)} ${sellToken.symbol}`,
  }
}

export const statusRow = (order: OrderTransactionInfo, t: TFunction) => {
  const { status } = order

  return {
    label: t('swap.status'),
    render: () => <StatusLabel status={status} />,
  }
}

export const expiryRow = (order: OrderTransactionInfo, t: TFunction) => {
  const expiresAt = formatWithSchema(order.validUntil * 1000, 'dd/MM/yyyy, HH:mm')
  return {
    label: t('swap.expiry'),
    value: expiresAt,
  }
}

export const orderIdRow = (order: OrderTransactionInfo, t: TFunction) => {
  if (!('uid' in order)) {
    return null
  }

  const openCowExplorer = () => {
    Linking.openURL(order.explorerUrl)
  }

  return {
    label: t('swap.orderId'),
    render: () => (
      <View flexDirection="row" alignItems="center" gap="$2">
        <Text fontSize="$4">{ellipsis(order.uid, 6)}</Text>
        <CopyButton value={order.uid} color={'$textSecondaryLight'} />
        <TouchableOpacity onPress={openCowExplorer}>
          <SafeFontIcon name="external-link" size={14} color="$textSecondaryLight" />
        </TouchableOpacity>
      </View>
    ),
  }
}

export const networkRow = (chain: Chain, t: TFunction) => {
  return {
    label: t('transactions.network'),
    render: () => (
      <View flexDirection="row" alignItems="center" gap="$2">
        <Logo logoUri={chain.chainLogoUri} size="$6" />
        <Text fontSize="$4">{chain.chainName}</Text>
      </View>
    ),
  }
}

export const slippageRow = (order: OrderTransactionInfo, t: TFunction) => {
  const orderClass = getOrderClass(order)
  const slippage = getSlippageInPercent(order)

  if (orderClass === 'limit') {
    return null
  }

  return {
    label: t('swap.slippage'),
    value: `${slippage}%`,
  }
}

export const widgetFeeRow = (order: Pick<OrderTransactionInfo, 'fullAppData' | 'executedFee' | 'executedFeeToken'>, t: TFunction) => {
  const bps = getOrderFeeBps(order)

  return {
    label: t('swap.widgetFee'),
    value: `${Number(bps) / 100} %`,
  }
}

export const totalFeesRow = (
  order: Pick<OrderTransactionInfo, 'executedFee' | 'executedFeeToken' | 'sellToken' | 'buyToken' | 'kind'>,
  t: TFunction,
) => {
  const { executedFee, executedFeeToken, sellToken, buyToken, kind } = order

  // Only show if there are actual executed fees
  if (!executedFee || executedFee === '0' || !executedFeeToken) {
    return null
  }

  // executedFeeToken can be either a string or TokenInfo object
  // If it's a string, we need to determine the token from the order context
  let feeToken
  if (typeof executedFeeToken === 'string') {
    // For string type, fee is typically in surplus token (buy token for sell orders, sell token for buy orders)
    feeToken = kind === 'sell' ? buyToken : sellToken
  } else {
    // For TokenInfo type, use it directly
    feeToken = executedFeeToken
  }

  return {
    label: t('swap.totalFees'),
    value: `${formatValue(executedFee, feeToken.decimals)} ${feeToken.symbol}`,
  }
}

export const numberOfPartsRow = (order: { numberOfParts: string }, t: TFunction) => {
  return {
    label: t('swap.numberOfParts'),
    value: order.numberOfParts,
  }
}

export const partSellAmountRow = (order: {
  partSellAmount: string
  sellToken: { decimals: number; symbol: string }
}, t: TFunction) => {
  return {
    label: t('swap.sellAmount'),
    value: `${formatValue(order.partSellAmount, order.sellToken.decimals)} ${order.sellToken.symbol} per part`,
  }
}

export const partBuyAmountRow = (order: { minPartLimit: string; buyToken: { decimals: number; symbol: string } }, t: TFunction) => {
  return {
    label: t('swap.buyAmount'),
    value: `${formatValue(order.minPartLimit, order.buyToken.decimals)} ${order.buyToken.symbol} per part`,
  }
}

export const formatSwapOrderItemsForConfirmation = (txInfo: OrderTransactionInfo, chain: Chain, t: TFunction): ListTableItem[] => {
  const items = [
    priceRow(txInfo, t),
    expiryRow(txInfo, t),
    slippageRow(txInfo, t),
    orderIdRow(txInfo, t),
    networkRow(chain, t),
    statusRow(txInfo, t),
    widgetFeeRow(txInfo, t),
  ]

  return items.filter((item) => item !== null) as ListTableItem[]
}

export const formatSwapOrderItemsForHistory = (txInfo: OrderTransactionInfo, chain: Chain, t: TFunction): ListTableItem[] => {
  const items = [priceRow(txInfo, t), orderIdRow(txInfo, t), networkRow(chain, t), statusRow(txInfo, t), totalFeesRow(txInfo, t)]

  return items.filter((item) => item !== null) as ListTableItem[]
}

export const formatTwapOrderItemsForHistory = (order: TwapOrderTransactionInfo, chain: Chain, t: TFunction): ListTableItem[] => {
  const items = [
    priceRow(order, t),
    numberOfPartsRow(order, t),
    partSellAmountRow(order, t),
    partBuyAmountRow(order, t),
    expiryRow(order, t),
    orderIdRow(order, t),
    networkRow(chain, t),
    statusRow(order, t),
    totalFeesRow(order, t),
  ]

  return items.filter((item) => item !== null) as ListTableItem[]
}

export const formatTwapOrderItemsForConfirmation = (order: TwapOrderTransactionInfo, t: TFunction) => {
  const { timeBetweenParts } = order
  let startTime = ''
  if (order.startTime.startType === StartTimeValue.AT_MINING_TIME) {
    startTime = t('swap.now')
  }
  if (order.startTime.startType === StartTimeValue.AT_EPOCH) {
    startTime = t('swap.atBlockNumber', { epoch: order.startTime.epoch })
  }

  return [
    {
      renderRow: () => (
        <View flexDirection="row" alignItems="center" gap="$2">
          <Text fontSize="$4">{t('swap.orderSplitIn', { count: order.numberOfParts })}</Text>
        </View>
      ),
    },
    partSellAmountRow(order, t),
    partBuyAmountRow(order, t),
    {
      label: t('swap.startTime'),
      value: startTime,
    },
    {
      label: t('swap.partDuration'),
      value: getPeriod(+timeBetweenParts),
    },
    {
      label: t('swap.totalDuration'),
      value: getPeriod(+order.timeBetweenParts * +order.numberOfParts),
    },
  ]
}
