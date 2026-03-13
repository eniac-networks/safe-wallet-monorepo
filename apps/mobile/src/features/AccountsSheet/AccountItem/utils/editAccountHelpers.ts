import { Address } from '@/src/types/address'
import { AppDispatch } from '@/src/store'
import { removeSigner } from '@/src/store/signersSlice'
import { setActiveSafe } from '@/src/store/activeSafeSlice'
import { removeSafe, SafesSliceItem } from '@/src/store/safesSlice'
import { setEditMode } from '@/src/store/myAccountsSlice'
import { keyStorageService } from '@/src/services/key-storage'
import Logger from '@/src/utils/logger'
import { CommonActions } from '@react-navigation/native'
import { Alert } from 'react-native'
import { StandardErrorResult, ErrorType, createErrorResult, createSuccessResult } from '@/src/utils/errors'
import { TFunction } from 'i18next'

interface SafesCollection extends Record<string, SafesSliceItem> {}

interface SignersCollection extends Record<string, unknown> {}

export interface SafeNavigationConfig {
  navigation: {
    dispatch: (action: ReturnType<typeof CommonActions.reset>) => void
  }
  activeSafe: { address: Address; chainId: string } | null
  safes: SafesCollection
  dispatch: AppDispatch
}

export const isOwnerInOtherSafes = (
  ownerAddress: Address,
  excludeSafeAddress: Address,
  allSafesInfo: SafesCollection,
): boolean => {
  return Object.entries(allSafesInfo).some(([safeAddr, safeInfo]) => {
    if (safeAddr === excludeSafeAddress) {
      return false
    }

    return Object.values(safeInfo).some((deployment) => deployment.owners.some((owner) => owner.value === ownerAddress))
  })
}

export const getSafeOwnersWithPrivateKeys = (
  safeAddress: Address,
  allSafesInfo: SafesCollection,
  allSigners: SignersCollection,
): Address[] => {
  const safeInfo = allSafesInfo[safeAddress]
  if (!safeInfo) {
    return []
  }

  const ownersWithPrivateKeys: Address[] = []

  Object.values(safeInfo).forEach((deployment) => {
    deployment.owners.forEach((owner) => {
      const hasPrivateKey = !!allSigners[owner.value]
      if (hasPrivateKey && !ownersWithPrivateKeys.includes(owner.value as Address)) {
        ownersWithPrivateKeys.push(owner.value as Address)
      }
    })
  })

  return ownersWithPrivateKeys
}

export const getOwnersToDelete = (
  safeAddress: Address,
  allSafesInfo: SafesCollection,
  allSigners: SignersCollection,
): Address[] => {
  const ownersWithPrivateKeys = getSafeOwnersWithPrivateKeys(safeAddress, allSafesInfo, allSigners)

  return ownersWithPrivateKeys.filter((ownerAddress) => !isOwnerInOtherSafes(ownerAddress, safeAddress, allSafesInfo))
}

export const cleanupSinglePrivateKey = async (
  ownerAddress: Address,
  removeAllDelegatesForOwner: (
    ownerAddress: Address,
    ownerPrivateKey: string,
  ) => Promise<StandardErrorResult<{ processedCount: number }>>,
  dispatch: AppDispatch,
): Promise<StandardErrorResult<{ success: true }>> => {
  try {
    const privateKey = await keyStorageService.getPrivateKey(ownerAddress)
    if (!privateKey) {
      return createErrorResult(ErrorType.STORAGE_ERROR, 'Private key not found for the specified address', null, {
        ownerAddress,
      })
    }

    // Remove delegates (includes notification cleanup)
    const result = await removeAllDelegatesForOwner(ownerAddress, privateKey)

    if (!result.success) {
      return createErrorResult(
        ErrorType.CLEANUP_ERROR,
        result.error?.message || 'Failed to clean up delegates before removing private key',
        result.error,
        { ownerAddress },
      )
    }

    // Remove private key from keychain
    await keyStorageService.removePrivateKey(ownerAddress)

    // Remove from Redux store
    dispatch(removeSigner(ownerAddress))

    return createSuccessResult({ success: true as const })
  } catch (error) {
    return createErrorResult(ErrorType.SYSTEM_ERROR, 'An unexpected error occurred during private key cleanup', error, {
      ownerAddress,
    })
  }
}

export const cleanupPrivateKeysForOwners = async (
  ownerAddresses: Address[],
  removeAllDelegatesForOwner: (
    ownerAddress: Address,
    ownerPrivateKey: string,
  ) => Promise<StandardErrorResult<{ processedCount: number }>>,
  dispatch: AppDispatch,
): Promise<StandardErrorResult<{ processedCount: number; failures: { address: Address; error: unknown }[] }>> => {
  const failures: { address: Address; error: unknown }[] = []

  for (const ownerAddress of ownerAddresses) {
    const result = await cleanupSinglePrivateKey(ownerAddress, removeAllDelegatesForOwner, dispatch)

    if (!result.success) {
      Logger.error(`Failed to cleanup private key for ${ownerAddress}:`, result.error)
      failures.push({ address: ownerAddress, error: result.error })
    }
  }

  const processedCount = ownerAddresses.length - failures.length

  if (failures.length > 0) {
    return createErrorResult(
      ErrorType.CLEANUP_ERROR,
      `Failed to clean up ${failures.length} out of ${ownerAddresses.length} private keys`,
      failures,
      { processedCount, failures },
    )
  }

  return createSuccessResult({ processedCount, failures })
}

export const createDeletionMessage = (ownersWithPrivateKeys: Address[], ownersToDelete: Address[], t: TFunction): string => {
  let message = t('accounts.ownersWithPrivateKeysMessage', { count: ownersWithPrivateKeys.length })

  if (ownersToDelete.length > 0) {
    message += ' ' + t('accounts.ownersToDeleteMessage', { count: ownersToDelete.length })
  }

  if (ownersToDelete.length < ownersWithPrivateKeys.length) {
    const keysToKeep = ownersWithPrivateKeys.length - ownersToDelete.length
    message += ' ' + t('accounts.keysToKeepMessage', { count: keysToKeep })
  }

  message += ' ' + t('accounts.cannotBeUndone')
  return message
}

export const proceedWithSafeDeletion = (
  address: Address,
  { navigation, activeSafe, safes, dispatch }: SafeNavigationConfig,
): void => {
  if (activeSafe?.address === address) {
    const [nextAddress, nextInfo] = Object.entries(safes).find(([addr]) => addr !== address) || [null, null]

    if (nextAddress && nextInfo) {
      const firstChain = Object.keys(nextInfo)[0]
      dispatch(
        setActiveSafe({
          address: nextAddress as Address,
          chainId: firstChain,
        }),
      )
    } else {
      // If we are here it means that the user has deleted all safes
      // We need to reset the navigation to the onboarding screen
      // Otherwise the app will crash as there is no active safe
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: 'onboarding' }],
        }),
      )

      dispatch(setEditMode(false))
      dispatch(setActiveSafe(null))
    }
  }

  dispatch(removeSafe(address))
}

interface HandleConfirmedDeletionParams {
  address: Address
  ownersToDelete: Address[]
  removeAllDelegatesForOwner: (
    ownerAddress: Address,
    ownerPrivateKey: string,
  ) => Promise<StandardErrorResult<{ processedCount: number }>>
  navigationConfig: SafeNavigationConfig
  resolve: () => void
  reject: (error: Error) => void
  t: TFunction
}

const handleConfirmedDeletion = async (params: HandleConfirmedDeletionParams) => {
  const { address, ownersToDelete, removeAllDelegatesForOwner, navigationConfig, resolve, reject, t } = params
  try {
    if (ownersToDelete.length === 0) {
      proceedWithSafeDeletion(address, navigationConfig)
      resolve()
      return
    }

    const cleanupResult = await cleanupPrivateKeysForOwners(
      ownersToDelete,
      removeAllDelegatesForOwner,
      navigationConfig.dispatch,
    )

    if (!cleanupResult.success) {
      Logger.error('Failed to clean up private keys during safe deletion:', cleanupResult.error)
      Alert.alert(t('common.error'), cleanupResult.error?.message || t('accounts.failedToDeletePrivateKeys'))
      reject(new Error(cleanupResult.error?.message || t('accounts.failedToDeletePrivateKeys')))
      return
    }

    proceedWithSafeDeletion(address, navigationConfig)
    resolve()
  } catch (error) {
    Logger.error('Failed to clean up private keys during safe deletion:', error)
    Alert.alert(t('common.error'), t('accounts.failedToDeletePrivateKeys'))
    reject(error as Error)
  }
}

interface HandleSafeDeletionParams {
  address: Address
  allSafesInfo: SafesCollection
  allSigners: SignersCollection
  removeAllDelegatesForOwner: (
    ownerAddress: Address,
    ownerPrivateKey: string,
  ) => Promise<StandardErrorResult<{ processedCount: number }>>
  navigationConfig: SafeNavigationConfig
  t: TFunction
}

export const handleSafeDeletion = async (params: HandleSafeDeletionParams): Promise<void> => {
  const { address, allSafesInfo, allSigners, removeAllDelegatesForOwner, navigationConfig, t } = params
  const ownersWithPrivateKeys = getSafeOwnersWithPrivateKeys(address, allSafesInfo, allSigners)
  const ownersToDelete = getOwnersToDelete(address, allSafesInfo, allSigners)

  if (ownersWithPrivateKeys.length === 0) {
    proceedWithSafeDeletion(address, navigationConfig)
    return
  }

  const message = createDeletionMessage(ownersWithPrivateKeys, ownersToDelete, t)
  const buttonTitle = ownersToDelete.length > 0 ? t('accounts.deleteAccountAndPrivateKeys') : t('accounts.deleteAccount')

  return new Promise((resolve, reject) => {
    Alert.alert(t('accounts.deleteAccount'), message, [
      {
        text: t('common.cancel'),
        style: 'cancel',
        onPress: () => reject(new Error('User cancelled deletion')),
      },
      {
        text: buttonTitle,
        style: 'destructive',
        onPress: () =>
          handleConfirmedDeletion({
            address,
            ownersToDelete,
            removeAllDelegatesForOwner,
            navigationConfig,
            resolve,
            reject,
            t,
          }),
      },
    ])
  })
}
