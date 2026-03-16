import { useTranslation } from 'react-i18next'
import { Box, Link } from '@mui/material'
import type { StakingTxExitInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { NativeStakingStatus } from '@safe-global/safe-gateway-typescript-sdk'
import FieldsGrid from '@/components/tx/FieldsGrid'
import StakingStatus from '@/features/stake/components/StakingStatus'
import { formatDurationFromMilliseconds } from '@safe-global/utils/utils/formatters'
import { BEACON_CHAIN_EXPLORERS } from '@/features/stake/constants'
import useChainId from '@/hooks/useChainId'

const StakingTxExitDetails = ({ info }: { info: StakingTxExitInfo }) => {
  const { t } = useTranslation()
  const withdrawIn = formatDurationFromMilliseconds(info.estimatedExitTime + info.estimatedWithdrawalTime, [
    'days',
    'hours',
  ])

  return (
    <Box pr={5} display="flex" flexDirection="column" gap={1}>
      <FieldsGrid title={t('stake.exit')}>
        {info.validators.map((validator: string, index: number) => {
          return (
            <>
              <BeaconChainLink name={t('stake.validatorN', { number: index + 1 })} validator={validator} key={index} />
              {index < info.validators.length - 1 && ' | '}
            </>
          )
        })}
      </FieldsGrid>
      {info.status !== NativeStakingStatus.EXITED && (
        <FieldsGrid title={t('stake.estExitTime')}>{t('stake.upTo', { duration: withdrawIn })}</FieldsGrid>
      )}

      <FieldsGrid title={t('stake.validatorStatus')}>
        <StakingStatus status={info.status} />
      </FieldsGrid>
    </Box>
  )
}

export const BeaconChainLink = ({ validator, name }: { validator: string; name: string }) => {
  const chainId = useChainId()
  return (
    <Link
      variant="body1"
      target="_blank"
      href={`${
        BEACON_CHAIN_EXPLORERS[chainId as keyof typeof BEACON_CHAIN_EXPLORERS] ?? 'https://beaconcha.in'
      }/validator/${validator}`}
    >
      {name}
    </Link>
  )
}
export default StakingTxExitDetails
