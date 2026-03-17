import { useTranslation } from 'react-i18next'
import ErrorMessage from '@/components/tx/ErrorMessage'

const NonOwnerError = () => {
  const { t } = useTranslation()
  return <ErrorMessage>{t('transactions.notASigner')}</ErrorMessage>
}

export default NonOwnerError
