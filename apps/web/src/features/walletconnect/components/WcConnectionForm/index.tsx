import { useCallback, useEffect } from 'react'
import { Grid, Typography, Divider, SvgIcon, IconButton, Tooltip, Box } from '@mui/material'
import type { ReactElement } from 'react'
import type { SessionTypes } from '@walletconnect/types'
import useLocalStorage from '@/services/local-storage/useLocalStorage'
import InfoIcon from '@/public/images/notifications/info.svg'
import WcHints from '../WcHints'
import WcSessionList from '../WcSessionList'
import WcInput from '../WcInput'
import WcLogoHeader from '../WcLogoHeader'
import css from './styles.module.css'
import useSafeInfo from '@/hooks/useSafeInfo'
import Track from '@/components/common/Track'
import { WALLETCONNECT_EVENTS } from '@/services/analytics/events/walletconnect'
import { BRAND_NAME } from '@/config/constants'
import { useTranslation } from 'react-i18next'

const WC_HINTS_KEY = 'wcHints'

export const WcConnectionForm = ({ sessions, uri }: { sessions: SessionTypes.Struct[]; uri: string }): ReactElement => {
  const { t } = useTranslation()
  const [showHints = true, setShowHints] = useLocalStorage<boolean>(WC_HINTS_KEY)
  const { safeLoaded } = useSafeInfo()

  const onToggle = useCallback(() => {
    setShowHints((prev) => !prev)
  }, [setShowHints])

  // Show the hints only once
  useEffect(() => {
    return () => setShowHints(false)
  }, [setShowHints])

  return (
    <Grid className={css.container}>
      <Grid
        item
        sx={{
          textAlign: 'center',
        }}
      >
        <Tooltip
          title={showHints ? t('walletconnect.hideHints') : t('walletconnect.showHints')}
          placement="top"
          arrow
          className={css.infoIcon}
        >
          <span>
            <Track {...(showHints ? WALLETCONNECT_EVENTS.HINTS_HIDE : WALLETCONNECT_EVENTS.HINTS_SHOW)}>
              <IconButton onClick={onToggle}>
                <SvgIcon component={InfoIcon} inheritViewBox color="border" />
              </IconButton>
            </Track>
          </span>
        </Tooltip>

        <WcLogoHeader />

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {safeLoaded
            ? t('walletconnect.pastePairingCode', { brandName: BRAND_NAME })
            : t('walletconnect.openSafeAccount')}
        </Typography>

        {safeLoaded ? (
          <Box
            sx={{
              mt: 3,
            }}
          >
            <WcInput uri={uri} />
          </Box>
        ) : null}
      </Grid>
      <Divider flexItem />
      <Grid item>
        <WcSessionList sessions={sessions} />
      </Grid>
      {showHints && (
        <>
          <Divider flexItem />

          <Grid
            item
            sx={{
              mt: 1,
            }}
          >
            <WcHints />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default WcConnectionForm
