import ExternalLink from '@/components/common/ExternalLink'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const TX_DECODER_URL = 'https://transaction-decoder.pages.dev'
const SAFE_UTILS_URL = 'https://safeutils.openzeppelin.com'

const DecoderLinks = () => {
  const { t } = useTranslation()
  return (
    <Typography variant="body2" color="primary.light" mb={3}>
      {t('transactions.crossVerifyData')} <ExternalLink href={SAFE_UTILS_URL}>Safe Utils</ExternalLink> and{' '}
      <ExternalLink href={TX_DECODER_URL}>Transaction Decoder</ExternalLink>.
    </Typography>
  )
}

export default DecoderLinks
