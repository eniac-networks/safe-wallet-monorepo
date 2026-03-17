import { Fragment, useMemo, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Divider, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import type { SafeTransaction } from '@safe-global/types-kit'
import { PaperViewToggle } from '../../common/PaperViewToggle'
import EthHashInfo from '@/components/common/EthHashInfo'
import { Operation, type TransactionDetails, type TransactionData } from '@safe-global/safe-gateway-typescript-sdk'
import { HexEncodedData } from '@/components/transactions/HexEncodedData'
import {
  useDomainHash,
  useMessageHash,
  useSafeTxHash,
} from '@/components/transactions/TxDetails/Summary/SafeTxHashDataRow'
import TxDetailsRow from './TxDetailsRow'
import NameChip from './NameChip'
import { isMultisigDetailedExecutionInfo } from '@/utils/transaction-guards'
import { JsonView } from './JsonView'

type ReceiptProps = {
  safeTxData: SafeTransaction['data']
  txData?: TransactionData
  txDetails?: TransactionDetails
  txInfo?: TransactionDetails['txInfo']
  grid?: boolean
  withSignatures?: boolean
}

const ScrollWrapper = ({ children }: { children: ReactElement | ReactElement[] }) => (
  <Box sx={{ maxHeight: '550px', flex: 1, overflowY: 'auto', px: 2, pt: 1, mt: '0 !important' }}>{children}</Box>
)

export const Receipt = ({ safeTxData, txData, txDetails, txInfo, grid, withSignatures = false }: ReceiptProps) => {
  const { t } = useTranslation()
  const safeTxHash = useSafeTxHash({ safeTxData })
  const domainHash = useDomainHash()
  const messageHash = useMessageHash({ safeTxData })
  const operation = Number(safeTxData.operation) as Operation

  const ToWrapper = grid ? Box : Fragment

  const confirmations = useMemo(() => {
    const detailedExecutionInfo = txDetails?.detailedExecutionInfo
    return isMultisigDetailedExecutionInfo(detailedExecutionInfo) ? detailedExecutionInfo.confirmations : []
  }, [txDetails?.detailedExecutionInfo])

  return (
    <PaperViewToggle activeView={0} leftAlign={grid}>
      {[
        {
          title: t('transactions.dataLabel'),
          content: (
            <ScrollWrapper>
              <Stack spacing={1} divider={<Divider />}>
                <TxDetailsRow label={t('transactions.to')} grid={grid}>
                  <ToWrapper>
                    <NameChip txData={txData} txInfo={txInfo} />

                    <Typography
                      variant="body2"
                      mt={grid ? 0.75 : 0}
                      width={grid ? undefined : '100%'}
                      sx={{
                        '& *': { whiteSpace: 'normal', wordWrap: 'break-word', alignItems: 'flex-start !important' },
                      }}
                    >
                      <EthHashInfo
                        address={safeTxData.to}
                        avatarSize={20}
                        showPrefix={false}
                        showName={false}
                        shortAddress={false}
                        hasExplorer
                        showAvatar
                        highlight4bytes
                      />
                    </Typography>
                  </ToWrapper>
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.valueLabel')} grid={grid}>
                  {safeTxData.value}
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.dataLabel')} grid={grid}>
                  <Typography variant="body2" width={grid ? '70%' : undefined}>
                    <HexEncodedData hexData={safeTxData.data} limit={140} />
                  </Typography>
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.operationLabel')} grid={grid}>
                  <Typography variant="body2" display="flex" alignItems="center" gap={0.5}>
                    {safeTxData.operation} (
                    {operation === Operation.CALL
                      ? t('transactions.callOperation')
                      : t('transactions.delegateCallOperation')}
                    ){operation === Operation.CALL && <CheckIcon color="success" fontSize="inherit" />}
                  </Typography>
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.safeTxGasLabel')} grid={grid}>
                  {safeTxData.safeTxGas}
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.baseGasLabel')} grid={grid}>
                  {safeTxData.baseGas}
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.gasPriceLabel')} grid={grid}>
                  {safeTxData.gasPrice}
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.gasTokenLabel')} grid={grid}>
                  <Typography variant="body2">
                    <EthHashInfo
                      address={safeTxData.gasToken}
                      avatarSize={20}
                      showPrefix={false}
                      showName={false}
                      shortAddress
                      hasExplorer
                    />
                  </Typography>
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.refundReceiverLabel')} grid={grid}>
                  <Typography variant="body2">
                    <EthHashInfo
                      address={safeTxData.refundReceiver}
                      avatarSize={20}
                      showPrefix={false}
                      shortAddress
                      showName={false}
                      hasExplorer
                    />
                  </Typography>
                </TxDetailsRow>

                <TxDetailsRow label={t('transactions.nonce')} grid={grid}>
                  {safeTxData.nonce}
                </TxDetailsRow>

                {withSignatures &&
                  confirmations?.map(
                    ({ signature }, index) =>
                      !!signature && (
                        <TxDetailsRow
                          data-testid="tx-signature"
                          label={t('transactions.signatureN', { number: index + 1 })}
                          key={`signature-${index}`}
                          grid={grid}
                        >
                          <Typography variant="body2" width={grid ? '70%' : undefined}>
                            <HexEncodedData hexData={signature} highlightFirstBytes={false} limit={30} />
                          </Typography>
                        </TxDetailsRow>
                      ),
                  )}
              </Stack>
            </ScrollWrapper>
          ),
        },
        {
          title: t('transactions.hashesTab'),
          content: (
            <ScrollWrapper>
              <Stack spacing={1} divider={<Divider />}>
                {domainHash && (
                  <TxDetailsRow label={t('safeMessages.domainHash')} grid={grid}>
                    <Typography variant="body2" width="100%" sx={{ wordWrap: 'break-word' }}>
                      <HexEncodedData hexData={domainHash} limit={66} highlightFirstBytes={false} />
                    </Typography>
                  </TxDetailsRow>
                )}

                {messageHash && (
                  <TxDetailsRow label={t('safeMessages.messageHash')} grid={grid}>
                    <Typography variant="body2" width="100%" sx={{ wordWrap: 'break-word' }}>
                      <HexEncodedData hexData={messageHash} limit={66} highlightFirstBytes={false} />
                    </Typography>
                  </TxDetailsRow>
                )}

                {safeTxHash && (
                  <TxDetailsRow label="safeTxHash" grid={grid}>
                    <Typography variant="body2" width="100%" sx={{ wordWrap: 'break-word' }}>
                      <HexEncodedData hexData={safeTxHash} limit={66} highlightFirstBytes={false} />
                    </Typography>
                  </TxDetailsRow>
                )}
              </Stack>
            </ScrollWrapper>
          ),
        },
        {
          title: 'JSON',
          content: (
            <ScrollWrapper>
              <JsonView data={safeTxData} />
            </ScrollWrapper>
          ),
        },
      ]}
    </PaperViewToggle>
  )
}
