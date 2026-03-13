import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgIcon, Typography, Alert, AlertTitle, Skeleton, Button } from '@mui/material'
import { ImplementationVersionState } from '@safe-global/safe-gateway-typescript-sdk'
import { sameAddress } from '@safe-global/utils/utils/addresses'
import type { MasterCopy } from '@/hooks/useMasterCopies'
import { MasterCopyDeployer, useMasterCopies } from '@/hooks/useMasterCopies'
import useSafeInfo from '@/hooks/useSafeInfo'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@/public/images/notifications/info.svg'
import { TxModalContext } from '@/components/tx-flow'
import { UpdateSafeFlow } from '@/components/tx-flow/flows'
import ExternalLink from '@/components/common/ExternalLink'
import CheckWallet from '@/components/common/CheckWallet'
import { useCurrentChain } from '@/hooks/useChains'
import { UnsupportedMastercopyWarning } from '@/features/multichain/components/UnsupportedMastercopyWarning/UnsupportedMasterCopyWarning'
import { getLatestSafeVersion } from '@safe-global/utils/utils/chains'

export const ContractVersion = () => {
  const { t } = useTranslation()
  const { setTxFlow } = useContext(TxModalContext)
  const [masterCopies] = useMasterCopies()
  const { safe, safeLoaded } = useSafeInfo()
  const currentChain = useCurrentChain()
  const masterCopyAddress = safe.implementation.value

  const safeMasterCopy: MasterCopy | undefined = useMemo(() => {
    return masterCopies?.find((mc) => sameAddress(mc.address, masterCopyAddress))
  }, [masterCopies, masterCopyAddress])

  const needsUpdate = safe.implementationVersionState === ImplementationVersionState.OUTDATED
  const showUpdateDialog = safeMasterCopy?.deployer === MasterCopyDeployer.GNOSIS && needsUpdate
  const isLatestVersion = safe.version && !showUpdateDialog

  const latestSafeVersion = getLatestSafeVersion(currentChain)

  return (
    <>
      <Typography variant="h4" fontWeight={700} marginBottom={1}>
        {t('settings.contractVersion')}
      </Typography>

      <Typography variant="body1" fontWeight={400} display="flex" alignItems="center">
        {safeLoaded ? (
          <>
            {safe.version ?? t('settings.unsupportedContract')}
            {isLatestVersion && (
              <>
                <CheckCircleIcon color="primary" sx={{ ml: 1, mr: 0.5 }} /> {t('settings.latestVersion')}
              </>
            )}
          </>
        ) : (
          <Skeleton width="60px" />
        )}
      </Typography>

      {safeLoaded && safe.version && showUpdateDialog ? (
        <Alert
          sx={{ mt: 2, borderRadius: '2px', borderColor: '#B0FFC9' }}
          icon={<SvgIcon component={InfoIcon} inheritViewBox color="secondary" />}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>
            {t('settings.newVersionAvailable', { version: latestSafeVersion })} (
            <ExternalLink href={safeMasterCopy?.deployerRepoUrl}>{t('settings.changelog')}</ExternalLink>)
          </AlertTitle>

          <Typography mb={2}>{t('settings.updateDescription')}</Typography>

          <CheckWallet>
            {(isOk) => (
              <Button onClick={() => setTxFlow(<UpdateSafeFlow />)} variant="contained" disabled={!isOk}>
                {t('settings.update')}
              </Button>
            )}
          </CheckWallet>
        </Alert>
      ) : (
        <UnsupportedMastercopyWarning />
      )}
    </>
  )
}
