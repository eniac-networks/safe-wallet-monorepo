import { SafeOverview } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import { Text, XStack, YStack } from 'tamagui'
import { NetworkBadgeContainer } from '@/src/features/ImportReadOnly/NetworkBadge.container'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const AvailableNetworks = ({ networks }: { networks: SafeOverview[] }) => {
  const { t } = useTranslation()
  return (
    <YStack marginTop={'$4'} gap={'$1'}>
      <Text fontWeight={'600'}>{t('importReadOnly.availableOnNetworks')}</Text>
      <XStack marginTop={'$3'} flexWrap={'wrap'} columnGap={'$1'} rowGap={'$2'}>
        {networks?.map((safe) => <NetworkBadgeContainer key={safe.chainId} chainId={safe.chainId} />)}
      </XStack>
    </YStack>
  )
}
