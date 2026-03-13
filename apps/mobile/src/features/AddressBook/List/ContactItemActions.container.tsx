import React, { useCallback } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { AddressInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { useAppDispatch } from '@/src/store/hooks'
import { removeContact } from '@/src/store/addressBookSlice'
import { useCopyAndDispatchToast } from '@/src/hooks/useCopyAndDispatchToast'
import { useContactActions } from './hooks/useContactActions'
import { ContactListItems } from './components/List/ContactListItems'

interface ContactItemActionsContainerProps {
  contacts: AddressInfo[]
  onSelectContact: (contact: AddressInfo) => void
}

export const ContactItemActionsContainer: React.FC<ContactItemActionsContainerProps> = ({
  contacts,
  onSelectContact,
}) => {
  const dispatch = useAppDispatch()
  const copy = useCopyAndDispatchToast()
  const actions = useContactActions()
  const { t } = useTranslation()

  const handleDeleteContact = useCallback(
    (contact: AddressInfo) => {
      Alert.alert(
        t('addressBook.deleteContact'),
        t('addressBook.deleteContactConfirm'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('common.delete'),
            style: 'destructive',
            onPress: () => {
              dispatch(removeContact(contact.value))
            },
          },
        ],
        { cancelable: true },
      )
    },
    [dispatch, t],
  )

  const handleCopyContact = useCallback(
    (contact: AddressInfo) => {
      copy(contact.value as string)
    },
    [copy],
  )

  const handleMenuAction = useCallback(
    (contact: AddressInfo, actionId: string) => {
      if (actionId === 'copy') {
        return handleCopyContact(contact)
      }

      if (actionId === 'delete') {
        return handleDeleteContact(contact)
      }
    },
    [handleCopyContact, handleDeleteContact],
  )

  return (
    <ContactListItems
      contacts={contacts}
      onSelectContact={onSelectContact}
      onMenuAction={handleMenuAction}
      menuActions={actions}
    />
  )
}
