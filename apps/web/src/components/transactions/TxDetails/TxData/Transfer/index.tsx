import NamedAddressInfo from '@/components/common/NamedAddressInfo'
import { TransferTx } from '@/components/transactions/TxInfo'
import { isTxQueued } from '@/utils/transaction-guards'
import type { TransactionStatus, Transfer } from '@safe-global/safe-gateway-typescript-sdk'
import { TransferDirection } from '@safe-global/safe-gateway-typescript-sdk'
import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import TransferActions from '@/components/transactions/TxDetails/TxData/Transfer/TransferActions'
import MaliciousTxWarning from '@/components/transactions/MaliciousTxWarning'
import { ImitationTransactionWarning } from '@/components/transactions/ImitationTransactionWarning'
import TokenAmount from '@/components/common/TokenAmount'
import { type NativeToken, type Erc20Token } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'

type TransferTxInfoProps = {
  txInfo: Transfer
  txStatus: TransactionStatus
  trusted: boolean
  imitation: boolean
}

const TransferTxInfoMain = ({ txInfo, txStatus, trusted, imitation }: TransferTxInfoProps) => {
  const { t } = useTranslation()
  const { direction } = txInfo

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
      {direction === TransferDirection.INCOMING
        ? t('transactions.received')
        : isTxQueued(txStatus)
          ? t('transactions.send')
          : t('transactions.sent')}{' '}
      <b>
        <TransferTx info={txInfo} omitSign preciseAmount />
      </b>
      {` ${direction === TransferDirection.INCOMING ? t('transactions.transferFrom') : t('transactions.transferTo')}`}
      {!trusted && !imitation && <MaliciousTxWarning />}
    </Box>
  )
}

const TransferTxInfo = ({ txInfo, txStatus, trusted, imitation }: TransferTxInfoProps) => {
  const address = txInfo.direction.toUpperCase() === TransferDirection.INCOMING ? txInfo.sender : txInfo.recipient

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <TransferTxInfoMain txInfo={txInfo} txStatus={txStatus} trusted={trusted} imitation={imitation} />

      <Box display="flex" alignItems="center" width="100%">
        <NamedAddressInfo
          address={address.value}
          name={address.name}
          customAvatar={address.logoUri}
          shortAddress={false}
          hasExplorer
          showCopyButton
          trusted={trusted && !imitation}
        >
          <TransferActions address={address.value} txInfo={txInfo} trusted={trusted} />
        </NamedAddressInfo>
      </Box>
      {imitation && <ImitationTransactionWarning />}
    </Box>
  )
}

export const InlineTransferTxInfo = ({
  value,
  tokenInfo,
  recipient,
}: {
  value: string
  tokenInfo: Erc20Token | NativeToken
  recipient: string
}) => {
  const { t } = useTranslation()
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography>{t('transactions.send')}</Typography>
      <TokenAmount
        value={value}
        decimals={tokenInfo.decimals}
        logoUri={tokenInfo.logoUri}
        tokenSymbol={tokenInfo.symbol}
        iconSize={16}
      />
      <Typography>{t('transactions.transferTo')}</Typography>
      <NamedAddressInfo address={recipient} copyAddress={false} shortAddress={true} onlyName avatarSize={16} />
    </Stack>
  )
}

export default TransferTxInfo
