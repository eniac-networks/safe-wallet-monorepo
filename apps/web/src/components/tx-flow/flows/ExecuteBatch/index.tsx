import type { Transaction } from '@safe-global/safe-gateway-typescript-sdk'
import { useTranslation } from 'react-i18next'
import TxLayout from '@/components/tx-flow/common/TxLayout'
import { ReviewBatch } from './ReviewBatch'
import BatchIcon from '@/public/images/apps/batch-icon.svg'

export type ExecuteBatchFlowProps = {
  txs: Transaction[]
}

const ExecuteBatchFlow = (props: ExecuteBatchFlowProps) => {
  const { t } = useTranslation()
  return (
    <TxLayout title={t('batch.confirmTransaction')} subtitle={t('batch.title')} icon={BatchIcon} hideNonce isBatch>
      <ReviewBatch params={props} />
    </TxLayout>
  )
}

export default ExecuteBatchFlow
