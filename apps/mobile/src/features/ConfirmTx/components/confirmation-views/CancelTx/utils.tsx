import { Logo } from '@/src/components/Logo'
import { Text, View } from 'tamagui'
import { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { TFunction } from 'i18next'

export const formatCancelTxItems = (chain: Chain, t: TFunction) => {
  return [
    {
      label: t('transactions.network'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$2">
          <Logo logoUri={chain.chainLogoUri} size="$6" />
          <Text fontSize="$4">{chain.chainName}</Text>
        </View>
      ),
    },
  ]
}
