import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import css from '@/components/tx-flow/flows/SuccessScreen/styles.module.css'
import { isTimeoutError } from '@/utils/ethers-utils'

type Props = {
  error: undefined | Error
  willDeploySafe: boolean
}
export const DefaultStatus = ({ error, willDeploySafe: isCreatingSafe }: Props) => {
  const { t } = useTranslation()

  const title = error
    ? t('txFlow.txFailed')
    : !isCreatingSafe
      ? t('txFlow.txSuccessful')
      : t('txFlow.nestedSafeCreated')

  const errorMessage = error ? (isTimeoutError(error) ? t('txFlow.txTimedOut') : error.message) : ''

  return (
    <Box px={3} mt={3}>
      <Typography data-testid="transaction-status" variant="h6" mt={2} fontWeight={700}>
        {title}
      </Typography>
      {error && (
        <Box className={classNames(css.instructions, error ? css.errorBg : css.infoBg)}>
          <Typography variant="body2">{errorMessage}</Typography>
        </Box>
      )}
    </Box>
  )
}
