// Extract status handling into separate components
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SpeedUpMonitor } from '@/features/speedup/components/SpeedUpMonitor'
import { PendingStatus, type PendingTx } from '@/store/pendingTxsSlice'

type Props = {
  txId: string
  pendingTx: PendingTx
  willDeploySafe: boolean
}
export const ProcessingStatus = ({ txId, pendingTx, willDeploySafe: isCreatingSafe }: Props) => {
  const { t } = useTranslation()
  return (
    <Box px={3} mt={3}>
      <Typography data-testid="transaction-status" variant="h6" mt={2} fontWeight={700}>
        {!isCreatingSafe ? t('txFlow.txProcessing') : t('txFlow.nestedSafeCreating')}
      </Typography>
      <Typography variant="body2" mb={3}>
        {!isCreatingSafe ? t('txFlow.txProcessingDesc') : t('txFlow.nestedSafeProcessingDesc')}
      </Typography>
      <Box>
        {pendingTx.status === PendingStatus.PROCESSING && (
          <SpeedUpMonitor txId={txId} pendingTx={pendingTx} modalTrigger="alertBox" />
        )}
      </Box>
    </Box>
  )
}
