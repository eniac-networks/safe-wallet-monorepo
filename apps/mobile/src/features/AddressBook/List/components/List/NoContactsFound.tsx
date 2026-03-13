import React from 'react'
import { useTheme } from '@/src/theme/hooks/useTheme'
import { Text, View } from 'tamagui'
import EmptyAddressBookLight from './EmptyAddressBookLight'
import EmptyAddressBookDark from './EmptyAddressBookDark'
import { useTranslation } from 'react-i18next'

export const NoContactsFound = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const EmptyAddress = isDark ? <EmptyAddressBookDark /> : <EmptyAddressBookLight />

  return (
    <View testID="empty-token" alignItems="center" flex={1} justifyContent="center" gap="$4">
      {EmptyAddress}
      <Text textAlign="center" color="$colorSecondary" width="70%" fontSize="$4">
        {t('addressBook.noContactsFound')}
      </Text>
    </View>
  )
}
