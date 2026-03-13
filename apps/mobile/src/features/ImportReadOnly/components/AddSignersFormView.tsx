import React from 'react'
import { SafeButton } from '@/src/components/SafeButton'
import { SignersList } from '@/src/features/Signers/components/SignersList'
import { type SignerSection } from '@/src/features/Signers/components/SignersList/SignersList'
import { ToastViewport } from '@tamagui/toast'
import { getTokenValue, View } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'

type AddSignersFormViewProps = {
  isFetching: boolean
  signersGroupedBySection: Record<string, SignerSection>
  signersSections: SignerSection[]
  onPress: () => void
}

export const AddSignersFormView = ({
  isFetching,
  signersGroupedBySection,
  signersSections,
  onPress,
}: AddSignersFormViewProps) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  return (
    <>
      <SignersList
        navbarTitle={t('importReadOnly.importSignersTitle')}
        isFetching={isFetching}
        hasLocalSigners={!!signersGroupedBySection.imported?.data.length}
        signersGroup={signersSections}
      />
      <View paddingTop={'$2'} paddingBottom={bottom + getTokenValue(Platform.OS === 'ios' ? '$0' : '$4')}>
        <SafeButton onPress={onPress} testID={'continue-button'}>
          {t('common.continue')}
        </SafeButton>
      </View>
      <ToastViewport multipleToasts={false} left={0} right={0} />
    </>
  )
}
