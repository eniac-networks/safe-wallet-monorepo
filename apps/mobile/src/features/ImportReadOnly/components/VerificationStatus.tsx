import { SafeOverview } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import React from 'react'
import { Text, XStack } from 'tamagui'
import { AvailableNetworks } from '@/src/features/ImportReadOnly/components/AvailableNetworks'
import { Loader } from '@/src/components/Loader'
import { useTranslation } from 'react-i18next'

type VerificationStatusProps = {
  isLoading: boolean
  data: SafeOverview[] | undefined
  isEnteredAddressValid: boolean
}
export const VerificationStatus: React.FC<VerificationStatusProps> = ({ isLoading, data, isEnteredAddressValid }) => {
  const { t } = useTranslation()
  if (isLoading) {
    return (
      <XStack marginTop={'$4'} gap={'$1'}>
        <Loader size={16} />
        <Text marginLeft={'$1'}>{t('loadingImport.verifyingAddress')}</Text>
      </XStack>
    )
  }

  if (data?.length) {
    return <AvailableNetworks networks={data} />
  }

  return (
    <XStack marginTop={'$4'} gap={'$1'}>
      {isEnteredAddressValid && <Text color={'$error'}>{t('importReadOnly.noSafeDeployment')}</Text>}
    </XStack>
  )
}
