import { Typography, Box } from '@mui/material'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export function _getCountdown(seconds: number): { days: number; hours: number; minutes: number } {
  const MINUTE_IN_SECONDS = 60
  const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS
  const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS

  const days = Math.floor(seconds / DAY_IN_SECONDS)

  const remainingSeconds = seconds % DAY_IN_SECONDS
  const hours = Math.floor(remainingSeconds / HOUR_IN_SECONDS)
  const minutes = Math.floor((remainingSeconds % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS)

  return { days, hours, minutes }
}

export function Countdown({ seconds }: { seconds: number }): ReactElement | null {
  const { t } = useTranslation()

  if (seconds <= 0) {
    return null
  }

  if (seconds <= 60) {
    return (
      <Typography fontWeight={700} component="span">
        {t('common.lessThanOneMin')}
      </Typography>
    )
  }

  const { days, hours, minutes } = _getCountdown(seconds)

  return (
    <Box display="flex" gap={1}>
      <TimeLeft value={days} unit={t('common.day', { count: days })} />
      <TimeLeft value={hours} unit={t('common.hr', { count: hours })} />
      <TimeLeft value={minutes} unit={t('common.min', { count: minutes })} />
    </Box>
  )
}

function TimeLeft({ value, unit }: { value: number; unit: string }): ReactElement | null {
  if (value === 0) {
    return null
  }

  return (
    <div>
      <Typography fontWeight={700} component="span">
        {value}
      </Typography>{' '}
      <Typography color="primary.light" component="span">
        {unit}
      </Typography>
    </div>
  )
}
