import React from 'react'
import { ScrollView, View, Text, YStack } from 'tamagui'
import { Container } from '@/src/components/Container'
import { CopyButton } from '@/src/components/CopyButton'
import { SafeButton } from '@/src/components/SafeButton'
import { KeyboardAvoidingView, ActivityIndicator, Platform, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SafeInput } from '@/src/components/SafeInput'
import { useTranslation } from 'react-i18next'

type Props = {
  isKeyVisible: boolean
  privateKey: string | null
  isLoading: boolean
  onViewPrivateKey: () => void
  onDeletePrivateKey: () => void
  onHidePrivateKey: () => void
}

// Generate a fake 64-character hex string for display when key is hidden
const MASKED_PRIVATE_KEY = '•'.repeat(64)

export const PrivateKeyView = ({
  isKeyVisible,
  privateKey,
  isLoading,
  onViewPrivateKey,
  onDeletePrivateKey,
  onHidePrivateKey,
}: Props) => {
  const { bottom, top } = useSafeAreaInsets()
  const { t } = useTranslation()

  const displayKey = isKeyVisible && privateKey ? privateKey : MASKED_PRIVATE_KEY

  return (
    <YStack flex={1}>
      <ScrollView flex={1} contentContainerStyle={{ paddingHorizontal: '$4' }}>
        <Container marginTop={'$4'} rowGap={'$1'}>
          <Text color={'$colorSecondary'}>{t('privateKey.privateKey')}</Text>
          <SafeInput
            value={displayKey}
            editable={false}
            multiline
            numberOfLines={4}
            style={styles.input}
            right={
              isKeyVisible && privateKey ? (
                <CopyButton value={privateKey} color={'$colorSecondary'} hitSlop={2} text={t('privateKey.privateKeyCopied')} />
              ) : null
            }
          />
        </Container>

        <View marginTop={'$4'} gap={'$3'}>
          {isLoading ? (
            <SafeButton disabled>
              <ActivityIndicator color="white" />
            </SafeButton>
          ) : isKeyVisible ? (
            <SafeButton onPress={onHidePrivateKey}>{t('privateKey.hidePrivateKey')}</SafeButton>
          ) : (
            <SafeButton onPress={onViewPrivateKey}>{t('privateKey.viewPrivateKey')}</SafeButton>
          )}
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={top + bottom}>
        <View paddingHorizontal={'$4'} paddingTop={'$2'} paddingBottom={bottom ?? 60}>
          <SafeButton danger={true} onPress={onDeletePrivateKey} disabled={isLoading}>
            {t('privateKey.deletePrivateKey')}
          </SafeButton>
        </View>
      </KeyboardAvoidingView>
    </YStack>
  )
}

const styles = StyleSheet.create({
  input: {
    fontFamily: 'monospace',
    boxSizing: Platform.OS === 'android' ? 'content-box' : undefined,
    paddingBottom: 0,
    paddingTop: Platform.OS === 'android' ? 0 : 8,
  },
})
