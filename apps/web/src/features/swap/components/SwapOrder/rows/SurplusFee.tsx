import { useTranslation } from 'react-i18next'
import type { TwapOrder } from '@safe-global/safe-gateway-typescript-sdk'
import { getOrderFeeBps } from '@safe-global/utils/features/swap/helpers/utils'
import { DataRow } from '@/components/common/Table/DataRow'
import { formatVisualAmount } from '@safe-global/utils/utils/formatters'
import { HelpIconTooltip } from '@/features/swap/components/HelpIconTooltip'

export const SurplusFee = ({
  order,
}: {
  order: Pick<TwapOrder, 'fullAppData' | 'executedFee' | 'executedFeeToken'>
}) => {
  const { t } = useTranslation()
  const bps = getOrderFeeBps(order)
  const { executedFee, executedFeeToken } = order

  if (!executedFee || executedFee === '0') {
    return null
  }

  return (
    <DataRow
      title={
        <>
          {t('swap.totalFees')}
          <HelpIconTooltip
            title={
              <>
                {t('swap.feesDescription')}
                {bps > 0 && ` ${t('swap.widgetFeeIncluded', { percentage: bps / 100 })}`}
              </>
            }
          />
        </>
      }
      key="widget_fee"
    >
      {formatVisualAmount(BigInt(executedFee), executedFeeToken.decimals)} {executedFeeToken.symbol}
    </DataRow>
  )
}
