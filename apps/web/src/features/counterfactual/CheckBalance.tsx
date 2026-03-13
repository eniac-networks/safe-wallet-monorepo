import ExternalLink from '@/components/common/ExternalLink'
import ActivateAccountButton from '@/features/counterfactual/ActivateAccountButton'
import Track from '@/components/common/Track'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import { COUNTERFACTUAL_EVENTS } from '@/services/analytics/events/counterfactual'
import { getBlockExplorerLink } from '@safe-global/utils/utils/chains'
import { Alert, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const CheckBalance = () => {
  const { t } = useTranslation()
  const { safe, safeAddress } = useSafeInfo()
  const chain = useCurrentChain()

  if (safe.deployed) return null

  const blockExplorerLink = chain ? getBlockExplorerLink(chain, safeAddress) : undefined

  return (
    <Alert
      data-testid="no-tokens-alert"
      icon={false}
      severity="info"
      sx={{ display: 'flex', maxWidth: '600px', mt: 3, px: 3, py: 2, mx: 'auto' }}
    >
      <Typography fontWeight="bold" mb={1}>
        {t('counterfactual.dontSeeTokens')}
      </Typography>
      <Typography variant="body2" mb={2}>
        {t('counterfactual.checkBalanceDescription')}{' '}
        {blockExplorerLink && (
          <>
            {t('counterfactual.viewOnBlockExplorer')}{' '}
            <Track {...COUNTERFACTUAL_EVENTS.CHECK_BALANCES}>
              <ExternalLink href={blockExplorerLink.href}>{t('counterfactual.blockExplorer')}</ExternalLink>
            </Track>
          </>
        )}
      </Typography>

      <ActivateAccountButton />
    </Alert>
  )
}

export default CheckBalance
