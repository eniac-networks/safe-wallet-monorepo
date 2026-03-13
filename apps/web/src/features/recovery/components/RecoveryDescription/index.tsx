import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { useMemo } from 'react'
import type { ReactElement } from 'react'

import EthHashInfo from '@/components/common/EthHashInfo'
import { InfoDetails } from '@/components/transactions/InfoDetails'
import ErrorMessage from '@/components/tx/ErrorMessage'
import { useIsRecoverer } from '@/features/recovery/hooks/useIsRecoverer'
import useSafeInfo from '@/hooks/useSafeInfo'
import { logError, Errors } from '@/services/exceptions'
import { getRecoveredSafeInfo } from '@/features/recovery/services/transaction-list'
import type { RecoveryQueueItem } from '@/features/recovery/services/recovery-state'

export function RecoveryDescription({ item }: { item: RecoveryQueueItem }): ReactElement {
  const { t } = useTranslation()
  const { args, isMalicious } = item
  const { safe } = useSafeInfo()
  const isRecoverer = useIsRecoverer()

  const newSetup = useMemo(() => {
    try {
      return getRecoveredSafeInfo(safe, {
        to: args.to,
        value: args.value.toString(),
        data: args.data,
      })
    } catch (e) {
      logError(Errors._811, e)
    }
    // We only render the threshold and owners
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.data, args.to, args.value, safe.threshold, safe.owners])

  if (isMalicious) {
    return (
      <ErrorMessage>{t('recovery.maliciousActions')}</ErrorMessage>
    )
  }

  // TODO: Improve by using Tenderly to check if the proposal will fail
  if (!newSetup || newSetup.owners.length === 0) {
    return (
      <ErrorMessage>
        {isRecoverer ? t('recovery.proposalWillFailRecoverer') : t('recovery.proposalWillFail')}
      </ErrorMessage>
    )
  }

  return (
    <InfoDetails title={t('recovery.addSigners')}>
      {newSetup.owners.map((owner) => (
        <EthHashInfo key={owner.value} address={owner.value} shortAddress={false} showCopyButton hasExplorer />
      ))}

      <div>
        <Typography fontWeight={700} gutterBottom>
          {t('recovery.requiredConfirmations')}
        </Typography>
        <Typography>
          {t('recovery.outOfOwners', { threshold: newSetup.threshold, count: newSetup.owners.length })}
        </Typography>
      </div>
    </InfoDetails>
  )
}
