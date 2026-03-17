import { Box, Step, StepConnector, Stepper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import css from '@/components/new-safe/create/steps/StatusStep/styles.module.css'
import EthHashInfo from '@/components/common/EthHashInfo'
import StatusStep from '@/components/new-safe/create/steps/StatusStep/StatusStep'
import useSafeInfo from '@/hooks/useSafeInfo'
import { PendingStatus } from '@/store/pendingTxsSlice'

const StatusStepper = ({ status, txHash }: { status?: PendingStatus; txHash?: string }) => {
  const { t } = useTranslation()
  const { safeAddress } = useSafeInfo()

  const isProcessing = status === PendingStatus.PROCESSING || status === PendingStatus.INDEXING || status === undefined
  const isProcessed = status === PendingStatus.INDEXING || status === undefined
  const isSuccess = status === undefined

  return (
    <Stepper orientation="vertical" nonLinear connector={<StepConnector className={css.connector} />}>
      <Step>
        <StatusStep isLoading={!isProcessing} safeAddress={safeAddress}>
          <Box>
            <Typography variant="body2" fontWeight="700">
              {t('transactions.yourTransaction')}
            </Typography>
            {txHash && (
              <EthHashInfo
                address={txHash}
                hasExplorer
                showCopyButton
                showName={false}
                shortAddress={false}
                showAvatar={false}
              />
            )}
          </Box>
        </StatusStep>
      </Step>
      <Step>
        <StatusStep isLoading={!isProcessed} safeAddress={safeAddress}>
          <Box>
            <Typography variant="body2" fontWeight="700">
              {isProcessed ? t('transactions.processed') : t('transactions.processing')}
            </Typography>
          </Box>
        </StatusStep>
      </Step>
      <Step>
        <StatusStep isLoading={!isSuccess} safeAddress={safeAddress}>
          <Typography variant="body2" fontWeight="700">
            {isSuccess ? t('transactions.indexed') : t('transactions.indexing')}
          </Typography>
        </StatusStep>
      </Step>
      <Step>
        <StatusStep isLoading={!isSuccess} safeAddress={safeAddress}>
          <Typography variant="body2" fontWeight="700">
            {t('transactions.txIsExecuted')}
          </Typography>
        </StatusStep>
      </Step>
    </Stepper>
  )
}

export default StatusStepper
