import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { Box, Paper, SvgIcon, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Order, Transaction } from '@safe-global/safe-gateway-typescript-sdk'
import { isMultisigExecutionInfo, isSwapTransferOrderTxInfo } from '@/utils/transaction-guards'
import ExpandableTransactionItem from '@/components/transactions/TxListItem/ExpandableTransactionItem'
import BatchIcon from '@/public/images/common/batch.svg'
import css from './styles.module.css'
import ExplorerButton from '@/components/common/ExplorerButton'
import { getBlockExplorerLink } from '@safe-global/utils/utils/chains'
import { useCurrentChain } from '@/hooks/useChains'
import { getOrderClass } from '@/features/swap/helpers/utils'

const GroupedTxListItems = ({
  groupedListItems,
  transactionHash,
}: {
  groupedListItems: Transaction[]
  transactionHash: string
}): ReactElement | null => {
  const { t } = useTranslation()
  const chain = useCurrentChain()
  const explorerLink = chain && getBlockExplorerLink(chain, transactionHash)?.href

  const orderClassTitles = useMemo<Record<string, string>>(
    () => ({
      limit: t('transactions.limitOrderSettlement'),
      twap: t('transactions.twapOrderSettlement'),
      liquidity: t('transactions.liquidityOrderSettlement'),
      market: t('transactions.swapOrderSettlement'),
    }),
    [t],
  )

  if (groupedListItems.length === 0) return null
  const isSwapTransfer = isSwapTransferOrderTxInfo(groupedListItems[0].transaction.txInfo)
  const title = isSwapTransfer
    ? orderClassTitles[getOrderClass(groupedListItems[0].transaction.txInfo as Order)] || orderClassTitles['market']
    : t('transactions.bulkTransactions')

  return (
    <Paper data-testid="grouped-items" className={css.container}>
      <Box gridArea="icon">
        <SvgIcon className={css.icon} component={BatchIcon} inheritViewBox fontSize="medium" />
      </Box>
      <Box gridArea="info">
        <Typography noWrap>{title}</Typography>
      </Box>
      <Box className={css.action}>{t('transactions.transactionsCount', { count: groupedListItems.length })}</Box>
      <Box className={css.hash}>
        <ExplorerButton href={explorerLink} isCompact={false} />
      </Box>

      <Box gridArea="items" className={css.txItems}>
        {groupedListItems.map((tx) => {
          const nonce = isMultisigExecutionInfo(tx.transaction.executionInfo) ? tx.transaction.executionInfo.nonce : ''
          return (
            <Box position="relative" key={tx.transaction.id}>
              <Box className={css.nonce}>
                <Typography className={css.nonce}>{nonce}</Typography>
              </Box>
              <ExpandableTransactionItem item={tx} isBulkGroup={true} />
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}

export default GroupedTxListItems
