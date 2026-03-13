import React from 'react'
import { Linking } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { Text, View } from 'tamagui'
import { AppSettings } from './AppSettings'
import { useTheme } from '@/src/theme/hooks/useTheme'
import { SafeFontIcon as Icon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import { FloatingMenu } from '../FloatingMenu'
import { LoadableSwitch } from '@/src/components/LoadableSwitch'
import { useBiometrics } from '@/src/hooks/useBiometrics'
import { useNotificationManager } from '@/src/hooks/useNotificationManager'
import { useAppSelector } from '@/src/store/hooks'
import { selectAppNotificationStatus } from '@/src/store/notificationsSlice'
import { selectCurrency } from '@/src/store/settingsSlice'
import { capitalize } from '@/src/utils/formatters'
import { SAFE_WEB_FEEDBACK_URL } from '@/src/config/constants'
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/src/i18n'

export const AppSettingsContainer = () => {
  const { t } = useTranslation()
  const { toggleBiometrics, isBiometricsEnabled, isLoading: isBiometricsLoading, getBiometricsUIInfo } = useBiometrics()
  const { enableNotification, disableNotification, isLoading: isNotificationsLoading } = useNotificationManager()
  const isAppNotificationEnabled = useAppSelector(selectAppNotificationStatus)
  const currency = useAppSelector(selectCurrency)
  const { themePreference, setThemePreference } = useTheme()

  const handleToggleNotifications = () => {
    if (isAppNotificationEnabled) {
      disableNotification()
    } else {
      enableNotification()
    }
  }

  const settingsSections = [
    {
      sectionName: t('appSettings.preferences'),
      items: [
        {
          label: t('appSettings.currency'),
          leftIcon: 'token',
          onPress: () => router.push('/currency'),
          disabled: false,
          rightNode: (
            <View flexDirection="row" alignItems="center" gap={4}>
              <Text color="$colorSecondary">{currency.toUpperCase()}</Text>
              <Icon name={'chevron-right'} />
            </View>
          ),
        },
        {
          label: t('appSettings.language'),
          leftIcon: 'settings',
          onPress: () => router.push('/language'),
          disabled: false,
          rightNode: (
            <View flexDirection="row" alignItems="center" gap={4}>
              <Text color="$colorSecondary">
                {SUPPORTED_LANGUAGES[i18n.language as SupportedLanguage] ?? i18n.language.toUpperCase()}
              </Text>
              <Icon name={'chevron-right'} />
            </View>
          ),
        },
        {
          label: t('appSettings.appearance'),
          leftIcon: 'appearance',
          disabled: false,
          type: 'floating-menu',
          rightNode: (
            <FloatingMenu
              themeVariant={themePreference}
              onPressAction={({ nativeEvent }) => {
                const mode = nativeEvent.event as 'auto' | 'dark' | 'light'
                setThemePreference(mode)
              }}
              actions={[
                {
                  id: 'auto',
                  title: t('appSettings.auto'),
                },
                {
                  id: 'dark',
                  title: t('appSettings.dark'),
                },
                {
                  id: 'light',
                  title: t('appSettings.light'),
                },
              ]}
            >
              <View flexDirection="row" alignItems="center" gap={4}>
                <Text color="$colorSecondary">{capitalize(themePreference)}</Text>
                <Icon name={'chevron-down'} />
              </View>
            </FloatingMenu>
          ),
        },
      ],
    },
    {
      sectionName: t('appSettings.security'),
      items: [
        {
          label: getBiometricsUIInfo().label,
          leftIcon: getBiometricsUIInfo().icon,
          type: 'switch',
          rightNode: (
            <LoadableSwitch
              testID="toggle-app-biometrics"
              onChange={() => toggleBiometrics(!isBiometricsEnabled)}
              value={isBiometricsEnabled}
              isLoading={isBiometricsLoading}
              trackColor={{ true: '$primary' }}
            />
          ),
          disabled: false,
        },
        {
          label: t('appSettings.changePasscode'),
          leftIcon: 'lock',
          onPress: () => console.log('change passcode'),
          disabled: true,
          tag: t('appSettings.comingSoon'),
        },
      ],
    },
    {
      sectionName: t('appSettings.general'),
      items: [
        {
          label: t('appSettings.addressBook'),
          leftIcon: 'address-book',
          type: 'menu',
          onPress: () => router.push('/address-book'),
          disabled: false,
        },
        {
          label: t('appSettings.allowNotifications'),
          leftIcon: 'bell',
          type: 'switch',
          rightNode: (
            <LoadableSwitch
              testID="toggle-global-notifications"
              onChange={handleToggleNotifications}
              value={isAppNotificationEnabled}
              isLoading={isNotificationsLoading}
              trackColor={{ true: '$primary' }}
            />
          ),
          disabled: false,
        },
      ],
    },
    {
      sectionName: t('appSettings.about'),
      items: [
        {
          label: t('appSettings.rateUs'),
          leftIcon: 'star',
          onPress: () => console.log('rate us'),
          disabled: true,
          type: 'external-link',
          tag: t('appSettings.comingSoon'),
        },
        {
          label: t('appSettings.followUsOnX'),
          leftIcon: 'twitter-x',
          onPress: () => Linking.openURL('https://x.com/safe?s=21'),
          disabled: false,
          type: 'external-link',
        },
        {
          label: t('appSettings.leaveFeedback'),
          leftIcon: 'chat',
          onPress: () => Linking.openURL(SAFE_WEB_FEEDBACK_URL),
          disabled: false,
          type: 'external-link',
        },
        {
          label: t('appSettings.helpCenter'),
          leftIcon: 'question',
          onPress: () => Linking.openURL('https://help.safe.global/en/'),
          disabled: false,
          type: 'external-link',
        },
      ],
    },
  ]

  return <AppSettings sections={settingsSections} />
}
