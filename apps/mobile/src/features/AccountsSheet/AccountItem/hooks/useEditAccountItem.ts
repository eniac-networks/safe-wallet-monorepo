import { selectActiveSafe } from '@/src/store/activeSafeSlice'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { selectMyAccountsMode } from '@/src/store/myAccountsSlice'
import { selectAllSafes } from '@/src/store/safesSlice'
import { selectSigners } from '@/src/store/signersSlice'
import { useDelegateCleanup } from '@/src/hooks/useDelegateCleanup'
import { Address } from '@/src/types/address'
import { useCallback } from 'react'
import { useNavigation } from 'expo-router'
import { handleSafeDeletion } from '../utils/editAccountHelpers'
import { useTranslation } from 'react-i18next'

export const useEditAccountItem = () => {
  const isEdit = useAppSelector(selectMyAccountsMode)
  const activeSafe = useAppSelector(selectActiveSafe)
  const safes = useAppSelector(selectAllSafes)
  const allSigners = useAppSelector(selectSigners)
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { removeAllDelegatesForOwner } = useDelegateCleanup()
  const { t } = useTranslation()

  const deleteSafe = useCallback(
    async (address: Address) => {
      const navigationConfig = {
        navigation,
        activeSafe,
        safes,
        dispatch,
      }

      await handleSafeDeletion({
        address,
        allSafesInfo: safes,
        allSigners,
        removeAllDelegatesForOwner,
        navigationConfig,
        t,
      })
    },
    [navigation, activeSafe, safes, dispatch, allSigners, removeAllDelegatesForOwner, t],
  )

  return { isEdit, deleteSafe }
}
