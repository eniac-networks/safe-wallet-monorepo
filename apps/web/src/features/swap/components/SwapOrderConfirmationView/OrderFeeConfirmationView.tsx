import { useTranslation } from 'react-i18next'
import type { SwapOrderConfirmationView, TwapOrderConfirmationView } from '@safe-global/safe-gateway-typescript-sdk'
import { getOrderFeeBps } from '@safe-global/utils/features/swap/helpers/utils'
import { DataRow } from '@/components/common/Table/DataRow'
import { BRAND_NAME } from '@/config/constants'
import { HelpIconTooltip } from '@/features/swap/components/HelpIconTooltip'
import MUILink from '@mui/material/Link'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'

export const OrderFeeConfirmationView = ({
  order,
}: {
  order: Pick<SwapOrderConfirmationView | TwapOrderConfirmationView, 'fullAppData'>
}) => {
  const { t } = useTranslation()
  const bps = getOrderFeeBps(order)

  if (Number(bps) === 0) {
    return null
  }

  const title = (
    <>
      {t('swap.widgetFee')}{' '}
      <HelpIconTooltip
        title={
          <>
            {t('swap.widgetFeeTooltip', { brandName: BRAND_NAME })}
            <MUILink href={HelpCenterArticle.SWAP_WIDGET_FEES} target="_blank" rel="noopener noreferrer">
              {t('swap.learnMore')}
            </MUILink>
          </>
        }
      />
    </>
  )

  return (
    <DataRow datatestid="widget-fee" title={title} key="widget_fee">
      {Number(bps) / 100} %
    </DataRow>
  )
}
