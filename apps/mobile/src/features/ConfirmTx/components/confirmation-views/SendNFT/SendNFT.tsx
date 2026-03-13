import React, { useMemo } from 'react'
import { YStack } from 'tamagui'
import { TransactionHeader } from '../../TransactionHeader'
import { ListTable } from '../../ListTable'
import { formatSendNFTItems } from './utils'
import { TransferTransactionInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { MultisigExecutionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { useTokenDetails } from '@/src/hooks/useTokenDetails/useTokenDetails'
import { RootState } from '@/src/store'
import { useAppSelector } from '@/src/store/hooks'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { selectChainById } from '@/src/store/chains'
import { useOpenExplorer } from '@/src/features/ConfirmTx/hooks/useOpenExplorer'
import { ParametersButton } from '../../ParametersButton'
import { useTranslation } from 'react-i18next'

interface SendNFTProps {
  txId: string
  txInfo: TransferTransactionInfo
  executionInfo: MultisigExecutionDetails
}

export function SendNFT({ txId, txInfo, executionInfo }: SendNFTProps) {
  const { t } = useTranslation()
  const activeSafe = useDefinedActiveSafe()
  const activeChain = useAppSelector((state: RootState) => selectChainById(state, activeSafe.chainId))
  const viewOnExplorer = useOpenExplorer(txInfo.recipient.value)

  const items = useMemo(
    () => formatSendNFTItems(txInfo, activeChain, viewOnExplorer, t),
    [txInfo, activeChain, viewOnExplorer, t],
  )
  const { value, tokenSymbol } = useTokenDetails(txInfo)

  return (
    <YStack gap="$4">
      <TransactionHeader
        badgeIcon="transaction-outgoing"
        badgeColor="$error"
        badgeThemeName="badge_error"
        title={`${value} ${tokenSymbol}`}
        submittedAt={executionInfo.submittedAt}
      />

      <ListTable items={items}>
        <ParametersButton txId={txId} />
      </ListTable>
    </YStack>
  )
}
