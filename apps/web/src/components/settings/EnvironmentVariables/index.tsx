import { useForm, FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Paper, Grid, Typography, TextField, Button, Tooltip, IconButton, SvgIcon } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectSettings, setRpc, setTenderly } from '@/store/settingsSlice'
import useChainId from '@/hooks/useChainId'
import { useCurrentChain } from '@/hooks/useChains'
import { SETTINGS_EVENTS, trackEvent } from '@/services/analytics'
import InfoIcon from '@/public/images/notifications/info.svg'
import ExternalLink from '@/components/common/ExternalLink'
import { TENDERLY_SIMULATE_ENDPOINT_URL } from '@safe-global/utils/config/constants'

export enum EnvVariablesField {
  rpc = 'rpc',
  tenderlyURL = 'tenderlyURL',
  tenderlyToken = 'tenderlyToken',
}

export type EnvVariablesFormData = {
  [EnvVariablesField.rpc]: string
  [EnvVariablesField.tenderlyURL]: string
  [EnvVariablesField.tenderlyToken]: string
}

const EnvironmentVariables = () => {
  const { t } = useTranslation()
  const chainId = useChainId()
  const chain = useCurrentChain()
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()

  const formMethods = useForm<EnvVariablesFormData>({
    mode: 'onChange',
    values: {
      [EnvVariablesField.rpc]: settings.env?.rpc[chainId] ?? '',
      [EnvVariablesField.tenderlyURL]: settings.env?.tenderly.url ?? '',
      [EnvVariablesField.tenderlyToken]: settings.env?.tenderly.accessToken ?? '',
    },
  })

  const { register, handleSubmit, setValue, watch } = formMethods

  const rpc = watch(EnvVariablesField.rpc)
  const tenderlyURL = watch(EnvVariablesField.tenderlyURL)
  const tenderlyToken = watch(EnvVariablesField.tenderlyToken)

  const onSubmit = handleSubmit((data) => {
    trackEvent({ ...SETTINGS_EVENTS.ENV_VARIABLES.SAVE })

    dispatch(
      setRpc({
        chainId,
        rpc: data[EnvVariablesField.rpc],
      }),
    )

    dispatch(
      setTenderly({
        url: data[EnvVariablesField.tenderlyURL],
        accessToken: data[EnvVariablesField.tenderlyToken],
      }),
    )

    location.reload()
  })

  const onReset = (name: EnvVariablesField) => {
    setValue(name, '')
  }

  return (
    <Paper sx={{ padding: 4 }}>
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Grid item lg={4} xs={12}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            {t('settings.environmentVariablesTitle')}
          </Typography>
        </Grid>

        <Grid item xs>
          <Typography
            sx={{
              mb: 3,
            }}
          >
            {t('settings.envVariablesDescription')}
          </Typography>

          <FormProvider {...formMethods}>
            <form onSubmit={onSubmit}>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  mt: 3,
                }}
              >
                {t('settings.rpcProvider')}
                <Tooltip
                  placement="top"
                  arrow
                  title={t('settings.rpcProviderTooltip')}
                >
                  <span>
                    <SvgIcon
                      component={InfoIcon}
                      inheritViewBox
                      fontSize="small"
                      color="border"
                      sx={{ verticalAlign: 'middle', ml: 0.5 }}
                    />
                  </span>
                </Tooltip>
              </Typography>

              <TextField
                {...register(EnvVariablesField.rpc)}
                variant="outlined"
                type="url"
                placeholder={chain?.rpcUri.value}
                InputProps={{
                  endAdornment: rpc ? (
                    <InputAdornment position="end">
                      <Tooltip title={t('settings.resetToDefaultValue')}>
                        <IconButton onClick={() => onReset(EnvVariablesField.rpc)} size="small" color="primary">
                          <RotateLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null,
                }}
                fullWidth
              />

              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  mt: 3,
                }}
              >
                Tenderly
                <Tooltip
                  placement="top"
                  arrow
                  title={
                    <>
                      {t('settings.tenderlyTooltip')}{' '}
                      <ExternalLink
                        color="secondary"
                        href="https://docs.tenderly.co/simulations-and-forks/simulation-api/configuration-of-api-access"
                      >
                        {t('settings.readMore')}
                      </ExternalLink>
                    </>
                  }
                >
                  <span>
                    <SvgIcon
                      component={InfoIcon}
                      inheritViewBox
                      fontSize="small"
                      color="border"
                      sx={{ verticalAlign: 'middle', ml: 0.5 }}
                    />
                  </span>
                </Tooltip>
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register(EnvVariablesField.tenderlyURL)}
                    type="url"
                    variant="outlined"
                    label={t('settings.tenderlyApiUrl')}
                    placeholder={TENDERLY_SIMULATE_ENDPOINT_URL}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: tenderlyURL ? (
                        <InputAdornment position="end">
                          <Tooltip title={t('settings.resetToDefaultValue')}>
                            <IconButton
                              onClick={() => onReset(EnvVariablesField.tenderlyURL)}
                              size="small"
                              color="primary"
                            >
                              <RotateLeftIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ) : null,
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register(EnvVariablesField.tenderlyToken)}
                    variant="outlined"
                    label={t('settings.tenderlyAccessToken')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: tenderlyToken ? (
                        <InputAdornment position="end">
                          <Tooltip title={t('settings.resetToDefaultValue')}>
                            <IconButton
                              onClick={() => onReset(EnvVariablesField.tenderlyToken)}
                              size="small"
                              color="primary"
                            >
                              <RotateLeftIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ) : null,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                {t('common.save')}
              </Button>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default EnvironmentVariables
