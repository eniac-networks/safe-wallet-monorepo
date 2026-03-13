import React from 'react'
import { XStack, Text } from 'tamagui'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { useTranslation } from 'react-i18next'

export const PoweredByBlockaid = () => {
  const { t } = useTranslation()
  return (
    <XStack gap="$1" alignItems="center" marginTop="$2">
      <Text fontSize={12} color="$colorSecondary">
        {t('blockaid.poweredBy')}
      </Text>
      <SafeFontIcon name="shield" size={14} color="$colorSecondary" />
      <Text fontSize={12} color="$colorSecondary">
        Blockaid
      </Text>
    </XStack>
  )
}
