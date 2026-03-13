import { Typography, Link } from '@mui/material'

import { IS_PRODUCTION } from '@/config/constants'
import { AppRoutes } from '@/config/routes'
import WarningIcon from '@/public/images/notifications/warning.svg'

import css from '@/components/common/ErrorBoundary/styles.module.css'
import CircularIcon from '../icons/CircularIcon'
import ExternalLink from '../ExternalLink'
import { HELP_CENTER_URL } from '@safe-global/utils/config/constants'
import { useTranslation } from 'react-i18next'
interface ErrorBoundaryProps {
  error: Error
  componentStack: string
}

const ErrorBoundary = ({ error, componentStack }: ErrorBoundaryProps) => {
  const { t } = useTranslation()
  return (
    <div className={css.container}>
      <div className={css.wrapper}>
        <Typography
          variant="h3"
          sx={{
            color: 'text.primary',
          }}
        >
          {t('common.errorBoundaryTitle')}
        </Typography>

        <CircularIcon icon={WarningIcon} badgeColor="warning" />

        {IS_PRODUCTION ? (
          <Typography
            sx={{
              color: 'text.primary',
            }}
          >
            {t('common.errorPersistsMessage')}{' '}
            <ExternalLink href={HELP_CENTER_URL}>{t('common.helpCenter')}</ExternalLink>
          </Typography>
        ) : (
          <>
            {/* Error may be undefined despite what the type says */}
            <Typography color="error">{error?.toString()}</Typography>
            <Typography color="error">{componentStack}</Typography>
          </>
        )}
        <Link
          href={AppRoutes.welcome.index}
          color="primary"
          sx={{
            mt: 2,
          }}
        >
          {t('common.goHome')}
        </Link>
      </div>
    </div>
  )
}

export default ErrorBoundary
