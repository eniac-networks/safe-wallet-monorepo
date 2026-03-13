import React from 'react'
import { H4, Text, View } from 'tamagui'
import { useTranslation } from 'react-i18next'
import EmptyToken from './EmptyToken'
import EmptyNft from './EmptyNFT'

type Props = {
  fundsType: 'token' | 'nft'
}
export const NoFunds = ({ fundsType }: Props) => {
  const { t } = useTranslation()

  const texts = {
    token: {
      icon: <EmptyToken />,
      title: t('assets.topUpYourBalance'),
      description: t('assets.topUpDescription'),
    },
    nft: {
      icon: <EmptyNft />,
      title: t('assets.noNFTs'),
      description: t('assets.noNFTsDescription'),
    },
  }

  return (
    <View testID="empty-token" alignItems="center" gap="$2">
      {texts[fundsType].icon}
      <H4 fontWeight={600}>{texts[fundsType].title}</H4>
      <Text textAlign="center" color="$colorSecondary" width="70%" fontSize="$4">
        {texts[fundsType].description}
      </Text>
    </View>
  )
}
