import { useLayoutEffect, useRef } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useGuard } from '@/src/context/GuardProvider'
import { useTranslation } from 'react-i18next'

export function useSigningGuard() {
  const { getGuard } = useGuard()
  const router = useRouter()
  const { t } = useTranslation()
  const hasShownAlert = useRef(false)
  const hasEverBeenAuthorized = useRef(false)
  const canSign = getGuard('signing')

  useLayoutEffect(() => {
    // Track if we've ever been authorized
    if (canSign) {
      hasEverBeenAuthorized.current = true
    }

    // Only show alert if:
    // 1. User cannot sign AND
    // 2. We haven't shown alert before AND
    // 3. We've never been authorized (prevents alert after successful signing)
    if (!canSign && !hasShownAlert.current && !hasEverBeenAuthorized.current) {
      Alert.alert(
        t('signTransaction.somethingFishy'),
        t('signTransaction.fishyMessage'),
        [
          {
            text: t('signTransaction.goBack'),
            onPress: () => router.back(),
          },
        ],
      )
      hasShownAlert.current = true
    }
  }, [canSign, router, t])

  return { canSign }
}
