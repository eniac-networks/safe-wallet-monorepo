import { isTimeoutError } from '@/utils/ethers-utils'
import classNames from 'classnames'
import { Box, Typography } from '@mui/material'
import LoadingSpinner, { SpinnerStatus } from '@/components/new-safe/create/steps/StatusStep/LoadingSpinner'
import { PendingStatus } from '@/store/pendingTxsSlice'
import css from './styles.module.css'
import { useTranslation } from 'react-i18next'

const StatusMessage = ({ status, error }: { status: PendingStatus; error?: Error }) => {
  const { t } = useTranslation()

  const getStep = (status: PendingStatus, error?: Error) => {
    switch (status) {
      case PendingStatus.PROCESSING:
      case PendingStatus.RELAYING:
        return {
          description: t('txFlow.txProcessing'),
          instruction: t('txFlow.txProcessingDesc'),
          classNames: '',
        }
      case PendingStatus.INDEXING:
        return {
          description: t('txFlow.txProcessed'),
          instruction: t('txFlow.txIndexingDesc'),
          classNames: classNames(css.instructions, error ? css.errorBg : css.infoBg),
        }
      default:
        return {
          description: error ? t('txFlow.txFailed') : t('txFlow.txSuccessful'),
          instruction: error ? (isTimeoutError(error) ? t('txFlow.txTimedOut') : error.message) : '',
          classNames: classNames(css.instructions, error ? css.errorBg : css.infoBg),
        }
    }
  }

  const stepInfo = getStep(status, error)

  const isSuccess = status === undefined
  const spinnerStatus = error ? SpinnerStatus.ERROR : isSuccess ? SpinnerStatus.SUCCESS : SpinnerStatus.PROCESSING

  return (
    <>
      <Box px={3} mt={3}>
        <LoadingSpinner status={spinnerStatus} />
        <Typography data-testid="transaction-status" variant="h6" mt={2} fontWeight={700}>
          {stepInfo.description}
        </Typography>
      </Box>
      {stepInfo.instruction && (
        <Box className={stepInfo.classNames}>
          <Typography variant="body2">{stepInfo.instruction}</Typography>
        </Box>
      )}
    </>
  )
}

export default StatusMessage
