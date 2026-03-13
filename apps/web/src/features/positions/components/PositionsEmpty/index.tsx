import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, Paper, Typography } from '@mui/material'
import DefiIcon from '@/public/images/balances/defi.svg'
import { AppRoutes } from '@/config/routes'
import Track from '@/components/common/Track'
import { POSITIONS_EVENTS } from '@/services/analytics/events/positions'
import { MixPanelEventParams } from '@/services/analytics/mixpanel-events'
import useIsEarnFeatureEnabled from '@/features/earn/hooks/useIsEarnFeatureEnabled'
import { useTranslation } from 'react-i18next'

type PositionsEmptyProps = {
  entryPoint?: string
}

const PositionsEmpty = ({ entryPoint = 'Dashboard' }: PositionsEmptyProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isEarnFeatureEnabled = useIsEarnFeatureEnabled()

  return (
    <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
      <DefiIcon />

      <Typography data-testid="no-tx-text" variant="body1" color="primary.light">
        {t('positions.noPositions')}
      </Typography>

      {isEarnFeatureEnabled && (
        <Track
          {...POSITIONS_EVENTS.EMPTY_POSITIONS_EXPLORE_CLICKED}
          mixpanelParams={{
            [MixPanelEventParams.ENTRY_POINT]: entryPoint,
          }}
        >
          <Link href={{ pathname: AppRoutes.earn, query: { safe: router.query.safe } }} passHref>
            <Button size="small" sx={{ mt: 1 }}>
              {t('positions.exploreEarn')}
            </Button>
          </Link>
        </Track>
      )}
    </Paper>
  )
}

export default PositionsEmpty
