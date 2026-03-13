import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import type { StakingTxDepositInfo, TransactionData } from '@safe-global/safe-gateway-typescript-sdk'
import FieldsGrid from '@/components/tx/FieldsGrid'
import SendAmountBlock from '@/components/tx-flow/flows/TokenTransfer/SendAmountBlock'
import StakingConfirmationTxDeposit from '@/features/stake/components/StakingConfirmationTx/Deposit'

const StakingTxDepositDetails = ({ info, txData }: { info: StakingTxDepositInfo; txData?: TransactionData }) => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        pl: 1,
        pr: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {txData && (
        <SendAmountBlock title={t('stake.deposit')} amountInWei={txData.value?.toString() || '0'} tokenInfo={info.tokenInfo} />
      )}
      <FieldsGrid title={t('stake.netRewardRate')}>{info.annualNrr.toFixed(3)}%</FieldsGrid>
      <StakingConfirmationTxDeposit order={info} isTxDetails />
    </Box>
  )
}

export default StakingTxDepositDetails
