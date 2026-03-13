import React, { useMemo } from 'react'
import { YStack, Text, View } from 'tamagui'
import { ListTable } from '../../ListTable'
import { BridgeAndSwapTransactionInfo, DataDecoded } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { useAppSelector } from '@/src/store/hooks'
import { selectChainById } from '@/src/store/chains'
import { TokenAmount } from '@/src/components/TokenAmount'
import { formatUnits } from 'ethers'
import { EthAddress } from '@/src/components/EthAddress'
import { type ListTableItem } from '../../ListTable'
import { BridgeRecipientWarnings } from './BridgeRecipientWarnings'
import { ChainIndicator } from '@/src/components/ChainIndicator'
import { ParametersButton } from '../../ParametersButton'
import { formatAmount } from '@safe-global/utils/utils/formatNumber'
import { ActionsRow } from '@/src/components/ActionsRow'
import { useTranslation } from 'react-i18next'

interface BridgeTransactionProps {
  txId: string
  txInfo: BridgeAndSwapTransactionInfo
  decodedData?: DataDecoded | null
}

export function BridgeTransaction({ txId, txInfo, decodedData }: BridgeTransactionProps) {
  const { t } = useTranslation()
  const activeSafe = useDefinedActiveSafe()
  const chain = useAppSelector((state) => selectChainById(state, activeSafe.chainId))

  const bridgeItems = useMemo(() => {
    const items: ListTableItem[] = []

    // Amount section
    const actualFromAmount =
      BigInt(txInfo.fromAmount) + BigInt(txInfo.fees?.integratorFee ?? 0n) + BigInt(txInfo.fees?.lifiFee ?? 0n)

    if (txInfo.status === 'PENDING' || txInfo.status === 'AWAITING_EXECUTION') {
      items.push({
        label: t('bridge.amount'),
        render: () => (
          <View flexDirection="row" alignItems="center" gap="$2" flexWrap="wrap" justifyContent="center">
            <Text>{t('bridge.sending')}</Text>
            <TokenAmount
              value={actualFromAmount.toString()}
              decimals={txInfo.fromToken.decimals}
              tokenSymbol={txInfo.fromToken.symbol}
            />
            <Text>{t('transactions.to').toLowerCase()}</Text>
            <ChainIndicator chainId={txInfo.toChain} onlyLogo />
          </View>
        ),
      })
    } else if (txInfo.status === 'FAILED') {
      items.push({
        label: t('bridge.amount'),
        render: () => (
          <View flexDirection="row" alignItems="center" gap="$2" flexWrap="wrap">
            <Text>{t('bridge.failedToSend')}</Text>
            <TokenAmount
              value={actualFromAmount.toString()}
              decimals={txInfo.fromToken.decimals}
              tokenSymbol={txInfo.fromToken.symbol}
            />
            <Text>{t('transactions.to').toLowerCase()} {txInfo.toChain}</Text>
          </View>
        ),
      })

      if (txInfo.substatus) {
        items.push({
          label: t('bridge.substatus'),
          render: () => <Text>{txInfo.substatus}</Text>,
        })
      }
    } else if (txInfo.status === 'DONE') {
      const fromAmountDecimals = formatUnits(actualFromAmount, txInfo.fromToken.decimals)
      const toAmountDecimals =
        txInfo.toAmount && txInfo.toToken ? formatUnits(txInfo.toAmount, txInfo.toToken.decimals) : undefined
      const exchangeRate = toAmountDecimals ? Number(toAmountDecimals) / Number(fromAmountDecimals) : undefined

      items.push({
        label: t('bridge.amount'),
        render: () => (
          <YStack gap="$2">
            <View flexDirection="row" alignItems="center" gap="$2" flexWrap="wrap">
              <Text>{t('swap.sell')}</Text>
              <TokenAmount
                value={actualFromAmount.toString()}
                decimals={txInfo.fromToken.decimals}
                tokenSymbol={txInfo.fromToken.symbol}
              />
              <Text>{t('bridge.on')} {chain?.chainName ?? 'Unknown Chain'}</Text>
            </View>
            {txInfo.toToken && txInfo.toAmount ? (
              <View flexDirection="row" alignItems="center" gap="$2" flexWrap="wrap">
                <Text>{t('swap.for')}</Text>
                <TokenAmount
                  value={txInfo.toAmount}
                  decimals={txInfo.toToken.decimals}
                  tokenSymbol={txInfo.toToken.symbol}
                />
                <Text>{t('bridge.on')} {txInfo.toChain}</Text>
              </View>
            ) : (
              <Text>{t('bridge.couldNotFindBuyToken')}</Text>
            )}
          </YStack>
        ),
      })

      if (exchangeRate && txInfo.toToken) {
        items.push({
          label: t('bridge.exchangeRate'),
          render: () => (
            <Text>
              1 {txInfo.fromToken.symbol} = {formatAmount(exchangeRate)} {txInfo.toToken?.symbol}
            </Text>
          ),
        })
      }
    }

    // Recipient
    items.push({
      label: t('bridge.recipient'),
      render: () => (
        <EthAddress
          address={txInfo.recipient.value as `0x${string}`}
          copy
          copyProps={{ color: '$textSecondaryLight' }}
        />
      ),
    })

    // Fees
    const totalFee = formatUnits(
      BigInt(txInfo.fees?.integratorFee ?? 0n) + BigInt(txInfo.fees?.lifiFee ?? 0n),
      txInfo.fromToken.decimals,
    )

    items.push({
      label: t('bridge.fees'),
      render: () => (
        <Text>
          {Number(totalFee).toFixed(6)} {txInfo.fromToken.symbol}
        </Text>
      ),
    })

    return items
  }, [txInfo, chain, t])

  return (
    <YStack gap="$4">
      <ListTable items={bridgeItems}>
        <ParametersButton txId={txId} />
      </ListTable>

      <BridgeRecipientWarnings txInfo={txInfo} />

      <ActionsRow txId={txId} decodedData={decodedData} />
    </YStack>
  )
}
