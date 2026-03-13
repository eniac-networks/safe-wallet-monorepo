import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'tamagui'
import { useTranslation } from 'react-i18next'
import { AssetsCard } from '@/src/components/transactions-list/Card/AssetsCard'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'

interface AllNetworksItemProps {
  isSelected: boolean
  isReadOnly: boolean
  onSelectAll: () => void
}

export const AllNetworksItem = ({ isSelected, isReadOnly, onSelectAll }: AllNetworksItemProps) => {
  const { t } = useTranslation()
  return (
    <TouchableOpacity style={{ width: '100%' }} onPress={onSelectAll} disabled={isReadOnly}>
      <View
        backgroundColor={isSelected ? '$borderLight' : '$backgroundTransparent'}
        borderRadius="$4"
        marginBottom="$2"
      >
        <AssetsCard
          name={t('network.allNetworks')}
          description={t('network.contactAvailableAllNetworks')}
          rightNode={isSelected && <SafeFontIcon name="check" color="$color" />}
        />
      </View>
    </TouchableOpacity>
  )
}
