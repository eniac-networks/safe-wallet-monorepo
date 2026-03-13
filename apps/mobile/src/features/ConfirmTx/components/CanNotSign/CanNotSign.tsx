import React from 'react'
import { Text, YStack } from 'tamagui'
import { useTranslation } from 'react-i18next'

export function CanNotSign() {
  const { t } = useTranslation()
  return (
    <YStack gap="$4" padding="$2" alignItems="center" justifyContent="center" testID="can-not-sign-container">
      <Text fontSize="$4" fontWeight={400} width="70%" textAlign="center" color="$textSecondaryLight">
        {t('confirmTx.onlySignersCanSign')}
      </Text>
    </YStack>
  )
}
