import React from 'react'
import { View } from 'tamagui'
import { CustomTransactionInfo, MultisigExecutionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { Address } from '@/src/types/address'
import { HistoryTransactionBase } from './HistoryTransactionBase'
import { useTranslation } from 'react-i18next'

interface CancelTxProps {
  txInfo: CustomTransactionInfo
  executionInfo: MultisigExecutionDetails
  txId: string
}

export function CancelTx({ txId, txInfo, executionInfo }: CancelTxProps) {
  const { t } = useTranslation()
  const recipientAddress = txInfo?.to?.value as Address

  return (
    <HistoryTransactionBase
      txId={txId}
      recipientAddress={recipientAddress}
      customLogo={
        <View borderRadius={100} padding="$2" backgroundColor="$errorDark">
          <SafeFontIcon color="$error" name="close-outlined" />
        </View>
      }
      badgeIcon="transaction-contract"
      badgeColor="$textSecondaryLight"
      transactionType={txInfo.methodName ?? t('cancelTx.onChainRejection')}
      description={t('cancelTx.description', { nonce: executionInfo.nonce })}
    />
  )
}
