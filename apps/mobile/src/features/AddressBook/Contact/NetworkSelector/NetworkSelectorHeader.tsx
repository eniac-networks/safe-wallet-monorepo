import React from 'react'
import { Text, View } from 'tamagui'
import { useTranslation } from 'react-i18next'

interface NetworkSelectorHeaderProps {
  isReadOnly: boolean
  isAllChainsSelected: boolean
  selectedChainCount: number
}

interface TitleProps {
  isReadOnly: boolean
}

interface SubtitleProps {
  isReadOnly: boolean
  isAllChainsSelected: boolean
  selectedChainCount: number
}

const Title = ({ isReadOnly }: TitleProps) => {
  const { t } = useTranslation()
  const title = isReadOnly ? t('network.availableNetworks') : t('network.selectNetworks')

  return (
    <Text fontSize="$6" fontWeight="600" color="$color">
      {title}
    </Text>
  )
}

const Subtitle = ({ isReadOnly, isAllChainsSelected, selectedChainCount }: SubtitleProps) => {
  const { t } = useTranslation()
  const unit = selectedChainCount === 1 ? t('network.networkSingular') : t('network.networkPlural')

  let text: string
  if (isAllChainsSelected) {
    text = isReadOnly ? t('network.readOnlyAvailableAll') : t('network.editableAvailableAll')
  } else {
    text = isReadOnly
      ? t('network.readOnlyAvailableCount', { count: selectedChainCount, unit })
      : t('network.editableAvailableCount', { count: selectedChainCount, unit })
  }

  return (
    <Text fontSize="$3" color="$colorSecondary" textAlign="center" marginTop="$2">
      {text}
    </Text>
  )
}

export const NetworkSelectorHeader = ({
  isReadOnly,
  isAllChainsSelected,
  selectedChainCount,
}: NetworkSelectorHeaderProps) => {
  return (
    <View alignItems="center" paddingHorizontal="$4" paddingVertical="$4">
      <Title isReadOnly={isReadOnly} />
      <Subtitle
        isReadOnly={isReadOnly}
        isAllChainsSelected={isAllChainsSelected}
        selectedChainCount={selectedChainCount}
      />
    </View>
  )
}
