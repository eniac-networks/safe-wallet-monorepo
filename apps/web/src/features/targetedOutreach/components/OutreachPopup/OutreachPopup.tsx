import { useCreateSubmissionMutation, useGetSubmissionQuery } from '@/store/api/gateway'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, type ReactElement } from 'react'
import { Avatar, Box, Button, IconButton, Link, Paper, Stack, ThemeProvider, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import type { Theme } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '@/store'
import css from './styles.module.css'
import { closeOutreachBanner, openOutreachBanner, selectOutreachBanner } from '@/store/popupSlice'
import useLocalStorage, { useSessionStorage } from '@/services/local-storage/useLocalStorage'
import useShowOutreachPopup from '@/features/targetedOutreach/hooks/useShowOutreachPopup'
import { ACTIVE_OUTREACH, OUTREACH_LS_KEY, OUTREACH_SS_KEY } from '@/features/targetedOutreach/constants'
import Track from '@/components/common/Track'
import { OUTREACH_EVENTS } from '@/services/analytics/events/outreach'
import SafeThemeProvider from '@/components/theme/SafeThemeProvider'
import useChainId from '@/hooks/useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { useTranslation } from 'react-i18next'

const OutreachPopup = (): ReactElement | null => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const outreachPopup = useAppSelector(selectOutreachBanner)
  const [isClosed, setIsClosed] = useLocalStorage<boolean>(`${OUTREACH_LS_KEY}_v${ACTIVE_OUTREACH.id}`)
  const currentChainId = useChainId()
  const safeAddress = useSafeAddress()
  const wallet = useWallet()
  const [createSubmission] = useCreateSubmissionMutation()
  const { data: submission } = useGetSubmissionQuery(
    !wallet || !safeAddress
      ? skipToken
      : {
          outreachId: ACTIVE_OUTREACH.id,
          chainId: currentChainId,
          safeAddress,
          signerAddress: wallet?.address,
        },
  )

  const outreachUrl = `${ACTIVE_OUTREACH.url}#safe_address=${safeAddress}&signer_address=${wallet?.address}&chain_id=${currentChainId}`

  const [askAgainLaterTimestamp, setAskAgainLaterTimestamp] = useSessionStorage<number>(
    `${OUTREACH_SS_KEY}_v${ACTIVE_OUTREACH.id}`,
  )

  const shouldOpen = useShowOutreachPopup(isClosed, askAgainLaterTimestamp, submission)

  const handleClose = () => {
    setIsClosed(true)
    dispatch(closeOutreachBanner())
  }

  const handleAskAgainLater = () => {
    setAskAgainLaterTimestamp(Date.now())
    dispatch(closeOutreachBanner())
  }

  // Decide whether to show the popup.
  useEffect(() => {
    if (shouldOpen) {
      dispatch(openOutreachBanner())
    } else {
      dispatch(closeOutreachBanner())
    }
  }, [dispatch, shouldOpen])

  if (!outreachPopup.open) return null

  const handleOpenSurvey = async () => {
    if (wallet) {
      await createSubmission({
        outreachId: ACTIVE_OUTREACH.id,
        chainId: currentChainId,
        safeAddress,
        signerAddress: wallet.address,
      })
    }
    dispatch(closeOutreachBanner())
  }

  return (
    // Enforce light theme for the popup
    <SafeThemeProvider mode="light">
      {(safeTheme: Theme) => (
        <ThemeProvider theme={safeTheme}>
          <Box className={css.popup}>
            <Paper className={css.container}>
              <Stack gap={2}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    alt={t('outreach.avatarAlt')}
                    src="/images/common/outreach-popup-avatar.png"
                    className={css.avatar}
                  />
                  <Box ml={1}>
                    <Typography variant="body2">Danilo Pereira</Typography>
                    <Typography variant="body2" color="primary.light">
                      {t('outreach.authorTitle')}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {t('outreach.headingLine1')}
                  <br />
                  {t('outreach.headingLine2')}
                </Typography>
                <Typography>{t('outreach.body')}</Typography>
                <Track {...OUTREACH_EVENTS.OPEN_SURVEY}>
                  <Link rel="noreferrer noopener" target="_blank" href={outreachUrl}>
                    <Button fullWidth variant="contained" onClick={handleOpenSurvey}>
                      {t('outreach.getInvolved')}
                    </Button>
                  </Link>
                </Track>
                <Track {...OUTREACH_EVENTS.ASK_AGAIN_LATER}>
                  <Button fullWidth variant="text" onClick={handleAskAgainLater}>
                    {t('outreach.askLater')}
                  </Button>
                </Track>
                <Typography variant="body2" color="primary.light" mx="auto">
                  {t('outreach.timeNote')}
                </Typography>
              </Stack>
              <Track {...OUTREACH_EVENTS.CLOSE_POPUP}>
                <IconButton className={css.close} aria-label={t('outreach.closeAriaLabel')} onClick={handleClose}>
                  <Close />
                </IconButton>
              </Track>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  )
}
export default OutreachPopup
