import { Alert, AlertTitle, Box } from '@mui/material'
import useWallet from '@/hooks/wallets/useWallet'
import ConnectWalletButton from '@/components/common/ConnectWallet/ConnectWalletButton'
import { useTranslation } from 'react-i18next'

const NoWalletConnectedWarning = () => {
  const { t } = useTranslation()
  const wallet = useWallet()

  if (wallet) {
    return null
  }

  return (
    <Alert severity="warning" sx={{ mt: 3 }}>
      <AlertTitle sx={{ fontWeight: 700 }}>{t('noWallet.title')}</AlertTitle>{t('noWallet.message')}
      <Box
        sx={{
          mt: 2,
        }}
      >
        <ConnectWalletButton />
      </Box>
    </Alert>
  )
}

export default NoWalletConnectedWarning
