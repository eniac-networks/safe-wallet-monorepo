import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import BeneficiaryIcon from '@/public/images/settings/spending-limit/beneficiary.svg'
import AssetAmountIcon from '@/public/images/settings/spending-limit/asset-amount.svg'
import TimeIcon from '@/public/images/settings/spending-limit/time.svg'

export const NoSpendingLimits = () => {
  const { t } = useTranslation()
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      sx={{
        mt: 2,
        justifyContent: 'space-between',
      }}
    >
      <Grid item sm={2}>
        <BeneficiaryIcon data-testid="beneficiary-icon" />
      </Grid>
      <Grid item sm={10}>
        <Typography>
          <b>{t('settings.selectBeneficiary')}</b>
        </Typography>
        <Typography>{t('settings.selectBeneficiaryDescription')}</Typography>
      </Grid>
      <Grid item sm={2}>
        <AssetAmountIcon data-testid="asset-icon" />
      </Grid>
      <Grid item sm={10}>
        <Typography>
          <b>{t('settings.selectAssetAndAmount')}</b>
        </Typography>
        <Typography>{t('settings.selectAssetDescription')}</Typography>
      </Grid>
      <Grid item sm={2}>
        <TimeIcon data-testid="time-icon" />
      </Grid>
      <Grid item sm={10}>
        <Typography>
          <b>{t('settings.selectTime')}</b>
        </Typography>
        <Typography>{t('settings.selectTimeDescription')}</Typography>
      </Grid>
    </Grid>
  )
}
