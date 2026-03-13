import { H2, View } from 'tamagui'
import { useTranslation } from 'react-i18next'

const TransactionHeader = ({ title }: { title?: string }) => {
  const { t } = useTranslation()
  return (
    <View>
      <H2 fontWeight={600} alignSelf="flex-start" width="100%" textAlign="left">
        {title ?? t('tabs.transactions')}
      </H2>
    </View>
  )
}

export default TransactionHeader
