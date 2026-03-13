import { useTranslation } from 'react-i18next'
import { DataRow } from '@/components/common/Table/DataRow'
import { type TwapOrder } from '@safe-global/safe-gateway-typescript-sdk'
import { getPeriod } from '@safe-global/utils/utils/date'

export const PartDuration = ({ order }: { order: Pick<TwapOrder, 'timeBetweenParts'> }) => {
  const { t } = useTranslation()
  const { timeBetweenParts } = order
  return (
    <DataRow title={t('swap.partDuration')} key="part_duration">
      {getPeriod(+timeBetweenParts)}
    </DataRow>
  )
}
