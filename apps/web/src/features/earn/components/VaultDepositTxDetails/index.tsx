import type { VaultDepositTransactionInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import VaultDepositConfirmation from '@/features/earn/components/VaultDepositConfirmation'
import { Box } from '@mui/material'
import FieldsGrid from '@/components/tx/FieldsGrid'
import TokenAmount from '@/components/common/TokenAmount'
import { formatPercentage } from '@safe-global/utils/utils/formatters'
import { useTranslation } from 'react-i18next'

const VaultDepositTxDetails = ({ info }: { info: VaultDepositTransactionInfo }) => {
  const { t } = useTranslation()
  const totalNrr = (info.baseNrr + info.additionalRewardsNrr) / 100

  return (
    <Box pl={1} pr={5} display="flex" flexDirection="column" gap={1}>
      <FieldsGrid title={t('earn.deposit')}>
        <TokenAmount
          tokenSymbol={info.tokenInfo.symbol}
          value={info.value}
          logoUri={info.tokenInfo.logoUri || ''}
          decimals={info.tokenInfo.decimals}
        />
      </FieldsGrid>
      <FieldsGrid title={t('earn.earnAfterFees')}>{formatPercentage(totalNrr)}</FieldsGrid>
      <VaultDepositConfirmation txInfo={info} isTxDetails />
    </Box>
  )
}

export default VaultDepositTxDetails
