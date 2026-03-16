import React, { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { PrivateKeyView } from './components/PrivateKeyView'
import { keyStorageService } from '@/src/services/key-storage'
import { useDelegateCleanup } from '@/src/hooks/useDelegateCleanup'
import { useAppDispatch } from '@/src/store/hooks'
import { type Address } from '@/src/types/address'
import { cleanupSinglePrivateKey } from '@/src/features/AccountsSheet/AccountItem/utils/editAccountHelpers'
import { useTranslation } from 'react-i18next'

type Props = {
  signerAddress: Address
}

export const PrivateKeyContainer = ({ signerAddress }: Props) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { removeAllDelegatesForOwner } = useDelegateCleanup()
  const { t } = useTranslation()

  const [isKeyVisible, setIsKeyVisible] = useState(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const executeViewPrivateKey = useCallback(async () => {
    setIsLoading(true)

    try {
      const key = await keyStorageService.getPrivateKey(signerAddress)

      if (!key) {
        Alert.alert(t('common.error'), t('privateKey.biometricFailed'))
        return
      }

      setPrivateKey(key)
      setIsKeyVisible(true)
    } catch (error) {
      console.error('Error retrieving private key:', error)
      Alert.alert(t('common.error'), t('privateKey.failedToRetrieve'))
    } finally {
      setIsLoading(false)
    }
  }, [signerAddress, t])

  const handleViewPrivateKey = useCallback(() => {
    Alert.alert(t('privateKey.viewConfirmTitle'), t('privateKey.viewConfirmMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('privateKey.yesShowKey'),
        style: 'destructive',
        onPress: executeViewPrivateKey,
      },
    ])
  }, [executeViewPrivateKey, t])

  const showDeleteFailureAlert = useCallback(
    (message?: string) => {
      Alert.alert(t('privateKey.cannotDelete'), message || t('privateKey.failedToUnsubscribe'), [
        { text: t('common.ok') },
      ])
    },
    [t],
  )

  const executeDeletePrivateKey = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await cleanupSinglePrivateKey(signerAddress, removeAllDelegatesForOwner, dispatch)

      if (!result.success) {
        showDeleteFailureAlert(result.error?.message)
        return
      }

      router.back()
      Alert.alert(t('common.success'), t('privateKey.deleteSuccess'))
    } catch (_error) {
      showDeleteFailureAlert(t('privateKey.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }, [signerAddress, dispatch, removeAllDelegatesForOwner, router, showDeleteFailureAlert, t])

  const handleDeletePrivateKey = useCallback(() => {
    Alert.alert(t('privateKey.deleteConfirmTitle'), t('privateKey.deleteConfirmMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('privateKey.yesDelete'),
        style: 'destructive',
        onPress: executeDeletePrivateKey,
      },
    ])
  }, [executeDeletePrivateKey, t])

  const handleHidePrivateKey = useCallback(() => {
    setIsKeyVisible(false)
    setPrivateKey(null)
  }, [])

  return (
    <PrivateKeyView
      isKeyVisible={isKeyVisible}
      privateKey={privateKey}
      isLoading={isLoading}
      onViewPrivateKey={handleViewPrivateKey}
      onDeletePrivateKey={handleDeletePrivateKey}
      onHidePrivateKey={handleHidePrivateKey}
    />
  )
}
