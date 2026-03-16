import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'tamagui'
import { SafeListItem } from '@/src/components/SafeListItem'
import { NotificationPermissions } from './NotificationPermissions'
import { useNotificationGTWPermissions } from '@/src/hooks/useNotificationGTWPermissions'
import { selectActiveSafe } from '@/src/store/activeSafeSlice'
import { useAppSelector } from '@/src/store/hooks'
import { LoadableSwitch } from '@/src/components/LoadableSwitch/LoadableSwitch'

type Props = {
  onChange: () => void
  value: boolean
  isLoading?: boolean
}

export const NotificationsSettingsView = ({ onChange, value, isLoading = false }: Props) => {
  const { t } = useTranslation()
  const activeSafe = useAppSelector(selectActiveSafe)
  const { getAccountType } = useNotificationGTWPermissions(activeSafe?.address as `0x${string}`, activeSafe?.chainId)

  return (
    <View paddingHorizontal="$4" marginTop="$2" style={{ flex: 1 }} testID={'notifications-popup-screen'}>
      <Text fontSize="$8" fontWeight={600} marginBottom="$2">
        {t('notifications.title')}
      </Text>
      <Text marginBottom="$4">{t('notifications.stayUpToDate')}</Text>
      <SafeListItem
        label={t('notifications.allowNotifications')}
        rightNode={
          <LoadableSwitch
            testID="toggle-app-notifications"
            onChange={onChange}
            value={value}
            isLoading={isLoading}
            trackColor={{ true: '$primary' }}
          />
        }
      />

      <NotificationPermissions accountType={getAccountType().accountType} isNotificationEnabled={value} />
    </View>
  )
}
