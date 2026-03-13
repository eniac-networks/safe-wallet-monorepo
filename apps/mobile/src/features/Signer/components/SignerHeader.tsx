import { useLocalSearchParams } from 'expo-router'
import { Text } from 'tamagui'
import { useTranslation } from 'react-i18next'

export const SignerHeader = () => {
  const { t } = useTranslation()
  const { title } = useLocalSearchParams<{ title: string }>()
  return <Text>{title || t('signer.signer')}</Text>
}
