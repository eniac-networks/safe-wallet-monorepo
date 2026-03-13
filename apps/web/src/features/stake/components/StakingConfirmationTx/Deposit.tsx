import { useTranslation } from 'react-i18next'
import { Box, Stack, Typography } from '@mui/material'
import FieldsGrid from '@/components/tx/FieldsGrid'
import type { StakingTxDepositInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { type NativeStakingDepositConfirmationView } from '@safe-global/safe-gateway-typescript-sdk'
import ConfirmationOrderHeader from '@/components/tx/ConfirmationOrder/ConfirmationOrderHeader'
import { formatDurationFromMilliseconds, formatVisualAmount } from '@safe-global/utils/utils/formatters'
import { formatCurrency } from '@safe-global/utils/utils/formatNumber'
import StakingStatus from '@/features/stake/components/StakingStatus'
import { InfoTooltip } from '@/features/stake/components/InfoTooltip'
import { BRAND_NAME } from '@/config/constants'

type StakingOrderConfirmationViewProps = {
  order: NativeStakingDepositConfirmationView | StakingTxDepositInfo
  isTxDetails?: boolean
}

const CURRENCY = 'USD'

const StakingConfirmationTxDeposit = ({ order, isTxDetails }: StakingOrderConfirmationViewProps) => {
  const { t } = useTranslation()
  const isOrder = !isTxDetails

  // the fee is returned in decimal format, so we multiply by 100 to get the percentage
  const fee = (order.fee * 100).toFixed(2)
  return (
    <Stack
      sx={{
        gap: isOrder ? 2 : 1,
      }}
    >
      {isOrder && (
        <ConfirmationOrderHeader
          blocks={[
            {
              value: order.value,
              tokenInfo: order.tokenInfo,
              label: t('stake.deposit'),
            },
            {
              value: order.annualNrr.toFixed(3) + '%',
              label: t('stake.rewardsRate'),
            },
          ]}
        />
      )}
      <FieldsGrid title={t('stake.netAnnualRewards')}>
        {formatVisualAmount(order.expectedAnnualReward, order.tokenInfo.decimals)} {order.tokenInfo.symbol}
        {' ('}
        {formatCurrency(order.expectedFiatAnnualReward, CURRENCY)})
      </FieldsGrid>
      <FieldsGrid title={t('stake.netMonthlyRewards')}>
        {formatVisualAmount(order.expectedMonthlyReward, order.tokenInfo.decimals)} {order.tokenInfo.symbol}
        {' ('}
        {formatCurrency(order.expectedFiatMonthlyReward, CURRENCY)})
      </FieldsGrid>
      <FieldsGrid
        title={
          <>
            {t('stake.fee')}
            <InfoTooltip title={t('stake.feeTooltip', { brandName: BRAND_NAME })} />
          </>
        }
      >
        {fee} %
      </FieldsGrid>
      <Stack
        {...{ [isOrder ? 'border' : 'borderTop']: '1px solid' }}
        {...(isOrder ? { p: 2, borderRadius: 1 } : { mt: 1, pt: 2, pb: 1 })}
        sx={{
          borderColor: 'border.light',
          gap: 1,
        }}
      >
        {isOrder ? (
          <Typography
            sx={{
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            {t('stake.youWillOwn')}{' '}
            <Box
              component="span"
              sx={{
                bgcolor: 'border.background',
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {t('stake.validator', { count: order.numValidators })}
            </Box>
          </Typography>
        ) : (
          <FieldsGrid title={t('stake.validators')}>{order.numValidators}</FieldsGrid>
        )}

        <FieldsGrid title={t('stake.activationTime')}>{formatDurationFromMilliseconds(order.estimatedEntryTime)}</FieldsGrid>

        <FieldsGrid title={t('stake.rewards')}>{t('stake.approxRewards')}</FieldsGrid>

        {!isOrder && (
          <FieldsGrid title={t('stake.validatorStatus')}>
            <StakingStatus status={order.status} />
          </FieldsGrid>
        )}

        {isOrder && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 2,
            }}
          >
            {t('stake.earnEthRewards')}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default StakingConfirmationTxDeposit
