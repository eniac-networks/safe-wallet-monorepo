import { Alert } from '@/src/components/Alert'
import { useTranslation } from 'react-i18next'

export const TwapFallbackHandlerWarning = () => {
  const { t } = useTranslation()
  return (
    <Alert
      message={t('swap.enableTwap')}
      iconName={'info'}
      info={t('swap.twapHandlerInfo')}
      type="warning"
    />
  )
}
