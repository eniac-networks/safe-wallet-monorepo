import type { WalletKitTypes } from '@reown/walletkit'
import { Alert, SvgIcon } from '@mui/material'
import AlertIcon from '@/public/images/notifications/alert.svg'
import type { ReactElement } from 'react'
import { getPeerName } from '@/features/walletconnect/services/utils'
import css from './styles.module.css'
import { useTranslation } from 'react-i18next'

const ProposalVerification = ({ proposal }: { proposal: WalletKitTypes.SessionProposal }): ReactElement | null => {
  const { t } = useTranslation()
  const { isScam, validation } = proposal.verifyContext.verified

  if (validation === 'UNKNOWN' || validation === 'VALID') {
    return null
  }

  const appName = getPeerName(proposal.params.proposer)

  return (
    <Alert
      severity="error"
      sx={{ bgcolor: 'error.background' }}
      className={css.alert}
      icon={
        <SvgIcon
          component={AlertIcon}
          inheritViewBox
          color="error"
          sx={{
            '& path': {
              fill: 'error.main',
            },
          }}
        />
      }
    >
      {isScam
        ? t('walletconnect.scamWarning', { name: appName || t('walletconnect.thisDapp') })
        : t('walletconnect.domainMismatch', { name: appName || t('walletconnect.thisDappTitle') })}
    </Alert>
  )
}
export default ProposalVerification
