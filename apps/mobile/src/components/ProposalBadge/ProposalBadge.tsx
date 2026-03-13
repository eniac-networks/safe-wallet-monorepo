import { Badge } from '@/src/components/Badge'
import { Text, View } from 'tamagui'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { useTranslation } from 'react-i18next'

export const ProposalBadge = () => {
  const { t } = useTranslation()
  return (
    <Badge
      circular={false}
      content={
        <View alignItems="center" flexDirection="row" gap="$1">
          <SafeFontIcon size={12} name="info" />

          <Text fontWeight={600} color={'$color'}>
            {t('transactions.proposal')}
          </Text>
        </View>
      }
      themeName="badge_background"
    />
  )
}
