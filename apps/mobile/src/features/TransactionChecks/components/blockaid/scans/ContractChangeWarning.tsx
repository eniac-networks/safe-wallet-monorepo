import React from 'react'
import { View, YStack, Text } from 'tamagui'
import type {
  ModulesChangeManagement,
  OwnershipChangeManagement,
  ProxyUpgradeManagement,
} from '@safe-global/utils/services/security/modules/BlockaidModule/types'
import { EthAddress } from '@/src/components/EthAddress'
import { Address } from '@/src/types/address'
import { CONTRACT_CHANGE_TITLES_MAPPING } from '@safe-global/utils/components/tx/security/blockaid/utils'
import { Alert } from '@/src/components/Alert'
import { useTranslation } from 'react-i18next'

const ProxyUpgradeSummary = ({ beforeAddress, afterAddress }: { beforeAddress: string; afterAddress: string }) => {
  const { t } = useTranslation()
  return (
    <YStack gap="$1">
      <Text fontSize={14} marginBottom="$2">
        {t('blockaid.verifyIntendedOwnership')}
      </Text>
      <Text fontSize={12} textTransform="uppercase">
        {t('blockaid.currentMastercopy')}
      </Text>
      <View padding="$2" borderRadius="$2" backgroundColor="$backgroundSecondary">
        <EthAddress address={beforeAddress as Address} copy={true} />
      </View>

      <Text fontSize={12} textTransform="uppercase">
        {t('blockaid.newMastercopy')}
      </Text>
      <View padding="$2" borderRadius="$2" backgroundColor="$backgroundSecondary">
        <EthAddress address={afterAddress as Address} copy={true} />
      </View>
    </YStack>
  )
}

export const ContractChangeWarning = ({
  contractChange,
}: {
  contractChange: ProxyUpgradeManagement | OwnershipChangeManagement | ModulesChangeManagement
}) => {
  const { t } = useTranslation()
  const title = CONTRACT_CHANGE_TITLES_MAPPING[contractChange.type]
  const { before, after, type } = contractChange
  const isProxyUpgrade = type === 'PROXY_UPGRADE'

  const warningContent = (
    <>
      {isProxyUpgrade && 'address' in before && 'address' in after ? (
        <ProxyUpgradeSummary beforeAddress={before.address} afterAddress={after.address} />
      ) : (
        <Text>{t('blockaid.verifyIntended')}</Text>
      )}
    </>
  )

  return <Alert type="warning" message={title} info={warningContent} />
}
