import { Card, Typography } from '@mui/material'
import SafeAccountsIcon from '@/public/images/spaces/safe-accounts.svg'
import { useTranslation } from 'react-i18next'

const EmptySafeAccounts = () => {
  const { t } = useTranslation()
  return (
    <>
      <Card sx={{ p: 5, textAlign: 'center' }}>
        <SafeAccountsIcon />

        <Typography color="text.secondary" mb={2}>
          {t('spaces.addSafeAccountsToSee')}
        </Typography>
      </Card>
    </>
  )
}

export default EmptySafeAccounts
