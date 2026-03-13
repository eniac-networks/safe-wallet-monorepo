import { Badge } from '@/src/components/Badge'
import { SafeBottomSheet } from '@/src/components/SafeBottomSheet'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { Link } from 'expo-router'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'
import { H3, H6, Text, View } from 'tamagui'
import { useTranslation } from 'react-i18next'

export const ConflictTxSheetContainer = () => {
  const { t } = useTranslation()
  return (
    <SafeBottomSheet>
      <View flex={1} justifyContent="center" alignItems="center">
        <Badge
          themeName="badge_error"
          circleSize={40}
          content={<SafeFontIcon size={20} color="$error" name="alert" />}
        />

        <H3 fontWeight={600} marginTop="$6" marginBottom="$4">
          {t('conflictTx.title')}
        </H3>

        <H6 textAlign="center" fontWeight={300}>
          {t('conflictTx.description')}
        </H6>

        <Link href={HelpCenterArticle.CONFLICTING_TRANSACTIONS} asChild>
          <View
            marginTop="$2"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap="$2"
            paddingVertical="$3"
            paddingHorizontal="$10"
          >
            <SafeFontIcon color="$textSecondaryLight" name="info" size={16} />
            <Text fontWeight={600} color="$textSecondaryLight">
              {t('conflictTx.whyDidItHappen')}
            </Text>
          </View>
        </Link>
      </View>
    </SafeBottomSheet>
  )
}
