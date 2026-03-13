import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createMultiSendCallOnlyTx } from '@/services/tx/tx-sender'
import { SafeTxContext } from '../../SafeTxProvider'
import BatchIcon from '@/public/images/common/batch.svg'
import { useDraftBatch } from '@/hooks/useDraftBatch'
import ReviewTransaction, { type ReviewTransactionProps } from '@/components/tx/ReviewTransactionV2'
import { TxFlowType } from '@/services/analytics'
import { TxFlow } from '../../TxFlow'

type ConfirmBatchProps = {
  onSubmit: () => void
}

const ConfirmBatch = (props: ReviewTransactionProps) => {
  const { t } = useTranslation()
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)
  const batchTxs = useDraftBatch()

  useEffect(() => {
    const calls = batchTxs.map((tx) => tx.txData)
    createMultiSendCallOnlyTx(calls).then(setSafeTx).catch(setSafeTxError)
  }, [batchTxs, setSafeTx, setSafeTxError])

  return <ReviewTransaction {...props} title={t('batch.confirmBatch')} />
}

const ConfirmBatchFlow = ({ onSubmit }: ConfirmBatchProps) => {
  const { t } = useTranslation()
  const { length } = useDraftBatch()

  return (
    <TxFlow
      icon={BatchIcon}
      subtitle={t('batch.contains', { count: length })}
      eventCategory={TxFlowType.CONFIRM_BATCH}
      ReviewTransactionComponent={ConfirmBatch}
      onSubmit={onSubmit}
      isBatch
    />
  )
}

export default ConfirmBatchFlow
