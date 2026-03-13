import React from 'react'
import { Text, YStack, H2, XStack, ScrollView } from 'tamagui'
import { SafeButton } from '@/src/components/SafeButton'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { Container } from '@/src/components/Container'
import { Badge } from '@/src/components/Badge'
import { useTranslation } from 'react-i18next'

interface ImportSummary {
  safeAccountsCount: number
  signersCount: number
  addressBookCount: number
}

interface ReviewDataViewProps {
  bottomInset: number
  importSummary: ImportSummary
  isImportDataAvailable: boolean
  onContinue: () => void
}

export const ReviewDataView = ({
  bottomInset,
  importSummary,
  isImportDataAvailable,
  onContinue,
}: ReviewDataViewProps) => {
  const { t } = useTranslation()
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <YStack flex={1} testID="review-data-screen">
        <YStack flex={1} paddingHorizontal="$4" justifyContent="space-between" marginTop={'$4'}>
          <YStack gap="$3">
            <H2 fontWeight={'600'} textAlign="center" marginHorizontal={'$4'}>
              {t('dataImport.reviewData')}
            </H2>

            <Text fontSize="$4" textAlign="center" marginHorizontal={'$4'}>
              {t('dataImport.reviewDataDesc')}
            </Text>

            <Container gap="$3" marginTop="$4" padding="$4" backgroundColor="$background" borderRadius="$4">
              <Text color="$colorSecondary" fontSize="$3" fontWeight="500">
                {t('dataImport.importing')}
              </Text>

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$1"
                testID="safe-accounts-summary"
              >
                <XStack alignItems="center" gap="$3">
                  <Badge
                    themeName="badge_background"
                    circleSize={32}
                    content={<SafeFontIcon name="wallet" size={16} color="$color" />}
                  />
                  <YStack>
                    <Text fontSize="$4" fontWeight="500">
                      {t('dataImport.safeAccounts')}
                    </Text>
                    <Text fontSize="$2" color="$colorSecondary">
                      {t('dataImport.includingReadOnly')}
                    </Text>
                  </YStack>
                </XStack>
                <Text fontSize="$5" fontWeight="600">
                  <Badge
                    themeName="badge_background"
                    content={<Text fontWeight={600}>{importSummary.safeAccountsCount}</Text>}
                    circular
                  />
                </Text>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center" paddingVertical="$1" testID="signers-summary">
                <XStack alignItems="center" gap="$3">
                  <Badge
                    themeName="badge_background"
                    circleSize={32}
                    content={<SafeFontIcon name="key" size={16} color="$color" />}
                  />
                  <YStack>
                    <Text fontSize="$4" fontWeight="500">
                      {t('signers.signers')}
                    </Text>
                    <Text fontSize="$2" color="$colorSecondary">
                      {t('dataImport.generatedAndImported')}
                    </Text>
                  </YStack>
                </XStack>
                <Text fontSize="$5" fontWeight="600">
                  <Badge
                    themeName="badge_background"
                    content={<Text fontWeight={600}>{importSummary.signersCount}</Text>}
                    circular
                  />
                </Text>
              </XStack>

              <XStack
                justifyContent="space-between"
                alignItems="center"
                paddingVertical="$1"
                testID="address-book-summary"
              >
                <XStack alignItems="center" gap="$3">
                  <Badge
                    themeName="badge_background"
                    circleSize={32}
                    content={<SafeFontIcon name="address-book" size={16} color="$color" />}
                  />
                  <YStack>
                    <Text fontSize="$4" fontWeight="500">
                      {t('addressBook.title')}
                    </Text>
                    <Text fontSize="$2" color="$colorSecondary">
                      {t('dataImport.allAddedContacts')}
                    </Text>
                  </YStack>
                </XStack>
                <Text fontSize="$5" fontWeight="600">
                  <Badge
                    themeName="badge_background"
                    content={<Text fontWeight={600}>{importSummary.addressBookCount}</Text>}
                    circular
                  />
                </Text>
              </XStack>
            </Container>
          </YStack>

          <YStack gap="$4" paddingBottom={bottomInset}>
            <Text
              color="$colorSecondary"
              fontSize="$3"
              textAlign="center"
              marginHorizontal={'$4'}
              testID="privacy-notice"
            >
              {t('dataImport.privacyNotice')}
            </Text>

            {/* Continue button */}
            <SafeButton
              primary
              testID="continue-button"
              onPress={onContinue}
              disabled={!isImportDataAvailable}
              opacity={!isImportDataAvailable ? 0.5 : 1}
            >
              {t('dataImport.continue')}
            </SafeButton>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
