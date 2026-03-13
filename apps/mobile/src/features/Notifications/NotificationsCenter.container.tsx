import React from 'react'
import { H3, Text, View } from 'tamagui'
import { useTranslation } from 'react-i18next'

export const NotificationsCenterContainer = () => {
  const { t } = useTranslation()
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <H3 fontWeight={600}>{t('appSettings.comingSoon')}</H3>
      <Text textAlign="center" color="$colorSecondary" width="70%" fontSize="$4">
        {t('common.comingSoonMessage')}
      </Text>
    </View>
  )
}
