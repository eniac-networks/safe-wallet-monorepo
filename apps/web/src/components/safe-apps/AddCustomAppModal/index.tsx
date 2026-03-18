import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import {
  DialogActions,
  DialogContent,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  FormHelperText,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import type { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ModalDialog from '@/components/common/ModalDialog'
import { isValidURL } from '@safe-global/utils/utils/validation'
import { useCurrentChain } from '@/hooks/useChains'
import useAsync from '@safe-global/utils/hooks/useAsync'
import useDebounce from '@/hooks/useDebounce'
import { fetchSafeAppFromManifest } from '@/services/safe-apps/manifest'
import { SAFE_APPS_EVENTS, trackSafeAppEvent } from '@/services/analytics'
import { isSameUrl, trimTrailingSlash } from '@/utils/url'
import CustomAppPlaceholder from './CustomAppPlaceholder'
import CustomApp from './CustomApp'
import { useShareSafeAppUrl } from '@/components/safe-apps/hooks/useShareSafeAppUrl'

import css from './styles.module.css'
import ExternalLink from '@/components/common/ExternalLink'
import { BRAND_NAME } from '@/config/constants'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (data: SafeAppData) => void
  // A list of safe apps to check if the app is already there
  safeAppsList: SafeAppData[]
}

type CustomAppFormData = {
  appUrl: string
  riskAcknowledgement: boolean
  safeApp: SafeAppData
}

const HELP_LINK = 'https://docs.safe.global/apps-sdk-overview'

export const AddCustomAppModal = ({ open, onClose, onSave, safeAppsList }: Props) => {
  const { t } = useTranslation()
  const currentChain = useCurrentChain()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<CustomAppFormData>({ defaultValues: { riskAcknowledgement: false }, mode: 'onChange' })

  const onSubmit: SubmitHandler<CustomAppFormData> = () => {
    if (safeApp) {
      onSave(safeApp)
      trackSafeAppEvent(SAFE_APPS_EVENTS.ADD_CUSTOM_APP, safeApp.url)
      reset()
      onClose()
    }
  }

  const appUrl = watch('appUrl')
  const debouncedUrl = useDebounce(trimTrailingSlash(appUrl || ''), 300)

  const [safeApp, manifestError] = useAsync<SafeAppData | undefined>(() => {
    if (!isValidURL(debouncedUrl)) return

    return fetchSafeAppFromManifest(debouncedUrl, currentChain?.chainId || '')
  }, [currentChain, debouncedUrl])

  const handleClose = () => {
    reset()
    onClose()
  }

  const isAppAlreadyInTheList = useCallback(
    (appUrl: string) => safeAppsList.some((app) => isSameUrl(app.url, appUrl)),
    [safeAppsList],
  )

  const shareSafeAppUrl = useShareSafeAppUrl(safeApp?.url || '')
  const isSafeAppValid = isValid && safeApp
  const isCustomAppInTheDefaultList = errors?.appUrl?.type === 'alreadyExists'

  return (
    <ModalDialog open={open} onClose={handleClose} dialogTitle={t('safeApps.addCustomApp')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={css.addCustomAppContainer}>
          <div className={css.addCustomAppFields}>
            <TextField
              required
              label={t('safeApps.safeAppUrl')}
              error={errors?.appUrl?.type === 'validUrl'}
              helperText={errors?.appUrl?.type === 'validUrl' && errors?.appUrl?.message}
              autoComplete="off"
              {...register('appUrl', {
                required: true,
                validate: {
                  validUrl: (val: string) => (isValidURL(val) ? undefined : t('safeApps.invalidUrl')),
                  alreadyExists: (val: string) =>
                    isAppAlreadyInTheList(val) ? t('safeApps.appAlreadyInList') : undefined,
                },
              })}
            />
            <Box
              sx={{
                mt: 2,
              }}
            >
              {safeApp ? (
                <>
                  <CustomApp safeApp={safeApp} shareUrl={isCustomAppInTheDefaultList ? shareSafeAppUrl : ''} />
                  {isCustomAppInTheDefaultList ? (
                    <Box
                      sx={{
                        display: 'flex',
                        mt: 2,
                        alignItems: 'center',
                      }}
                    >
                      <CheckIcon color="success" />
                      <Typography
                        sx={{
                          ml: 1,
                        }}
                      >
                        {t('safeApps.appAlreadyRegistered')}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <FormControlLabel
                        aria-required
                        control={
                          <Checkbox
                            {...register('riskAcknowledgement', {
                              required: true,
                            })}
                          />
                        }
                        label={t('safeApps.riskAcknowledgement', { brandName: BRAND_NAME })}
                        sx={{ mt: 2 }}
                      />

                      {errors.riskAcknowledgement && (
                        <FormHelperText error>{t('safeApps.acceptDisclaimerMandatory')}</FormHelperText>
                      )}
                    </>
                  )}
                </>
              ) : (
                <CustomAppPlaceholder
                  error={isValidURL(debouncedUrl) && manifestError ? t('safeApps.manifestError') : ''}
                />
              )}
            </Box>
          </div>

          <div className={css.addCustomAppHelp}>
            <InfoOutlinedIcon className={css.addCustomAppHelpIcon} />
            <Typography
              sx={{
                ml: 0.5,
              }}
            >
              {t('safeApps.learnMoreBuilding')}
            </Typography>
            <ExternalLink className={css.addCustomAppHelpLink} href={HELP_LINK} fontWeight={700}>
              Safe Apps
            </ExternalLink>
            .
          </div>
        </DialogContent>

        <DialogActions disableSpacing>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained" disabled={!isSafeAppValid}>
            {t('safeApps.add')}
          </Button>
        </DialogActions>
      </form>
    </ModalDialog>
  )
}
