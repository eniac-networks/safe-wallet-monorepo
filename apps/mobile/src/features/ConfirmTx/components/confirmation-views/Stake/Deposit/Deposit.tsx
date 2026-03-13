import React, { useMemo } from 'react'
import { ListTable } from '../../../ListTable'
import { formatStakingDepositItems, formatStakingValidatorItems } from '../utils'
import { YStack, Text, XStack } from 'tamagui'
import { TransactionHeader } from '../../../TransactionHeader'
import {
  MultisigExecutionDetails,
  NativeStakingDepositTransactionInfo,
} from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { TokenAmount } from '@/src/components/TokenAmount'
import { ParametersButton } from '../../../ParametersButton'
import { useTranslation } from 'react-i18next'

interface StakingDepositProps {
  txInfo: NativeStakingDepositTransactionInfo
  executionInfo: MultisigExecutionDetails
  txId: string
}

export function StakingDeposit({ txInfo, executionInfo, txId }: StakingDepositProps) {
  const { t } = useTranslation()
  const items = useMemo(() => formatStakingDepositItems(txInfo, t), [txInfo, t])
  const validatorItems = useMemo(() => formatStakingValidatorItems(txInfo, t), [txInfo, t])

  return (
    <YStack gap="$4">
      <TransactionHeader
        logo={txInfo.tokenInfo.logoUri ?? undefined}
        badgeIcon="transaction-stake"
        badgeColor="$textSecondaryLight"
        title={
          <XStack gap="$1">
            <TokenAmount
              value={txInfo.value}
              tokenSymbol={txInfo.tokenInfo.symbol}
              decimals={txInfo.tokenInfo.decimals}
            />
          </XStack>
        }
        submittedAt={executionInfo.submittedAt}
      />

      <ListTable items={items}>
        <ParametersButton txId={txId} />
      </ListTable>

      <ListTable items={validatorItems}>
        <Text fontSize="$3" color="$textSecondaryLight" marginTop="$2">
          {t('staking.earnEthRewards')}
        </Text>
      </ListTable>
    </YStack>
  )
}
