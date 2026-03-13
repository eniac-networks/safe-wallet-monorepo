import { useTranslation } from 'react-i18next'
import { NativeStakingStatus } from '@safe-global/safe-gateway-typescript-sdk'
import { SvgIcon } from '@mui/material'
import CheckIcon from '@/public/images/common/circle-check.svg'
import ClockIcon from '@/public/images/common/clock.svg'
import SlashShield from '@/public/images/common/shield-off.svg'
import SignatureIcon from '@/public/images/common/document_signature.svg'
import TxStatusChip, { type TxStatusChipProps } from '@/components/transactions/TxStatusChip'

const ColorIcons: Record<
  NativeStakingStatus,
  | {
      color: TxStatusChipProps['color']
      icon?: React.ComponentType
      text: string
    }
  | undefined
> = {
  [NativeStakingStatus.NOT_STAKED]: {
    color: 'warning',
    icon: SignatureIcon,
    text: 'stake.statusInactive',
  },
  [NativeStakingStatus.ACTIVATING]: {
    color: 'info',
    icon: ClockIcon,
    text: 'stake.statusActivating',
  },
  [NativeStakingStatus.DEPOSIT_IN_PROGRESS]: {
    color: 'info',
    icon: ClockIcon,
    text: 'stake.statusAwaitingEntry',
  },
  [NativeStakingStatus.ACTIVE]: {
    color: 'success',
    icon: CheckIcon,
    text: 'stake.statusValidating',
  },
  [NativeStakingStatus.EXIT_REQUESTED]: {
    color: 'info',
    icon: ClockIcon,
    text: 'stake.statusRequestedExit',
  },
  [NativeStakingStatus.EXITING]: {
    color: 'info',
    icon: ClockIcon,
    text: 'stake.statusRequestPending',
  },
  [NativeStakingStatus.EXITED]: {
    color: 'success',
    icon: CheckIcon,
    text: 'stake.statusWithdrawn',
  },
  [NativeStakingStatus.SLASHED]: {
    color: 'warning',
    icon: SlashShield,
    text: 'stake.statusSlashed',
  },
}

const capitalizedStatus = (status: string) =>
  status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/g, (l) => l.toUpperCase())

const StakingStatus = ({ status }: { status: NativeStakingStatus }) => {
  const { t } = useTranslation()
  const config = ColorIcons[status]

  return (
    <TxStatusChip color={config?.color}>
      {config?.icon && <SvgIcon component={config.icon} fontSize="small" inheritViewBox />}
      {config?.text ? t(config.text) : capitalizedStatus(status)}
    </TxStatusChip>
  )
}

export default StakingStatus
