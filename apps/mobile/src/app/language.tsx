import React from 'react'
import { FlatList, Pressable } from 'react-native'
import { Text, View, YStack } from 'tamagui'
import { useTranslation } from 'react-i18next'
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/src/i18n'
import { router } from 'expo-router'
import { useAppDispatch } from '@/src/store/hooks'
import { setLocale } from '@/src/store/settingsSlice'

export default function LanguageScreen() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleSelect = (code: SupportedLanguage) => {
    i18n.changeLanguage(code)
    dispatch(setLocale(code))
    router.back()
  }

  return (
    <YStack flex={1} padding="$4">
      <Text fontSize={20} fontWeight="bold" marginBottom="$4">
        {t('language.selectLanguage')}
      </Text>
      <FlatList
        data={Object.entries(SUPPORTED_LANGUAGES) as [SupportedLanguage, string][]}
        keyExtractor={([code]) => code}
        renderItem={({ item: [code, name] }) => (
          <Pressable onPress={() => handleSelect(code)}>
            <View
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              padding="$3"
              backgroundColor="$background"
              borderRadius="$2"
              marginBottom="$2"
            >
              <Text fontSize={16}>{name}</Text>
              {(i18n.language === code || i18n.language.startsWith(code + '-')) && (
                <Text color="$primary">✓</Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </YStack>
  )
}
