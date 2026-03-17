import type { ReactElement } from 'react'
import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { type AddressEx, type TransactionDetails, Operation } from '@safe-global/safe-gateway-typescript-sdk'

import { HexEncodedData } from '@/components/transactions/HexEncodedData'
import { MethodDetails } from '@/components/transactions/TxDetails/TxData/DecodedData/MethodDetails'
import SendAmountBlock from '@/components/tx-flow/flows/TokenTransfer/SendAmountBlock'
import SendToBlock from '@/components/tx/SendToBlock'
import MethodCall from './MethodCall'
import { useNativeTokenInfo } from '@/hooks/useNativeTokenInfo'
import { DelegateCallWarning, UntrustedFallbackHandlerWarning } from '@/components/transactions/Warning'
import { useSetsUntrustedFallbackHandler } from '@/components/tx/confirmation-views/SettingsChange/UntrustedFallbackHandlerTxAlert'

interface Props {
  txData: TransactionDetails['txData']
  toInfo?: AddressEx
  isTxExecuted?: boolean
}

export const DecodedData = ({ txData, toInfo, isTxExecuted = false }: Props): ReactElement | null => {
  const { t } = useTranslation()
  const nativeTokenInfo = useNativeTokenInfo()
  const setsUntrustedFallbackHandler = useSetsUntrustedFallbackHandler(txData)

  // nothing to render
  if (!txData) {
    if (!toInfo) return null

    return (
      <SendToBlock
        title={t('transactions.interactWith')}
        address={toInfo.value}
        name={toInfo.name}
        customAvatar={toInfo.logoUri}
        avatarSize={26}
      />
    )
  }

  const amountInWei = txData.value ?? '0'
  const isDelegateCall = txData.operation === Operation.DELEGATE
  const toAddress = toInfo?.value || txData.to?.value
  const method = txData.dataDecoded?.method || ''
  const addressInfo = txData.addressInfoIndex?.[toAddress]
  const name = addressInfo?.name || toInfo?.name || txData.to?.name
  const avatar = addressInfo?.logoUri || toInfo?.logoUri || txData.to?.logoUri

  return (
    <Stack spacing={2}>
      {setsUntrustedFallbackHandler && <UntrustedFallbackHandlerWarning isTxExecuted={isTxExecuted} />}
      {isDelegateCall && <DelegateCallWarning showWarning={!txData.trustedDelegateCallTarget} />}

      {method ? (
        <MethodCall contractAddress={toAddress} contractName={name} contractLogo={avatar} method={method} />
      ) : (
        <SendToBlock
          address={toAddress}
          name={name}
          title={t('transactions.interactedWith')}
          avatarSize={20}
          customAvatar={avatar}
        />
      )}

      {amountInWei !== '0' && (
        <SendAmountBlock title={t('transactions.valueLabel')} amountInWei={amountInWei} tokenInfo={nativeTokenInfo} />
      )}

      {txData.dataDecoded ? (
        <MethodDetails data={txData.dataDecoded} hexData={txData.hexData} addressInfoIndex={txData.addressInfoIndex} />
      ) : txData.hexData ? (
        <Typography data-testid="hexData" variant="body2" component="div">
          <HexEncodedData title={t('transactions.dataLabel')} hexData={txData.hexData} />
        </Typography>
      ) : null}
    </Stack>
  )
}

export default DecodedData
