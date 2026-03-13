import React from 'react'
import { View } from 'tamagui'
import { SafeListItem } from '@/src/components/SafeListItem'
import { SafeFontIcon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import type { Cancellation } from '@safe-global/store/gateway/types'
import type { Transaction } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { SafeListItemProps } from '@/src/components/SafeListItem/SafeListItem'
import { useTranslation } from 'react-i18next'

type TxRejectionCardProps = {
  txInfo: Cancellation
  executionInfo?: Transaction['executionInfo']
} & Partial<SafeListItemProps>

export function TxRejectionCard({ txInfo, ...rest }: TxRejectionCardProps) {
  const { t } = useTranslation()
  return (
    <SafeListItem
      type="Rejected"
      label={txInfo.methodName || t('cancelTx.onChainRejection')}
      leftNode={
        <View borderRadius={100} padding="$2" backgroundColor="$errorDark">
          <SafeFontIcon color="$error" name="close-outlined" size={16} />
        </View>
      }
      {...rest}
    />
  )
}
