import React, { useEffect, useMemo } from 'react'
import { Platform } from 'react-native'
import { useTheme } from '@/src/theme/hooks/useTheme'
import { OptIn } from '@/src/components/OptIn'
import { router, useLocalSearchParams } from 'expo-router'
import { useToastController } from '@tamagui/toast'
import { useBiometrics } from '@/src/hooks/useBiometrics'
import Logger from '@/src/utils/logger'
import { View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
function BiometricsOptIn() {
  const { t } = useTranslation()
  const { toggleBiometrics, getBiometricsUIInfo, isBiometricsEnabled, isLoading } = useBiometrics()
  const { bottom } = useSafeAreaInsets()
  const local = useLocalSearchParams<{
    safeAddress: string
    chainId: string
    import_safe: string
    txId: string
    signerAddress: string
    caller: '/import-signers' | '/sign-transaction'
  }>()

  const redirectTo = useMemo(() => {
    if (local.caller === '/import-signers') {
      return {
        pathname: '/import-signers/private-key' as const,
        params: {
          safeAddress: local.safeAddress,
          chainId: local.chainId,
          import_safe: local.import_safe,
        },
      }
    }
    return {
      pathname: '/sign-transaction' as const,
      params: {
        txId: local.txId,
        signerAddress: local.signerAddress,
      },
    }
  }, [local.caller])

  const { colorScheme, isDark } = useTheme()
  const toast = useToastController()

  useEffect(() => {
    if (isBiometricsEnabled) {
      router.dismiss()
      router.push(redirectTo)
    }
  }, [isBiometricsEnabled])

  const handleReject = () => {
    router.back()
  }

  const handleAccept = async () => {
    try {
      await toggleBiometrics(true)
    } catch (error) {
      Logger.error('Error enabling biometrics', error)
      toast.show(t('biometrics.errorEnabling'), {
        native: false,
        duration: 2000,
      })
    }
  }

  const darkImage =
    Platform.OS === 'ios'
      ? require('@/assets/images/biometrics-dark.png')
      : require('@/assets/images/biometrics-dark-android.png')

  const lightImage =
    Platform.OS === 'ios'
      ? require('@/assets/images/biometrics-light.png')
      : require('@/assets/images/biometrics-light-android.png')

  const image = isDark ? darkImage : lightImage

  return (
    <View style={{ flex: 1, paddingBottom: bottom }}>
      <OptIn
        testID="biometrics-opt-in-screen"
        title={t('biometrics.title')}
        description={t('biometrics.description')}
        image={image}
        isVisible
        isLoading={isLoading}
        colorScheme={colorScheme}
        infoMessage={t('biometrics.requiredToImportSigner')}
        ctaButton={{
          onPress: handleAccept,
          label: getBiometricsUIInfo().label,
        }}
        secondaryButton={{
          onPress: handleReject,
          label: t('common.maybeLater'),
        }}
      />
    </View>
  )
}

export default BiometricsOptIn
