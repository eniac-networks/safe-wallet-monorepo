import { useAppDispatch, useAppSelector } from '@/store'
import { selectBlindSigning, setBlindSigning } from '@/store/settingsSlice'
import { Paper, Grid, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useTranslation } from 'react-i18next'

const SecuritySettings = () => {
  const { t } = useTranslation()
  const isBlindSigningEnabled = useAppSelector(selectBlindSigning)
  const dispatch = useAppDispatch()

  return (
    <Paper sx={{ padding: 4 }}>
      <Grid container spacing={3}>
        <Grid item lg={4} xs={12}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {t('settings.securityTitle')}
          </Typography>
        </Grid>

        <Grid item xs>
          <Typography mb={2}>{t('settings.blindSigningDescription')}</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBlindSigningEnabled}
                  onChange={() => dispatch(setBlindSigning(!isBlindSigningEnabled))}
                />
              }
              label={t('settings.enableBlindSigning')}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default SecuritySettings
