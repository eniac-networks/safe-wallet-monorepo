import { Text, View } from 'tamagui'
import { BlockaidMessage } from '@/src/features/TransactionChecks/components/blockaid/scans/BlockaidMessage'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const BlockaidError = () => {
  const { t } = useTranslation()
  return (
    <View backgroundColor="$backgroundSecondary" padding="$3" borderRadius="$2">
      <Text fontWeight="700" fontSize={16} marginBottom="$2">
        {t('blockaid.proceedWithCaution')}
      </Text>
      <Text fontSize={14}>{t('blockaid.couldNotCheck')}</Text>
      <BlockaidMessage />
    </View>
  )
}
