import type { ReactNode } from 'react'
import React, { type ReactElement } from 'react'
import CopyIcon from '@/public/images/common/copy.svg'
import { IconButton, SvgIcon } from '@mui/material'
import CopyTooltip from '../CopyTooltip'
import { useTranslation } from 'react-i18next'

export interface ButtonProps {
  text: string
  className?: string
  children?: ReactNode
  initialToolTipText?: string
  ariaLabel?: string
  onCopy?: () => void
  dialogContent?: ReactElement
}

const CopyButton = ({
  text,
  className,
  children,
  initialToolTipText,
  onCopy,
  dialogContent,
}: ButtonProps): ReactElement => {
  const { t } = useTranslation()
  const tooltipText = initialToolTipText ?? t('common.copyToClipboard')
  return (
    <CopyTooltip text={text} onCopy={onCopy} initialToolTipText={tooltipText} dialogContent={dialogContent}>
      {children ?? (
        <IconButton aria-label={tooltipText} size="small" className={className}>
          <SvgIcon data-testid="copy-btn-icon" component={CopyIcon} inheritViewBox color="border" fontSize="small" />
        </IconButton>
      )}
    </CopyTooltip>
  )
}

export default CopyButton
