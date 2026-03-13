import type { ReactElement } from 'react'
import { Alert, SvgIcon } from '@mui/material'

import InfoOutlinedIcon from '@/public/images/notifications/info.svg'
import css from './styles.module.css'
import { useTranslation } from 'react-i18next'

export const ImitationTransactionWarning = (): ReactElement => {
  const { t } = useTranslation()
  return (
    <Alert
      className={css.alert}
      sx={{ borderLeft: ({ palette }) => `3px solid ${palette['error'].main} !important` }}
      severity="error"
      icon={<SvgIcon component={InfoOutlinedIcon} inheritViewBox color="error" />}
    >
      <b>{t('transactions.imitationWarningBold')}</b> {t('transactions.imitationWarningText')}{' '}
    </Alert>
  )
}
