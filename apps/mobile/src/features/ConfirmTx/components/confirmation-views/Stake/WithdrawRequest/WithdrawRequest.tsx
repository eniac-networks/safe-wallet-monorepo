import React, { useMemo } from 'react'
import { ListTable } from '../../../ListTable'
import { formatStakingWithdrawRequestItems } from '../utils'
import { YStack, Text, XStack } from 'tamagui'
import { TransactionHeader } from '../../../TransactionHeader'
import {
  MultisigExecutionDetails,
  NativeStakingValidatorsExitTransactionInfo,
} from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { TokenAmount } from '@/src/components/TokenAmount'
import { ParametersButton } from '../../../ParametersButton'
import { Alert } from '@/src/components/Alert'
import { useTranslation } from 'react-i18next'

interface StakingWithdrawRequestProps {
  txInfo: NativeStakingValidatorsExitTransactionInfo
  executionInfo: MultisigExecutionDetails
  txId: string
}

export function StakingWithdrawRequest({ txInfo, executionInfo, txId }: StakingWithdrawRequestProps) {
  const { t } = useTranslation()
  const withdrawRequestItems = useMemo(() => formatStakingWithdrawRequestItems(txInfo, t), [txInfo, t])

  return (
    <YStack gap="$4">
      <TransactionHeader
        logo={txInfo.tokenInfo.logoUri ?? undefined}
        badgeIcon="transaction-stake"
        badgeColor="$textSecondaryLight"
        title={
          <XStack gap="$1">
            <Text>{t('staking.receive')}</Text>
            <TokenAmount
              value={txInfo.value}
              tokenSymbol={txInfo.tokenInfo.symbol}
              decimals={txInfo.tokenInfo.decimals}
            />
          </XStack>
        }
        submittedAt={executionInfo.submittedAt}
      />

      <ListTable items={withdrawRequestItems}>
        <ParametersButton txId={txId} />
        <Text fontSize="$3" color="$textSecondaryLight">
          {t('staking.withdrawalNote')}
        </Text>
      </ListTable>

      <YStack gap="$3">
        <Alert
          type="warning"
          message={t('staking.withdrawalRequestNote')}
        />
      </YStack>
    </YStack>
  )
}
