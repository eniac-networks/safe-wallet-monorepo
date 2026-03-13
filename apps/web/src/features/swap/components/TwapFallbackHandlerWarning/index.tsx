import { useTranslation } from 'react-i18next'
import { Alert, SvgIcon } from '@mui/material'
import InfoOutlinedIcon from '@/public/images/notifications/info.svg'

export const TwapFallbackHandlerWarning = () => {
  const { t } = useTranslation()
  return (
    <Alert
      severity="warning"
      icon={<SvgIcon component={InfoOutlinedIcon} inheritViewBox color="error" />}
      sx={{ mb: 1 }}
    >
      <b>{t('swap.enableTwaps')}</b>
      {` `}
      {t('swap.twapWarning')}
    </Alert>
  )
}
