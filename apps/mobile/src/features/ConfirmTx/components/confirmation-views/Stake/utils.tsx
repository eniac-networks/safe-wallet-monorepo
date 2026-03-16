import { TokenAmount } from '@/src/components/TokenAmount'

import { formatCurrency } from '@safe-global/utils/utils/formatNumber'
import { formatDurationFromMilliseconds } from '@safe-global/utils/utils/formatters'
import { Text, View } from 'tamagui'
import {
  NativeStakingDepositTransactionInfo,
  NativeStakingValidatorsExitTransactionInfo,
} from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { ListTableItem } from '../../ListTable'
import { TFunction } from 'i18next'

const CURRENCY = 'USD'

export const getStakingTypeLabel = (
  type: 'NativeStakingDeposit' | 'NativeStakingValidatorsExit' | 'NativeStakingWithdraw',
  t: TFunction,
) => {
  const map = {
    NativeStakingDeposit: t('staking.deposit'),
    NativeStakingValidatorsExit: t('staking.withdrawRequest'),
    NativeStakingWithdraw: t('staking.claim'),
  }
  return map[type]
}

export const formatStakingDepositItems = (
  txInfo: NativeStakingDepositTransactionInfo,
  t: TFunction,
): ListTableItem[] => {
  // Fee is returned in decimal format, multiply by 100 for percentage
  const fee = (txInfo.fee * 100).toFixed(2)

  return [
    {
      label: t('staking.rewardsRate'),
      value: `${txInfo.annualNrr.toFixed(3)}%`,
    },
    {
      label: t('staking.netAnnualRewards'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$1">
          <TokenAmount
            value={txInfo.expectedAnnualReward}
            tokenSymbol={txInfo.tokenInfo.symbol}
            decimals={txInfo.tokenInfo.decimals}
            textProps={{ fontWeight: 400 }}
          />
          <Text color="$textSecondaryLight">({formatCurrency(txInfo.expectedFiatAnnualReward, CURRENCY)})</Text>
        </View>
      ),
    },
    {
      label: t('staking.netMonthlyRewards'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$1">
          <TokenAmount
            value={txInfo.expectedMonthlyReward}
            tokenSymbol={txInfo.tokenInfo.symbol}
            decimals={txInfo.tokenInfo.decimals}
            textProps={{ fontWeight: 400 }}
          />
          <Text color="$textSecondaryLight">({formatCurrency(txInfo.expectedFiatMonthlyReward, CURRENCY)})</Text>
        </View>
      ),
    },
    {
      label: t('swap.widgetFee'),
      value: `${fee}%`,
    },
  ]
}

export const formatStakingValidatorItems = (
  txInfo: NativeStakingDepositTransactionInfo,
  t: TFunction,
): ListTableItem[] => {
  return [
    {
      label: t('staking.validator'),
      value: `${txInfo.numValidators}`,
    },
    {
      label: t('staking.activationTime'),
      value: formatDurationFromMilliseconds(txInfo.estimatedEntryTime),
    },
    {
      label: t('staking.rewards'),
      value: t('staking.approxRewards'),
    },
  ]
}

export const formatStakingWithdrawRequestItems = (
  txInfo: NativeStakingValidatorsExitTransactionInfo,
  t: TFunction,
): ListTableItem[] => {
  const withdrawIn = formatDurationFromMilliseconds(txInfo.estimatedExitTime + txInfo.estimatedWithdrawalTime, [
    'days',
    'hours',
  ])

  return [
    {
      label: t('staking.exit'),
      value: t('staking.validatorCount', { count: txInfo.numValidators }),
    },
    {
      label: t('staking.receive'),
      render: () => (
        <TokenAmount
          value={txInfo.value}
          tokenSymbol={txInfo.tokenInfo.symbol}
          decimals={txInfo.tokenInfo.decimals}
          textProps={{ fontWeight: 600 }}
        />
      ),
    },
    {
      label: t('staking.withdrawIn'),
      value: t('staking.upTo', { duration: withdrawIn }),
    },
  ]
}
