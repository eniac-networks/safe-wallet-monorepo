import type { DataDecoded, TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import extractTxInfo from '@/services/tx/extractTxInfo'
import { isCustomTxInfo, isNativeTokenTransfer, isTransferTxInfo } from '@/utils/transaction-guards'
import SingleTxDecoded from '@/components/transactions/TxDetails/TxData/DecodedData/SingleTxDecoded'
import css from '@/components/transactions/TxDetails/TxData/DecodedData/Multisend/styles.module.css'
import { useState } from 'react'
import { MultisendActionsHeader } from '@/components/transactions/TxDetails/TxData/DecodedData/Multisend'
import { type AccordionProps } from '@mui/material/Accordion/Accordion'

const DecodedTxs = ({ txs }: { txs: TransactionDetails[] | undefined }) => {
  const { t } = useTranslation()
  const [openMap, setOpenMap] = useState<Record<number, boolean>>()

  if (!txs) return null

  return (
    <>
      <MultisendActionsHeader title={t('batch.batchedTransactions')} setOpen={setOpenMap} amount={txs.length} compact />

      <Box className={css.compact}>
        {txs.map((transaction, idx) => {
          if (!transaction.txData) return null

          const onChange: AccordionProps['onChange'] = (_, expanded) => {
            setOpenMap((prev) => ({
              ...prev,
              [idx]: expanded,
            }))
          }

          const { txParams } = extractTxInfo(transaction)

          let decodedDataParams: DataDecoded = {
            method: '',
            parameters: undefined,
          }

          if (isCustomTxInfo(transaction.txInfo) && transaction.txInfo.isCancellation) {
            decodedDataParams.method = t('transactions.onChainRejection')
          }

          if (isTransferTxInfo(transaction.txInfo) && isNativeTokenTransfer(transaction.txInfo.transferInfo)) {
            decodedDataParams.method = t('transactions.transfer')
          }

          const dataDecoded = transaction.txData.dataDecoded || decodedDataParams

          return (
            <SingleTxDecoded
              key={transaction.txId}
              tx={{
                dataDecoded,
                data: txParams.data,
                value: txParams.value,
                to: txParams.to,
                operation: 0,
              }}
              txData={transaction.txData}
              actionTitle={`${idx + 1}`}
              expanded={openMap?.[idx] ?? false}
              onChange={onChange}
              isExecuted={!!transaction.executedAt}
            />
          )
        })}
      </Box>
    </>
  )
}

export default DecodedTxs
