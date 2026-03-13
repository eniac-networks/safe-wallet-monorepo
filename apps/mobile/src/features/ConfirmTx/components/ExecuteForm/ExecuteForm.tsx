import { SafeButton } from '@/src/components/SafeButton'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { selectChainById } from '@/src/store/chains'
import { useAppSelector } from '@/src/store/hooks'
import { formatPrefixedAddress } from '@safe-global/utils/utils/addresses'
import React from 'react'
import { Anchor, Text, View, YStack } from 'tamagui'
import { useTranslation } from 'react-i18next'
interface ExecuteFormProps {
  safeAddress: string
  chainId: string
}

export function ExecuteForm({ safeAddress, chainId }: ExecuteFormProps) {
  const chain = useAppSelector((state) => selectChainById(state, chainId))
  const { t } = useTranslation()

  return (
    <YStack justifyContent="center" gap="$4" alignItems="center" paddingHorizontal={'$4'}>
      <Text fontSize="$4" fontWeight={400} width="70%" textAlign="center" color="$textSecondaryLight">
        {t('confirmTx.executeWebAppOnly')}
      </Text>

      <View display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap="$2">
        <Anchor
          href={`https://app.safe.global/home?safe=${formatPrefixedAddress(safeAddress, chain?.shortName)}`}
          target={'_blank'}
        >
          {t('confirmTx.goToWebApp')}
        </Anchor>

        <SafeFontIcon name="external-link" size={14} />
      </View>

      <View height={50} width="100%">
        <SafeButton height="100%" rounded fullscreen fontWeight={600} disabled>
          {t('common.confirm')}
        </SafeButton>
      </View>
    </YStack>
  )
}
