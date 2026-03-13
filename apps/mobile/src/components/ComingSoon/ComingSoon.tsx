import React from 'react'
import { H6, Text, View } from 'tamagui'
import { useTranslation } from 'react-i18next'

export const ComingSoon = () => {
  const { t } = useTranslation()
  return (
    <View testID="coming-soon" alignItems="center" justifyContent="center" gap="$4" height="100%">
      <H6 fontWeight={600}>{t('appSettings.comingSoon')}</H6>
      <Text textAlign="center" color="$colorSecondary" width="80%">
        {t('common.comingSoonMessage')}
      </Text>
    </View>
  )
}
