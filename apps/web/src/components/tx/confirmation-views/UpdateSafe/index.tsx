import type { ReactNode } from 'react'
import { Alert, AlertTitle, Box, Divider, Stack, Typography } from '@mui/material'
import semverSatisfies from 'semver/functions/satisfies'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useQueuedTxsLength } from '@/hooks/useTxQueue'
import ExternalLink from '@/components/common/ExternalLink'
import madProps from '@/utils/mad-props'
import { type TransactionData } from '@safe-global/safe-gateway-typescript-sdk'
import { extractTargetVersionFromUpdateSafeTx } from '@/services/tx/safeUpdateParams'
import { useTranslation } from 'react-i18next'

const QUEUE_WARNING_VERSION = '<1.3.0'

function BgBox({ children, light, warning }: { children: ReactNode; light?: boolean; warning?: boolean }) {
  const bgcolor = warning ? 'warning.background' : light ? 'background.light' : 'border.background'
  return (
    <Box flex={1} bgcolor={bgcolor} p={2} textAlign="center" fontWeight={700} fontSize={18} borderRadius={1}>
      {children}
    </Box>
  )
}

export const _UpdateSafe = UpdateSafeBase

function UpdateSafeBase({
  safeInfo,
  queueSize,
  chain,
  txData,
}: {
  safeInfo: ReturnType<typeof useSafeInfo>
  queueSize: string
  chain: ReturnType<typeof useCurrentChain>
  txData: TransactionData | undefined
}) {
  const { t } = useTranslation()
  const { safe } = safeInfo
  if (!safe.version) {
    return null
  }
  const showQueueWarning = queueSize && semverSatisfies(safe.version, QUEUE_WARNING_VERSION)
  const newVersion = extractTargetVersionFromUpdateSafeTx(txData, safe)

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <BgBox>
          {t('updateSafe.currentVersion')} {safe.version}
        </BgBox>
        <Box fontSize={28}>→</Box>
        {newVersion !== undefined ? (
          <BgBox light>
            {t('updateSafe.newVersion')} {newVersion} {chain?.l2 ? '+L2' : ''}
          </BgBox>
        ) : (
          <BgBox warning>{t('updateSafe.unknownContract')}</BgBox>
        )}
      </Stack>
      {newVersion !== undefined ? (
        <Typography>
          {t('updateSafe.readChangelog')}{' '}
          <ExternalLink href={`https://github.com/safe-global/safe-contracts/releases/tag/v${newVersion}`}>
            {t('updateSafe.versionChangelog', { version: newVersion })}
          </ExternalLink>
        </Typography>
      ) : (
        <Alert severity="error">
          <AlertTitle sx={{ fontWeight: 700 }}>{t('updateSafe.unknownContract')}</AlertTitle>
          {t('updateSafe.unknownContractDesc')}
        </Alert>
      )}

      {showQueueWarning && (
        <Alert severity="warning">
          <AlertTitle sx={{ fontWeight: 700 }}>{t('updateSafe.invalidateQueueTitle')}</AlertTitle>
          {t('updateSafe.queueWarning', { count: parseInt(queueSize) })}
        </Alert>
      )}

      <Divider sx={{ my: 1, mx: -3 }} />
    </>
  )
}

const UpdateSafe = madProps(UpdateSafeBase, {
  chain: useCurrentChain,
  safeInfo: useSafeInfo,
  queueSize: useQueuedTxsLength,
})

export default UpdateSafe
