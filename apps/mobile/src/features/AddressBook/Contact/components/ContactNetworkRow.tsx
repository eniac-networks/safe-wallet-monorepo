import React from 'react'
import { Text, View, Theme } from 'tamagui'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { Pressable, Keyboard } from 'react-native'
import { useContactNetworkData } from '../hooks/useContactNetworkData'
import { useTranslation } from 'react-i18next'

interface ContactNetworkRowProps {
  onPress: () => void
  chainIds: string[]
}

export const ContactNetworkRow = ({ onPress, chainIds }: ContactNetworkRowProps) => {
  const { displayText } = useContactNetworkData(chainIds)
  const { t } = useTranslation()

  const handlePress = () => {
    Keyboard.dismiss()
    onPress()
  }

  return (
    <Theme name="input_with_label">
      <Pressable onPress={handlePress}>
        <View
          backgroundColor="$background"
          borderRadius={8}
          padding="$3"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <View flexDirection="row" alignItems="center" gap="$2">
            <Text fontSize="$4" fontWeight="400" color="$colorSecondary">
              {t('transactions.network')}
            </Text>
          </View>
          <View flexDirection="row" alignItems="center" gap="$2">
            <Text fontSize="$4" fontWeight="400" color="$colorSecondary">
              {displayText}
            </Text>
            <SafeFontIcon name="chevron-right" size={16} />
          </View>
        </View>
      </Pressable>
    </Theme>
  )
}
