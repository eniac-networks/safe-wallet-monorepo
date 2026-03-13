import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { formatVisualAmount } from '@safe-global/utils/utils/formatters'
import { type TwapOrder } from '@safe-global/safe-gateway-typescript-sdk'
import { DataRow } from '@/components/common/Table/DataRow'
import { Box } from '@mui/system'

export const PartSellAmount = ({
  order,
  addonText = '',
}: {
  order: Pick<TwapOrder, 'partSellAmount' | 'sellToken'>
  addonText?: string
}) => {
  const { t } = useTranslation()
  const { partSellAmount, sellToken } = order
  return (
    <DataRow title={t('swap.sellAmount')} key="sell_amount_part">
      <Box>
        <Typography component="span" fontWeight="bold">
          {formatVisualAmount(partSellAmount, sellToken.decimals)} {sellToken.symbol}
        </Typography>
        <Typography component="span" color="var(--color-primary-light)">
          {` ${addonText}`}
        </Typography>
      </Box>
    </DataRow>
  )
}
