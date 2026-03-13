import { Text, View } from 'tamagui'
import { SafeFontIcon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@/src/components/Container'
import { NOTIFICATION_ACCOUNT_TYPE } from '@/src/store/constants'

type Props = {
  accountType: NOTIFICATION_ACCOUNT_TYPE
  isNotificationEnabled: boolean
}
export const NotificationPermissions = ({ accountType, isNotificationEnabled }: Props) => {
  const { t } = useTranslation()
  const isOwner = accountType === NOTIFICATION_ACCOUNT_TYPE.OWNER

  return (
    isNotificationEnabled && (
      <Container position="relative" paddingHorizontal="$4" marginTop={'$4'}>
        <Text marginBottom="$4" fontWeight={400}>
          {t('notifications.youWillReceive')}
        </Text>
        <View flexDirection="row" alignItems="center" gap={8} marginBottom="$4">
          <SafeFontIcon name={'check-filled'} size={18} color="$success" />
          <Text fontWeight={600}>{t('notifications.incomingTransactions')}</Text>
        </View>
        <View flexDirection="row" alignItems="center" gap={8} marginBottom="$4">
          <SafeFontIcon name={'check-filled'} size={18} color="$success" />
          <Text fontWeight={600}>{t('notifications.outgoingTransactions')}</Text>
        </View>
        <View flexDirection="row" alignItems="center" gap={8} marginBottom="$4">
          <SafeFontIcon name={'check-filled'} size={18} color={isOwner ? '$success' : '$colorSecondary'} />
          <Text fontWeight={600} color={isOwner ? '$colorPrimmary' : '$colorSecondary'}>
            {t('notifications.queuedTransactions')}
          </Text>
        </View>
        {!isOwner && (
          <View flexDirection="row" alignItems="center" gap={8} marginBottom="$4">
            <Text fontWeight={400} color={'$colorSecondary'} fontSize="$3">
              {t('notifications.needSignerNote')}
            </Text>
          </View>
        )}
      </Container>
    )
  )
}
