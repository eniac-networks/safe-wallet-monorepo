import { useTranslation } from 'react-i18next'
import { SvgIcon } from '@mui/material'
import type { OrderStatuses } from '@safe-global/safe-gateway-typescript-sdk'
import type { ReactElement } from 'react'
import CheckIcon from '@/public/images/common/circle-check.svg'
import ClockIcon from '@/public/images/common/clock.svg'
import BlockIcon from '@/public/images/common/block.svg'
import SignatureIcon from '@/public/images/common/document_signature.svg'
import CircleIPartialFillcon from '@/public/images/common/circle-partial-fill.svg'
import TxStatusChip, { type TxStatusChipProps } from '@/components/transactions/TxStatusChip'

type CustomOrderStatuses = OrderStatuses | 'partiallyFilled'
type Props = {
  status: CustomOrderStatuses
}

type StatusProps = {
  label: string
  color: TxStatusChipProps['color']
  icon: React.ComponentType
}

const statusMap: Record<CustomOrderStatuses, StatusProps> = {
  presignaturePending: {
    label: 'swap.executionNeeded',
    color: 'warning',
    icon: SignatureIcon,
  },
  fulfilled: {
    label: 'swap.filled',
    color: 'success',
    icon: CheckIcon,
  },
  open: {
    label: 'swap.open',
    color: 'warning',
    icon: ClockIcon,
  },
  cancelled: {
    label: 'swap.cancelled',
    color: 'error',
    icon: BlockIcon,
  },
  expired: {
    label: 'swap.expired',
    color: 'primary',
    icon: ClockIcon,
  },
  partiallyFilled: {
    label: 'swap.partiallyFilled',
    color: 'success',
    icon: CircleIPartialFillcon,
  },
}
export const StatusLabel = (props: Props): ReactElement => {
  const { t } = useTranslation()
  const { status } = props
  const { label, color, icon } = statusMap[status]

  return (
    <TxStatusChip color={color}>
      <SvgIcon component={icon} inheritViewBox fontSize="small" />
      {t(label)}
    </TxStatusChip>
  )
}

export default StatusLabel
