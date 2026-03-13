import { useCallback } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { useAppDispatch } from '@/src/store/hooks'
import { removeContact, type Contact } from '@/src/store/addressBookSlice'
import { useTranslation } from 'react-i18next'

interface UseDeleteContactParams {
  contact?: Contact | null
  setIsEditing: (isEditing: boolean) => void
}

export const useDeleteContact = ({ contact, setIsEditing }: UseDeleteContactParams) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const handleDeleteConfirm = useCallback(() => {
    if (!contact) {
      return
    }

    dispatch(removeContact(contact.value))
    setIsEditing(false)
    setTimeout(() => {
      router.back()
    }, 100)
  }, [contact, dispatch, setIsEditing])

  const handleDeletePress = useCallback(() => {
    if (!contact) {
      return
    }

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
          onPress: handleDeleteConfirm,
        },
      ],
      { cancelable: true },
    )
  }, [contact, handleDeleteConfirm, t])

  return {
    handleDeletePress,
  }
}
