import type { VaultRedeemTransactionInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { Box } from '@mui/material'
import FieldsGrid from '@/components/tx/FieldsGrid'
import TokenAmount from '@/components/common/TokenAmount'
import VaultRedeemConfirmation from '@/features/earn/components/VaultRedeemConfirmation'
import { useTranslation } from 'react-i18next'

const VaultRedeemTxDetails = ({ info }: { info: VaultRedeemTransactionInfo }) => {
  const { t } = useTranslation()
  return (
    <Box pl={1} pr={5} display="flex" flexDirection="column" gap={1}>
      <FieldsGrid title={t('earn.withdraw')}>
        <TokenAmount
          tokenSymbol={info.tokenInfo.symbol}
          value={info.value}
          logoUri={info.tokenInfo.logoUri || ''}
          decimals={info.tokenInfo.decimals}
        />
      </FieldsGrid>
      <VaultRedeemConfirmation txInfo={info} isTxDetails />
    </Box>
  )
}

export default VaultRedeemTxDetails
