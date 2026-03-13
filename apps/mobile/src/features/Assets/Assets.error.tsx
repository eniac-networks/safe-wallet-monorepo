import { SafeButton } from ‘@/src/components/SafeButton’
import React from ‘react’
import { H6, Text, View } from ‘tamagui’
import { SafeFontIcon } from ‘@/src/components/SafeFontIcon/SafeFontIcon’
import { useTranslation } from ‘react-i18next’

export const AssetError = ({ assetType, onRetry }: { assetType: ‘token’ | ‘nft’; onRetry: () => void }) => {
  const { t } = useTranslation()
  const title = assetType === ‘token’ ? t(‘assets.couldNotLoadTokens’) : t(‘assets.couldNotLoadNFTs’)

  return (
    <View testID="token-error" alignItems="center" gap="$4" marginTop={‘$4’}>
      <H6 fontWeight={600}>{title}</H6>
      <Text textAlign="center" color="$colorSecondary" width="80%">
        {t(‘assets.loadError’)}
      </Text>
      <SafeButton backgroundColor="$backgroundSecondary" color="$colorPrimary" onPress={onRetry}>
        <SafeFontIcon size={16} name="update" color="$colorPrimary" />
        {t(‘common.retry’)}
      </SafeButton>
    </View>
  )
}
