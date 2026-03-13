import React from 'react'
import { View, Text } from 'tamagui'
import { VaultDepositTransactionInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { formatPercentage } from '@safe-global/utils/utils/formatters'
import { TokenAmount } from '@/src/components/TokenAmount'
import { ListTableItem } from '../../ListTable'
import { Image } from 'expo-image'
import { TFunction } from 'i18next'

export const getVaultTypeLabel = (type: 'VaultDeposit' | 'VaultRedeem', t: TFunction) => {
  return type === 'VaultDeposit' ? t('vault.deposit') : t('vault.withdraw')
}

export const formatVaultDepositItems = (txInfo: VaultDepositTransactionInfo, t: TFunction): ListTableItem[] => {
  const annualReward = Number(txInfo.expectedAnnualReward).toFixed(0)
  const monthlyReward = Number(txInfo.expectedMonthlyReward).toFixed(0)

  return [
    {
      label: t('vault.depositVia'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$2">
          <Image source={{ uri: txInfo.vaultInfo.logoUri }} style={{ width: 24, height: 24 }} />
          <Text fontWeight="700" fontSize="$4">
            {txInfo.vaultInfo.name}
          </Text>
        </View>
      ),
    },
    {
      label: t('vault.expAnnualReward'),
      render: () => (
        <TokenAmount value={annualReward} tokenSymbol={txInfo.tokenInfo.symbol} decimals={txInfo.tokenInfo.decimals} />
      ),
    },
    {
      label: t('vault.expMonthlyReward'),
      render: () => (
        <TokenAmount value={monthlyReward} tokenSymbol={txInfo.tokenInfo.symbol} decimals={txInfo.tokenInfo.decimals} />
      ),
    },
    {
      label: t('vault.performanceFee'),
      value: formatPercentage(txInfo.fee, true),
    },
  ]
}
