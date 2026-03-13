import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { ContactDetailContainer } from '@/src/features/AddressBook'
import { useTranslation } from 'react-i18next'

function ContactScreen() {
  const { t } = useTranslation()
  const { mode } = useLocalSearchParams<{ mode?: 'view' | 'edit' | 'new' }>()

  const getTitle = () => {
    switch (mode) {
      case 'new':
        return t('addressBook.newContact')
      case 'edit':
        return t('addressBook.editContact')
      case 'view':
      default:
        return t('addressBook.contact')
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: getTitle() }} />
      <ContactDetailContainer />
    </>
  )
}

export default ContactScreen
