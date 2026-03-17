import type { ChangeEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FormControlLabel, RadioGroup, Radio, Typography } from '@mui/material'
import { trackEvent, MODALS_EVENTS } from '@/services/analytics'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectSettings, setTransactionExecution } from '@/store/settingsSlice'

import css from './styles.module.css'

const ExecuteCheckbox = ({ onChange }: { onChange: (checked: boolean) => void }): ReactElement => {
  const { t } = useTranslation()
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()

  const handleChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    const checked = value === 'true'
    trackEvent({ ...MODALS_EVENTS.TOGGLE_EXECUTE_TX, label: checked })
    dispatch(setTransactionExecution(checked))
    onChange(checked)
  }

  return (
    <>
      <Typography>{t('transactions.executeImmediately')}</Typography>

      <RadioGroup row value={String(settings.transactionExecution)} onChange={handleChange} className={css.group}>
        <FormControlLabel
          value="true"
          label={t('transactions.yesExecute')}
          control={<Radio />}
          className={css.radio}
          data-testid="execute-checkbox"
        />
        <FormControlLabel
          value="false"
          label={t('transactions.noLater')}
          control={<Radio />}
          className={css.radio}
          data-testid="sign-checkbox"
        />
      </RadioGroup>
    </>
  )
}

export default ExecuteCheckbox
