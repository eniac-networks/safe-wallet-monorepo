import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import css from '@/components/tx-flow/flows/SuccessScreen/styles.module.css'

export const IndexingStatus = ({ willDeploySafe: isCreatingSafe }: { willDeploySafe: boolean }) => {
  const { t } = useTranslation()
  return (
    <Box px={3} mt={3}>
      <Typography data-testid="transaction-status" variant="h6" mt={2} fontWeight={700}>
        {!isCreatingSafe ? t('txFlow.txProcessed') : t('txFlow.nestedSafeProcessed')}
      </Typography>
      <Box className={classNames(css.instructions, css.infoBg)}>
        <Typography variant="body2">{t('txFlow.txIndexingDesc')}</Typography>
      </Box>
    </Box>
  )
}
