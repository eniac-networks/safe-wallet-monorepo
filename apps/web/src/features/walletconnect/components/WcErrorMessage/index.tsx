import { splitError } from '@/features/walletconnect/services/utils'
import { Button, Typography } from '@mui/material'
import WcLogoHeader from '../WcLogoHeader'
import css from './styles.module.css'
import { useTranslation } from 'react-i18next'

const WcErrorMessage = ({ error, onClose }: { error: Error; onClose: () => void }) => {
  const { t } = useTranslation()
  const message = error.message || t('walletconnect.errorOccurred')
  const [summary, details] = splitError(message)

  return (
    <div className={css.errorContainer}>
      <WcLogoHeader errorMessage={summary} />

      {details && (
        <Typography mt={1} className={css.details}>
          {details}
        </Typography>
      )}

      <Button variant="contained" onClick={onClose} className={css.button}>
        {t('walletconnect.ok')}
      </Button>
    </div>
  )
}

export default WcErrorMessage
