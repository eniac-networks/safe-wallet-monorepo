import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ScrollView, Text, View, YStack } from 'tamagui'
import { Badge } from '@/src/components/Badge'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { LargeHeaderTitle } from '@/src/components/Title'
import { SafeButton } from '@/src/components/SafeButton'
import { useTranslation } from 'react-i18next'

interface ImportErrorViewProps {
  colors: [string, string]
  bottomInset: number
  onTryAgain: () => void
}

export const ImportErrorView = ({ colors, bottomInset, onTryAgain }: ImportErrorViewProps) => {
  const { t } = useTranslation()
  return (
    <YStack flex={1} testID="import-error-screen" paddingBottom={bottomInset}>
      <LinearGradient colors={colors} style={styles.background} />
      <View flex={1} justifyContent="space-between">
        <View flex={1}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
              flex={1}
              flexGrow={1}
              alignItems="center"
              marginTop="$10"
              justifyContent="center"
              paddingHorizontal="$3"
            >
              <Badge
                themeName="badge_error"
                circleSize={64}
                content={<SafeFontIcon size={32} color="$error" name="close-filled" />}
              />

              <View margin="$4" width="100%" alignItems="center" gap="$4">
                <LargeHeaderTitle textAlign="center" size="$8" lineHeight={32} maxWidth={200} fontWeight={600}>
                  {t('dataImport.importFailed')}
                </LargeHeaderTitle>

                <Text textAlign="center" fontSize="$4" width="80%">
                  {t('dataImport.importFailedDesc')}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View paddingHorizontal="$4" gap="$4">
          <SafeButton onPress={onTryAgain}>{t('dataImport.tryAgain')}</SafeButton>
        </View>
      </View>
    </YStack>
  )
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
})
