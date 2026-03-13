import React from 'react'
import { Text, YStack } from 'tamagui'
import { useTranslation } from 'react-i18next'

export function ReviewHeader() {
  const { t } = useTranslation()
  return (
    <YStack space="$4" paddingTop="$4">
      <YStack space="$2">
        <Text color="$colorSecondary">
          {t('confirmTx.reviewDataHint')}
        </Text>
      </YStack>
    </YStack>
  )
}
