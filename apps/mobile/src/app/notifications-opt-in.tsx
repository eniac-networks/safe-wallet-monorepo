import React, { useEffect } from 'react'
import { useTheme } from '@/src/theme/hooks/useTheme'
import { OptIn } from '@/src/components/OptIn'
import { router } from 'expo-router'
import { useNotificationManager } from '@/src/hooks/useNotificationManager'
import { useAppDispatch } from '../store/hooks'
import { updatePromptAttempts } from '@/src/store/notificationsSlice'

import { View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
function NotificationsOptIn() {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const { isAppNotificationEnabled, enableNotification, isLoading } = useNotificationManager()

  const { colorScheme, isDark } = useTheme()

  useEffect(() => {
    if (isAppNotificationEnabled) {
      router.replace('/(tabs)')
    }
  }, [isAppNotificationEnabled])

  const handleReject = () => {
    dispatch(updatePromptAttempts(1))
    router.back()
  }

  const image = isDark
    ? require('@/assets/images/notifications-dark.png')
    : require('@/assets/images/notifications-light.png')

  return (
    <View style={{ flex: 1, paddingBottom: bottom }}>
      <OptIn
        testID="notifications-opt-in-screen"
        title={t('notifications.stayInTheLoop')}
        description={t('notifications.getNotifiedDesc')}
        image={image}
        isVisible
        colorScheme={colorScheme}
        isLoading={isLoading}
        ctaButton={{
          onPress: enableNotification,
          label: t('notifications.enableNotifications'),
        }}
        secondaryButton={{
          onPress: handleReject,
          label: t('common.maybeLater'),
        }}
      />
    </View>
  )
}

export default NotificationsOptIn
