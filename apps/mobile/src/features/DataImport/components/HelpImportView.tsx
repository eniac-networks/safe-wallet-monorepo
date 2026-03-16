import React from 'react'
import { Text, YStack, XStack, styled, H2 } from 'tamagui'
import { SafeButton } from '@/src/components/SafeButton'
import { TouchableOpacity } from 'react-native'
import { Badge } from '@/src/components/Badge'
import { useTranslation } from 'react-i18next'

const StepText = styled(Text, {
  fontSize: '$4',
  lineHeight: '$5',
  color: '$color',
  flex: 1,
})

const HighlightedText = styled(Text, {
  color: '$primary',
  fontWeight: '600',
})

const StepBadge = ({ step }: { step: string }) => {
  return <Badge themeName="badge_background" content={step} textContentProps={{ fontWeight: 600 }} />
}

interface HelpImportViewProps {
  bottomInset: number
  onPressProceedToImport: () => void
  onPressNeedHelp: () => void
}

export const HelpImportView = ({ bottomInset, onPressProceedToImport, onPressNeedHelp }: HelpImportViewProps) => {
  const { t } = useTranslation()
  return (
    <YStack flex={1} testID="help-import-screen">
      <YStack flex={1} paddingHorizontal="$4" justifyContent="space-between" marginTop={'$4'}>
        <YStack gap="$6">
          <H2 fontWeight={'600'} textAlign="center" marginHorizontal={'$4'}>
            {t('dataImport.howToMoveData')}
          </H2>

          <YStack gap="$4">
            <XStack gap="$3" alignItems="center">
              <StepBadge step="1" />
              <StepText>{t('dataImport.step1')}</StepText>
            </XStack>

            <XStack gap="$3" alignItems="center">
              <StepBadge step="2" />
              <StepText>
                {t('dataImport.step2GoTo')} <HighlightedText>{t('dataImport.step2Settings')}</HighlightedText> →{' '}
                <HighlightedText>{t('dataImport.step2ExportData')}</HighlightedText>.
              </StepText>
            </XStack>

            <XStack gap="$3" alignItems="center">
              <StepBadge step="3" />
              <StepText>{t('dataImport.step3')}</StepText>
            </XStack>

            <XStack gap="$3" alignItems="center">
              <StepBadge step="4" />
              <StepText>{t('dataImport.step4')}</StepText>
            </XStack>
          </YStack>
        </YStack>

        <YStack gap="$4" paddingBottom={bottomInset}>
          <SafeButton primary testID="proceed-to-import-button" onPress={onPressProceedToImport}>
            {t('dataImport.proceedToImport')}
          </SafeButton>

          <TouchableOpacity onPress={onPressNeedHelp} testID="need-help-button">
            <Text textAlign="center" fontSize="$4">
              {t('dataImport.needHelp')} <HighlightedText>{t('dataImport.visitHelpCenter')}</HighlightedText>
            </Text>
          </TouchableOpacity>
        </YStack>
      </YStack>
    </YStack>
  )
}
