import { Box, Button, Grid, Typography } from '@mui/material'
import Track from '@/components/common/Track'
import { SETTINGS_EVENTS } from '@/services/analytics'
import { ChangeThresholdFlow } from '@/components/tx-flow/flows'
import CheckWallet from '@/components/common/CheckWallet'
import { useContext } from 'react'
import { TxModalContext } from '@/components/tx-flow'
import { useTranslation } from 'react-i18next'

export const RequiredConfirmation = ({ threshold, owners }: { threshold: number; owners: number }) => {
  const { t } = useTranslation()
  const { setTxFlow } = useContext(TxModalContext)

  return (
    <Box
      sx={{
        marginTop: 6,
      }}
    >
      <Grid container spacing={3}>
        <Grid item lg={4} xs={12}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            {t('settings.requiredConfirmations')}
          </Typography>
        </Grid>

        <Grid item xs>
          <Typography
            sx={{
              pb: 2,
            }}
          >
            {t('settings.transactionRequiresConfirmation')}
          </Typography>

          <Typography
            component="span"
            sx={{
              pt: 3,
              pr: 2,
            }}
          >
            <b>{threshold}</b> {t('settings.outOfSigners', { count: owners, owners })}.
          </Typography>

          {owners > 1 && (
            <CheckWallet>
              {(isOk) => (
                <Track {...SETTINGS_EVENTS.SETUP.CHANGE_THRESHOLD} as="span">
                  <Button
                    onClick={() => setTxFlow(<ChangeThresholdFlow />)}
                    variant="contained"
                    disabled={!isOk}
                    size="small"
                  >
                    {t('settings.change')}
                  </Button>
                </Track>
              )}
            </CheckWallet>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
