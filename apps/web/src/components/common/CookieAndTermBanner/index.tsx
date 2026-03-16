import { useEffect, useMemo, type ReactElement } from 'react'
import classnames from 'classnames'
import type { CheckboxProps } from '@mui/material'
import { Grid, Button, Checkbox, FormControlLabel, Typography, Paper, SvgIcon, Box } from '@mui/material'
import WarningIcon from '@/public/images/notifications/warning.svg'
import { useForm } from 'react-hook-form'
import * as metadata from '@/markdown/terms/version'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from '@/store'
import {
  selectCookies,
  CookieAndTermType,
  saveCookieAndTermConsent,
  hasAcceptedTerms,
} from '@/store/cookiesAndTermsSlice'
import { selectCookieBanner, openCookieBanner, closeCookieBanner } from '@/store/popupSlice'

import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import ExternalLink from '../ExternalLink'

const CookieCheckbox = ({
  checkboxProps,
  label,
  checked,
}: {
  label: string
  checked: boolean
  checkboxProps: CheckboxProps
}) => <FormControlLabel label={label} checked={checked} control={<Checkbox {...checkboxProps} />} sx={{ mt: '-9px' }} />

export const CookieAndTermBanner = ({
  warningKey,
  inverted,
}: {
  warningKey?: CookieAndTermType
  inverted?: boolean
}): ReactElement => {
  const { t } = useTranslation()

  const COOKIE_AND_TERM_WARNING = useMemo<Record<CookieAndTermType, string>>(
    () => ({
      [CookieAndTermType.TERMS]: '',
      [CookieAndTermType.NECESSARY]: '',
      [CookieAndTermType.UPDATES]: t('cookies.beamerWarning'),
      [CookieAndTermType.ANALYTICS]: '',
    }),
    [t],
  )

  const warning = warningKey ? COOKIE_AND_TERM_WARNING[warningKey] : undefined
  const dispatch = useAppDispatch()
  const cookies = useAppSelector(selectCookies)

  const { register, watch, getValues, setValue } = useForm({
    defaultValues: {
      [CookieAndTermType.TERMS]: true,
      [CookieAndTermType.NECESSARY]: true,
      [CookieAndTermType.UPDATES]: cookies[CookieAndTermType.UPDATES] ?? false,
      [CookieAndTermType.ANALYTICS]: cookies[CookieAndTermType.ANALYTICS] ?? false,
      ...(warningKey ? { [warningKey]: true } : {}),
    },
  })

  const handleAccept = () => {
    const values = getValues()
    dispatch(
      saveCookieAndTermConsent({
        ...values,
        termsVersion: metadata.version,
      }),
    )
    dispatch(closeCookieBanner())
  }

  const handleAcceptAll = () => {
    setValue(CookieAndTermType.UPDATES, true)
    setValue(CookieAndTermType.ANALYTICS, true)
    setTimeout(handleAccept, 300)
  }

  return (
    <Paper data-testid="cookies-popup" className={classnames(css.container, { [css.inverted]: inverted })}>
      {warning && (
        <Typography
          align="center"
          variant="body2"
          sx={{
            mb: 2,
            color: 'warning.background',
          }}
        >
          <SvgIcon component={WarningIcon} inheritViewBox fontSize="small" color="error" sx={{ mb: -0.4 }} /> {warning}
        </Typography>
      )}
      <form>
        <Grid
          container
          sx={{
            alignItems: 'center',
          }}
        >
          <Grid item xs>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
              }}
            >
              {t('cookies.consentPre')} <ExternalLink href={AppRoutes.terms}>{t('cookies.consentTerms')}</ExternalLink>{' '}
              {t('cookies.consentMid', { date: metadata.lastUpdated })}{' '}
              <ExternalLink href={AppRoutes.cookie}>{t('cookies.consentPolicy')}</ExternalLink>
            </Typography>

            <Grid
              container
              sx={{
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Grid item xs={12} sm>
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <CookieCheckbox
                    checkboxProps={{ id: 'necessary', disabled: true }}
                    label={t('cookies.necessary')}
                    checked
                  />
                  <br />
                  <Typography variant="body2">{t('cookies.necessaryDesc')}</Typography>
                </Box>

                <Box
                  sx={{
                    mb: 2,
                  }}
                >
                  <CookieCheckbox
                    checkboxProps={{ ...register(CookieAndTermType.UPDATES), id: 'beamer' }}
                    label={t('cookies.beamer')}
                    checked={watch(CookieAndTermType.UPDATES)}
                  />
                  <br />
                  <Typography variant="body2">{t('cookies.beamerDesc')}</Typography>
                </Box>

                <Box>
                  <CookieCheckbox
                    checkboxProps={{ ...register(CookieAndTermType.ANALYTICS), id: 'ga' }}
                    label={t('cookies.analytics')}
                    checked={watch(CookieAndTermType.ANALYTICS)}
                  />
                  <br />
                  <Typography variant="body2">{t('cookies.analyticsDesc')}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                mt: 4,
                gap: 2,
              }}
            >
              <Grid item>
                <Typography>
                  <Button onClick={handleAccept} variant="text" size="small" color="inherit" disableElevation>
                    {t('cookies.saveSettings')}
                  </Button>
                </Typography>
              </Grid>

              <Grid item>
                <Button onClick={handleAcceptAll} variant="contained" color="secondary" size="small" disableElevation>
                  {t('cookies.acceptAll')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

const CookieBannerPopup = (): ReactElement | null => {
  const cookiePopup = useAppSelector(selectCookieBanner)
  const dispatch = useAppDispatch()

  const hasAccepted = useAppSelector(hasAcceptedTerms)
  const shouldOpen = !hasAccepted

  useEffect(() => {
    if (shouldOpen) {
      dispatch(openCookieBanner({}))
    } else {
      dispatch(closeCookieBanner())
    }
  }, [dispatch, shouldOpen])

  return cookiePopup.open ? (
    <div className={css.popup}>
      <CookieAndTermBanner warningKey={cookiePopup.warningKey} inverted />
    </div>
  ) : null
}
export default CookieBannerPopup
