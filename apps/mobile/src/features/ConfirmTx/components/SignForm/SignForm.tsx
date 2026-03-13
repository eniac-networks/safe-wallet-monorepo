import React from 'react'
import { SafeAreaView } from 'react-native'
import { View } from 'tamagui'
import { SafeButton } from '@/src/components/SafeButton'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

export interface SignFormProps {
  txId: string
}

export function SignForm({ txId }: SignFormProps) {
  const { t } = useTranslation()
  const onSignPress = () => {
    router.push({
      pathname: '/review-and-confirm',
      params: { txId },
    })
  }

  return (
    <SafeAreaView style={{ gap: 24 }}>
      <View paddingHorizontal={'$3'} height={48} gap="$2" flexDirection="row">
        <SafeButton flex={1} height="100%" onPress={onSignPress}>
          {t('common.continue')}
        </SafeButton>
      </View>
    </SafeAreaView>
  )
}
