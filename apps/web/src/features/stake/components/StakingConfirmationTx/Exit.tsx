import { useTranslation } from 'react-i18next'
import { Alert, Stack, Typography } from '@mui/material'
import FieldsGrid from '@/components/tx/FieldsGrid'
import { formatDurationFromMilliseconds } from '@safe-global/utils/utils/formatters'
import ConfirmationOrderHeader from '@/components/tx/ConfirmationOrder/ConfirmationOrderHeader'
import { InfoTooltip } from '@/features/stake/components/InfoTooltip'
import type { StakingTxExitInfo } from '@safe-global/safe-gateway-typescript-sdk'

type StakingOrderConfirmationViewProps = {
  order: StakingTxExitInfo
}

const StakingConfirmationTxExit = ({ order }: StakingOrderConfirmationViewProps) => {
  const { t } = useTranslation()
  const withdrawIn = formatDurationFromMilliseconds(order.estimatedExitTime + order.estimatedWithdrawalTime, [
    'days',
    'hours',
  ])

  return (
    <Stack
      sx={{
        gap: 2,
      }}
    >
      <ConfirmationOrderHeader
        blocks={[
          {
            value: `${order.numValidators} ${t('stake.validators')}`,
            label: t('stake.exit'),
          },
          {
            value: order.value,
            tokenInfo: order.tokenInfo,
            label: t('stake.receive'),
          },
        ]}
      />
      <FieldsGrid
        title={
          <>
            {t('stake.withdrawIn')}
            <InfoTooltip
              title={
                <>
                  {t('stake.withdrawTooltipHeader')}
                  <ul>
                    <li>{t('stake.withdrawTooltipItem1')}</li>
                    <li>{t('stake.withdrawTooltipItem2')}</li>
                  </ul>
                </>
              }
            />
          </>
        }
      >
        {t('stake.upTo', { duration: withdrawIn })}
      </FieldsGrid>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mt: 2,
        }}
      >
        {t('stake.withdrawDescription')}
      </Typography>
      <Alert severity="warning" sx={{ mb: 1 }}>
        {t('stake.withdrawWarning')}
      </Alert>
    </Stack>
  )
}

export default StakingConfirmationTxExit
