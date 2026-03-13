import React from 'react'

import { H3, Text, View } from 'tamagui'
import EmptyBell from './EmptyBell'
import { useTranslation } from 'react-i18next'

export const NotificationsScreenEmpty = () => {
  const { t } = useTranslation()
  return (
    <View testID="empty-notifications" alignItems="center" gap="$4" marginTop="$6">
      <EmptyBell />
      <H3 fontWeight={600}>{t('notifications.allCaughtUp')}</H3>
      <Text textAlign="center" color="$colorSecondary" width="70%" fontSize="$4">
        {t('notifications.noPendingActivity')}
      </Text>
    </View>
  )
}
