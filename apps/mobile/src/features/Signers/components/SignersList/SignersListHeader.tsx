import React from 'react'
import { View } from 'tamagui'
import { Alert } from '@/src/components/Alert'
import { SectionTitle } from '@/src/components/Title'
import { useTranslation } from 'react-i18next'

interface SignersListHeaderProps {
  withAlert: boolean
  sectionTitle?: string
}

export function SignersListHeader({ withAlert, sectionTitle }: SignersListHeaderProps) {
  const { t } = useTranslation()
  return (
    <View gap="$6">
      <SectionTitle
        paddingHorizontal={'$0'}
        title={sectionTitle || t('signers.signers')}
        description={t('signers.signersDescription')}
      />

      {withAlert && (
        <View marginBottom={'$2'}>
          <Alert
            type="warning"
            message={t('signers.beforeImportTitle')}
            info={t('signers.beforeImportWarning')}
            orientation="left"
          />
        </View>
      )}
    </View>
  )
}
