import React from 'react'
import { Alert, AlertTitle } from '@mui/material'
import ExternalLink from '@/components/common/ExternalLink'

import { HelpCenterArticle } from '@safe-global/utils/config/constants'
import { useTranslation } from 'react-i18next'

type ThirdPartyCookiesWarningProps = {
  onClose: () => void
}

export const ThirdPartyCookiesWarning = ({ onClose }: ThirdPartyCookiesWarningProps): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <Alert
      severity="warning"
      onClose={onClose}
      sx={({ palette }) => ({
        background: palette.warning.light,
        border: 0,
        borderBottom: `1px solid ${palette.warning.main}`,
        borderRadius: '0px !important',
      })}
    >
      <AlertTitle>
        {t('safeApps.thirdPartyCookiesTitle')}{' '}
        <ExternalLink href={HelpCenterArticle.COOKIES} fontSize="inherit">
          {t('safeApps.cookiesWarningHere')}
        </ExternalLink>
      </AlertTitle>
    </Alert>
  )
}
