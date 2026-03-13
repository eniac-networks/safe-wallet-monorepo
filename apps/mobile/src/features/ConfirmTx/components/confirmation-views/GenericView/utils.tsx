import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { Logo } from '@/src/components/Logo'

import { Badge } from '@/src/components/Badge'
import { ellipsis } from '@/src/utils/formatters'
import { CircleProps, Text, View } from 'tamagui'
import { shortenAddress } from '@safe-global/utils/utils/formatters'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import {
  MultisigExecutionDetails,
  TransactionData,
  TransactionDetails,
} from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { Identicon } from '@/src/components/Identicon'
import { Address } from '@/src/types/address'
import { CopyButton } from '@/src/components/CopyButton'
import { TouchableOpacity } from 'react-native'
import { TFunction } from 'i18next'

const mintBadgeProps: CircleProps = { borderRadius: '$2', paddingHorizontal: '$2', paddingVertical: '$1' }

export const formatGenericViewItems = ({
  txInfo,
  txData,
  chain,
  executionInfo,
  viewOnExplorer,
  t,
}: {
  txInfo: TransactionDetails['txInfo']
  txData: TransactionData
  chain: Chain
  executionInfo: MultisigExecutionDetails
  viewOnExplorer: () => void
  t: TFunction
}) => {
  const genericViewName = txData.to.name ? ellipsis(txData.to.name, 18) : shortenAddress(txData.to.value)

  const items = [
    {
      label: t('transactions.call'),
      render: () => (
        <Badge
          circleProps={mintBadgeProps}
          themeName="badge_background"
          fontSize={13}
          textContentProps={{ fontFamily: 'DM Mono' }}
          circular={false}
          content={txData.dataDecoded?.method ?? ''}
        />
      ),
    },
    {
      label: t('transactions.contract'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$2">
          {txData.to.logoUri ? (
            <Logo logoUri={txData.to.logoUri} size="$6" />
          ) : (
            <Identicon address={txData.to.value as Address} size={24} />
          )}
          <Text fontSize="$4">{genericViewName}</Text>
          <CopyButton value={txData.to.value} color={'$textSecondaryLight'} />

          <TouchableOpacity onPress={viewOnExplorer}>
            <SafeFontIcon name="external-link" size={14} color="$textSecondaryLight" />
          </TouchableOpacity>
        </View>
      ),
    },
  ]

  // Only show settings-specific UI for SettingsChangeTransaction
  if ('settingsInfo' in txInfo && txInfo.settingsInfo?.type === 'CHANGE_THRESHOLD') {
    items.push({
      label: t('settings.threshold'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$2">
          {txInfo.settingsInfo && 'threshold' in txInfo.settingsInfo && (
            <Text fontSize="$4">
              {txInfo.settingsInfo?.threshold}/{executionInfo.signers.length}
            </Text>
          )}

          {txInfo.settingsInfo && 'threshold' in txInfo.settingsInfo && (
            <Text textDecorationLine="line-through" color="$textSecondaryLight" fontSize="$4">
              {executionInfo.confirmationsRequired}/{executionInfo.signers.length}
            </Text>
          )}
        </View>
      ),
    })
  }

  items.push({
    label: t('transactions.network'),
    render: () => (
      <View flexDirection="row" alignItems="center" gap="$2">
        <Logo logoUri={chain.chainLogoUri} size="$6" />
        <Text fontSize="$4">{chain.chainName}</Text>
      </View>
    ),
  })

  return items
}
