import React from 'react'
import { TransactionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { ListTableItem } from '@/src/features/ConfirmTx/components/ListTable'
import { Text, View } from 'tamagui'
import { CopyButton } from '@/src/components/CopyButton'
import { Address } from '@/src/types/address'
import { isMultisigDetailedExecutionInfo } from '@/src/utils/transaction-guards'
import { Operation } from '@safe-global/safe-gateway-typescript-sdk'
import { HashDisplay } from '@/src/components/HashDisplay'
import { Badge } from '@/src/components/Badge'
import { HexDataDisplay } from '@/src/components/HexDataDisplay'
import { TFunction } from 'i18next'

interface formatHistoryTxDetailsProps {
  txDetails?: TransactionDetails
  t: TFunction
}

export interface HistoryTxDetailsSection {
  title?: string
  items: ListTableItem[]
}

const formatHistoryTxDetails = ({ txDetails, t }: formatHistoryTxDetailsProps): HistoryTxDetailsSection[] => {
  const sections: HistoryTxDetailsSection[] = []

  if (!txDetails) {
    return sections
  }

  // Section 1: Basic Transaction Info (Nonce, safeTxHash)
  const basicInfoItems: ListTableItem[] = []

  if (isMultisigDetailedExecutionInfo(txDetails.detailedExecutionInfo)) {
    const executionInfo = txDetails.detailedExecutionInfo

    basicInfoItems.push({
      label: t('transactions.nonce'),
      render: () => <Text>{executionInfo.nonce}</Text>,
    })

    // Safe Tx Hash
    if (executionInfo.safeTxHash) {
      basicInfoItems.push({
        label: t('advancedDetails.safeTxHash'),
        render: () => (
          <HashDisplay
            value={executionInfo.safeTxHash as Address}
            copyProps={{ color: '$textSecondaryLight', size: 16 }}
            showIdenticon={false}
            showExternalLink={false}
            isAddress={false}
          />
        ),
      })
    }
  }

  if (basicInfoItems.length > 0) {
    sections.push({
      items: basicInfoItems,
    })
  }

  // Section 2: Parameters
  const parametersItems: ListTableItem[] = []

  if (txDetails.txData?.operation !== undefined && txDetails.txData.dataDecoded?.method) {
    const methodCalled = txDetails.txData.dataDecoded?.method
    parametersItems.push({
      label: txDetails.txData.operation === Operation.CALL ? t('transactions.call') : t('transactions.delegateCall'),
      render: () => (
        <Badge
          circular={false}
          content={methodCalled}
          themeName="badge_background"
          circleProps={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 }}
        />
      ),
    })
  }

  if (txDetails.txData?.to?.value) {
    parametersItems.push({
      label: t('transactions.to'),
      render: () => (
        <HashDisplay
          value={txDetails.txData?.to.value as Address}
          copyProps={{ color: '$textSecondaryLight', size: 16 }}
          externalLinkSize={16}
        />
      ),
    })
  }

  if (txDetails.txData?.value) {
    parametersItems.push({
      label: t('transactions.value'),
      render: () => <Text>{txDetails.txData?.value}</Text>,
    })
  }

  parametersItems.push({
    label: t('transactions.data'),
    render: () => {
      if (!txDetails.txData?.hexData) {
        return <Text fontWeight={600}>0x</Text>
      }

      return (
        <HexDataDisplay
          data={txDetails.txData?.hexData || '0x'}
          title={t('transactions.hexData')}
          copyMessage={t('advancedDetails.dataCopied')}
        />
      )
    },
  })

  if (parametersItems.length > 0) {
    sections.push({
      title: t('transactions.parameters'),
      items: parametersItems,
    })
  }

  // Section 3: Decoded data
  const decodedDataItems: ListTableItem[] = []

  if (isMultisigDetailedExecutionInfo(txDetails.detailedExecutionInfo)) {
    const executionInfo = txDetails.detailedExecutionInfo

    if (txDetails.txData?.operation !== undefined) {
      const operationText = txDetails.txData.operation === Operation.CALL ? '0 (call)' : '1 (delegateCall)'
      decodedDataItems.push({
        label: t('transactions.operation'),
        render: () => <Text>{operationText}</Text>,
      })
    }

    decodedDataItems.push({
      label: t('advancedDetails.safeTxGas'),
      render: () => <Text>{executionInfo.safeTxGas}</Text>,
    })

    decodedDataItems.push({
      label: t('advancedDetails.baseGas'),
      render: () => <Text>{executionInfo.baseGas}</Text>,
    })

    decodedDataItems.push({
      label: t('advancedDetails.gasPrice'),
      render: () => <Text>{executionInfo.gasPrice}</Text>,
    })

    decodedDataItems.push({
      label: t('advancedDetails.gasToken'),
      render: () => <Text>{executionInfo.gasToken}</Text>,
    })

    decodedDataItems.push({
      label: t('advancedDetails.refundReceiver'),
      render: () => <Text>{executionInfo.refundReceiver.value}</Text>,
    })

    if (executionInfo.confirmations && executionInfo.confirmations.length > 0) {
      executionInfo.confirmations.forEach((confirmation, index) => {
        if (confirmation.signature) {
          decodedDataItems.push({
            label: t('advancedDetails.signature', { n: index + 1 }),
            render: () => (
              <View flexDirection="row" alignItems="center" gap="$1">
                <Text>{confirmation.signature ? `${confirmation.signature.length / 2 - 1} bytes` : '0 bytes'}</Text>
                {confirmation.signature && (
                  <CopyButton
                    value={confirmation.signature}
                    color={'$textSecondaryLight'}
                    text={t('advancedDetails.signatureCopied')}
                  />
                )}
              </View>
            ),
          })
        }
      })
    }

    if (txDetails.txData?.hexData) {
      decodedDataItems.push({
        label: t('transactions.rawData'),
        render: () => (
          <HexDataDisplay
            data={txDetails.txData?.hexData}
            title={t('transactions.rawData')}
            copyMessage={t('advancedDetails.rawDataCopied')}
          />
        ),
      })
    }
  }

  if (decodedDataItems.length > 0) {
    sections.push({
      title: t('advancedDetails.decodedData'),
      items: decodedDataItems,
    })
  }

  return sections
}

export { formatHistoryTxDetails }
