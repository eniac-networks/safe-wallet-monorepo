import type { ReactElement } from 'react'
import { Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { zhTW } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import { formatDateTime, formatTime, formatTimeInWords } from '@safe-global/utils/utils/date'

const DATE_LOCALES: Record<string, Locale> = {
  'zh-TW': zhTW,
}

type DateTimeProps = {
  value: number
  showDateTime: boolean
  showTime: boolean
}

export const DateTime = ({ value, showDateTime, showTime }: DateTimeProps): ReactElement => {
  const { i18n } = useTranslation()
  const dateLocale = DATE_LOCALES[i18n.language]
  const showTooltip = !showDateTime || showTime

  return (
    <Tooltip title={showTooltip && formatDateTime(value)} placement="top">
      <span>
        {showTime ? formatTime(value) : showDateTime ? formatDateTime(value) : formatTimeInWords(value, dateLocale)}
      </span>
    </Tooltip>
  )
}
