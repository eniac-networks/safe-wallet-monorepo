import { type PropsWithChildren, type ReactElement, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { useChainId } from '@/hooks/useChainId'
import { createExistingTx } from '@/services/tx/tx-sender'
import ReviewTransaction from '@/components/tx/ReviewTransactionV2'
import type { ReviewTransactionContentProps } from '@/components/tx/ReviewTransactionV2/ReviewTransactionContent'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import { TxFlowContext } from '@/components/tx-flow/TxFlowProvider'

type ConfirmProposedTxProps = PropsWithChildren<
  {
    txNonce: number | undefined
  } & ReviewTransactionContentProps
>

const ConfirmProposedTx = ({ txNonce, children, ...props }: ConfirmProposedTxProps): ReactElement => {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { setSafeTx, setSafeTxError, setNonce, setIsReadOnly } = useContext(SafeTxContext)
  const { txId, onlyExecute, isExecutable } = useContext(TxFlowContext)

  useEffect(() => {
    txNonce !== undefined && setNonce(txNonce)
    // Data of transactions in the queue should never be editable
    setIsReadOnly(true)
  }, [setNonce, txNonce, setIsReadOnly])

  useEffect(() => {
    if (txId) {
      createExistingTx(chainId, txId).then(setSafeTx).catch(setSafeTxError)
    }
  }, [txId, chainId, setSafeTx, setSafeTxError])

  const text = !onlyExecute
    ? isExecutable
      ? t('transactions.signOrExecuteThisTx')
      : t('transactions.signThisTx')
    : t('transactions.executeThisTx')

  return (
    <ReviewTransaction {...props}>
      <Typography mb={1}>{text}</Typography>
      {children}
    </ReviewTransaction>
  )
}

export default ConfirmProposedTx
