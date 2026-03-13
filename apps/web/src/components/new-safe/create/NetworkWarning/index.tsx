import { Alert, AlertTitle, Box } from '@mui/material'
import { useCurrentChain } from '@/hooks/useChains'
import ChainSwitcher from '@/components/common/ChainSwitcher'
import useIsWrongChain from '@/hooks/useIsWrongChain'
import { useTranslation } from 'react-i18next'

const NetworkWarning = ({ action }: { action?: string }) => {
  const { t } = useTranslation()
  const chain = useCurrentChain()
  const isWrongChain = useIsWrongChain()

  if (!chain || !isWrongChain) return null

  return (
    <Alert severity="warning">
      <AlertTitle sx={{ fontWeight: 700 }}>{t('networkWarning.title')}</AlertTitle>
      {t('networkWarning.message', { action: action || t('networkWarning.defaultAction'), chainName: chain.chainName })}
      <Box
        sx={{
          mt: 2,
        }}
      >
        <ChainSwitcher />
      </Box>
    </Alert>
  )
}

export default NetworkWarning
