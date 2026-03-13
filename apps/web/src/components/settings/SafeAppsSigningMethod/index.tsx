import ExternalLink from '@/components/common/ExternalLink'
import { SETTINGS_EVENTS, trackEvent } from '@/services/analytics'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectOnChainSigning, setOnChainSigning } from '@/store/settingsSlice'
import { FormControlLabel, Checkbox, Paper, Typography, FormGroup, Grid } from '@mui/material'
import { BRAND_NAME } from '@/config/constants'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'
import { useTranslation } from 'react-i18next'

export const SafeAppsSigningMethod = () => {
  const { t } = useTranslation()
  const onChainSigning = useAppSelector(selectOnChainSigning)

  const dispatch = useAppDispatch()

  const onChange = () => {
    trackEvent(SETTINGS_EVENTS.SAFE_APPS.CHANGE_SIGNING_METHOD)
    dispatch(setOnChainSigning(!onChainSigning))
  }

  return (
    <Paper sx={{ padding: 4, mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item lg={4} xs={12}>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {t('settings.signingMethod')}
          </Typography>
        </Grid>

        <Grid item xs>
          <Typography mb={2}>
            {t('settings.signingMethodDescription', { brandName: BRAND_NAME })}{' '}
            <ExternalLink href={HelpCenterArticle.SIGNED_MESSAGES}>{t('settings.here')}</ExternalLink>.
          </Typography>
          <FormGroup>
            <FormControlLabel
              sx={({ palette }) => ({
                flex: 1,
                '.MuiIconButton-root:not(.Mui-checked)': {
                  color: palette.text.disabled,
                },
              })}
              control={<Checkbox checked={onChainSigning} onChange={onChange} name="use-on-chain-signing" />}
              label={t('settings.alwaysUseOnChainSignatures')}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </Paper>
  )
}
