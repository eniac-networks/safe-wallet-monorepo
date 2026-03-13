import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { formatVisualAmount } from '@safe-global/utils/utils/formatters'
import { type TwapOrder } from '@safe-global/safe-gateway-typescript-sdk'
import { DataRow } from '@/components/common/Table/DataRow'
import { Box } from '@mui/system'

export const PartBuyAmount = ({
  order,
  addonText = '',
}: {
  order: Pick<TwapOrder, 'minPartLimit' | 'buyToken'>
  addonText?: string
}) => {
  const { t } = useTranslation()
  const { minPartLimit, buyToken } = order
  return (
    <DataRow title={t('swap.buyAmount')} key="buy_amount_part">
      <Box>
        <Typography component="span" fontWeight="bold">
          {formatVisualAmount(minPartLimit, buyToken.decimals)} {buyToken.symbol}
        </Typography>
        <Typography component="span" color="var(--color-primary-light)">
          {` ${addonText}`}
        </Typography>
      </Box>
    </DataRow>
  )
}
