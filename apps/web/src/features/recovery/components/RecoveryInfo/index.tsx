import { useTranslation } from 'react-i18next'
import { SvgIcon, Tooltip } from '@mui/material'
import type { ReactElement } from 'react'

import WarningIcon from '@/public/images/notifications/warning.svg'

export const RecoveryInfo = ({ isMalicious }: { isMalicious: boolean }): ReactElement | null => {
  const { t } = useTranslation()
  if (!isMalicious) {
    return null
  }

  return (
    <Tooltip title={t('recovery.suspiciousActivity')} placement="top" arrow>
      <span>
        <SvgIcon component={WarningIcon} inheritViewBox color="error" />
      </span>
    </Tooltip>
  )
}
