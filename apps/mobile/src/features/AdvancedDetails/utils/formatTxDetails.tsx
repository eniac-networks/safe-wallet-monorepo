import React from 'react'
import { TransactionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { ListTableItem } from '@/src/features/ConfirmTx/components/ListTable'
import { CircleProps, Text, View } from 'tamagui'
import { CopyButton } from '@/src/components/CopyButton'
import { EthAddress } from '@/src/components/EthAddress'
import { Address } from '@/src/types/address'
import { Identicon } from '@/src/components/Identicon'
import { Badge } from '@/src/components/Badge'
import { shortenText } from '@safe-global/utils/utils/formatters'
import { isMultisigDetailedExecutionInfo } from '@/src/utils/transaction-guards'
import { Operation } from '@safe-global/safe-gateway-typescript-sdk'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { TouchableOpacity } from 'react-native'
import { Receiver } from '../components/Receiver'
import { InfoSheet } from '@/src/components/InfoSheet'
import { TFunction } from 'i18next'

interface formatTxDetailsProps {
  txDetails?: TransactionDetails
  viewOnExplorer: () => void
  t: TFunction
}

const badgeProps: CircleProps = { borderRadius: '$2', paddingHorizontal: '$2', paddingVertical: '$1' }
const characterDisplayLimit = 15

const formatTxDetails = ({ txDetails, viewOnExplorer, t }: formatTxDetailsProps): ListTableItem[] => {
  const items: ListTableItem[] = []

  if (!txDetails) {
    return items
  }

  // Basic transaction info
  items.push({
    label: t('transactions.to'),
    render: () => (
      <>
        <View width="100%">
          <Receiver txData={txDetails.txData} />
        </View>
        <View width="100%" flexDirection="row" alignItems="center" gap="$2">
          <Identicon address={txDetails.txData?.to.value as Address} size={24} />

          <View flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text flexWrap="wrap" width="77%">
              {txDetails.txData?.to.value}
            </Text>

            <View flexDirection="row" alignItems="center" gap="$3">
              <CopyButton value={txDetails.txData?.to.value || ''} size={16} color={'$textSecondaryLight'} />

              <TouchableOpacity onPress={viewOnExplorer}>
                <SafeFontIcon name="external-link" size={16} color="$textSecondaryLight" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    ),
  })

  // Value
  if (txDetails.txData?.value) {
    items.push({
      label: t('transactions.value'),
      render: () => <Text>{txDetails.txData?.value || '0'}</Text>,
    })
  }

  // Operation
  if (txDetails.txData?.operation !== undefined) {
    const operationText = txDetails.txData.operation === Operation.CALL ? '0 (call)' : '1 (delegate call)'
    items.push({
      label: t('transactions.operation'),
      render: () => (
        <Badge
          circleProps={badgeProps}
          themeName="badge_background"
          fontSize={13}
          textContentProps={{ fontFamily: 'DM Mono' }}
          circular={false}
          content={operationText}
        />
      ),
    })
  }

  // Gas details if available (for multisig transactions)
  if (isMultisigDetailedExecutionInfo(txDetails.detailedExecutionInfo)) {
    const executionInfo = txDetails.detailedExecutionInfo

    items.push({
      label: t('advancedDetails.safeTxGas'),
      render: () => <Text>{executionInfo.safeTxGas}</Text>,
    })

    items.push({
      label: t('advancedDetails.baseGas'),
      render: () => <Text>{executionInfo.baseGas}</Text>,
    })

    items.push({
      label: t('advancedDetails.gasPrice'),
      render: () => <Text>{executionInfo.gasPrice}</Text>,
    })

    // Gas Token
    items.push({
      label: t('advancedDetails.gasToken'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$1">
          <Identicon address={executionInfo.gasToken as Address} size={24} />
          <EthAddress address={executionInfo.gasToken as Address} copy copyProps={{ color: '$textSecondaryLight' }} />
        </View>
      ),
    })

    // Refund Receiver
    items.push({
      label: t('advancedDetails.refundReceiver'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$1">
          <Identicon address={executionInfo.refundReceiver.value as Address} size={24} />
          <EthAddress
            address={executionInfo.refundReceiver.value as Address}
            copy
            copyProps={{ color: '$textSecondaryLight' }}
          />
        </View>
      ),
    })

    // Nonce
    items.push({
      label: t('transactions.nonce'),
      render: () => <Text>{executionInfo.nonce}</Text>,
    })

    // Safe Tx Hash
    if (executionInfo.safeTxHash) {
      items.push({
        label: t('advancedDetails.safeTxHash'),
        render: () => (
          <InfoSheet title={t('advancedDetails.safeTxHash')} info={executionInfo.safeTxHash}>
            <View flexDirection="row" alignItems="center" gap="$1">
              <Text>{shortenText(executionInfo.safeTxHash || '', characterDisplayLimit)}</Text>
              <CopyButton value={executionInfo.safeTxHash || ''} color={'$textSecondaryLight'} text={t('advancedDetails.hashCopied')} />
            </View>
          </InfoSheet>
        ),
      })
    }
  }

  // Transaction Hash
  if (txDetails.txHash) {
    items.push({
      label: t('advancedDetails.transactionHash'),
      render: () => (
        <InfoSheet title={t('advancedDetails.transactionHash')} info={txDetails.txHash || ''}>
          <View flexDirection="row" alignItems="center" gap="$1">
            <Text>{shortenText(txDetails.txHash || '', characterDisplayLimit)}</Text>
            <CopyButton value={txDetails.txHash || ''} color={'$textSecondaryLight'} text={t('advancedDetails.hashCopied')} />
          </View>
        </InfoSheet>
      ),
    })
  }

  return items
}

export { formatTxDetails }
