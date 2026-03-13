import React from 'react'
import { Text, YStack, Image, styled, H2, H5, getTokenValue } from 'tamagui'
import { SafeButton } from '@/src/components/SafeButton'
import TransferOldAppDark from '@/assets/images/transfer-old-app-dark.png'
import TransferOldAppLight from '@/assets/images/transfer-old-app-light.png'
import { ColorSchemeName } from 'react-native'
import { GradientText } from '@/src/components/GradientText'
import { useTranslation } from 'react-i18next'

const StyledText = styled(Text, {
  fontSize: '$4',
  textAlign: 'center',
})

interface DataTransferViewProps {
  colorScheme: ColorSchemeName
  bottomInset: number
  onPressTransferData: () => void
  onPressStartFresh: () => void
}

export const DataTransferView = ({
  colorScheme,
  bottomInset,
  onPressTransferData,
  onPressStartFresh,
}: DataTransferViewProps) => {
  const { t } = useTranslation()
  return (
    <YStack flex={1} paddingTop={'$4'} testID="data-transfer-screen">
      {/* Content */}
      <YStack flex={1} paddingHorizontal="$4" justifyContent="space-between" marginBottom={'$4'}>
        <YStack gap="$4" alignItems="center">
          {colorScheme === 'dark' ? (
            <GradientText
              colors={[getTokenValue('$color.infoMainDark'), getTokenValue('$color.primaryMainDark')]}
              fontWeight={'600'}
              color="$green9"
              fontSize="$5"
              textAlign="center"
              gradientStart={{ x: 0, y: 0 }}
              gradientEnd={{ x: 1, y: 0 }}
            >
              {t('dataImport.stillHaveOldApp')}
            </GradientText>
          ) : (
            <H5 fontWeight={'600'} color="$colorSecondary">
              {t('dataImport.stillHaveOldApp')}
            </H5>
          )}

          <H2 fontWeight={'600'} textAlign="center">
            {t('dataImport.importOldAppData')}
          </H2>

          <StyledText>{t('dataImport.moveYourData')}</StyledText>
        </YStack>

        {/* Phone Mockup */}
        <Image source={colorScheme === 'dark' ? TransferOldAppDark : TransferOldAppLight} />
      </YStack>

      {/* Bottom Buttons */}
      <YStack gap="$3" paddingHorizontal="$4" paddingBottom={bottomInset} paddingTop="$4">
        <SafeButton primary testID="transfer-data-button" onPress={onPressTransferData}>
          {t('dataImport.importData')}
        </SafeButton>

        <SafeButton text testID="start-fresh-button" onPress={onPressStartFresh}>
          {t('dataImport.startFresh')}
        </SafeButton>
      </YStack>
    </YStack>
  )
}
