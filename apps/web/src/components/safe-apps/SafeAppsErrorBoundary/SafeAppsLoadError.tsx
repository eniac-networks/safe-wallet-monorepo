import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import NetworkError from '@/public/images/apps/network-error.svg'

import css from './styles.module.css'
import ExternalLink from '@/components/common/ExternalLink'
import { DISCORD_URL } from '@safe-global/utils/config/constants'
import { useTranslation } from 'react-i18next'

type SafeAppsLoadErrorProps = {
  onBackToApps: () => void
}

const SafeAppsLoadError = ({ onBackToApps }: SafeAppsLoadErrorProps): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <div className={css.wrapper}>
      <div className={css.content}>
        <Typography variant="h1">{t('safeApps.loadError')}</Typography>

        <SvgIcon component={NetworkError} inheritViewBox className={css.image} />

        <div>
          <Typography component="span">{t('safeApps.loadErrorContact')} </Typography>
          <ExternalLink href={DISCORD_URL} fontSize="medium">
            Discord
          </ExternalLink>
        </div>

        <Button href="#back" color="primary" onClick={onBackToApps}>
          {t('safeApps.backToApps')}
        </Button>
      </div>
    </div>
  )
}

export default SafeAppsLoadError
