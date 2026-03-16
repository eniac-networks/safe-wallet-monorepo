import { useTranslation } from 'react-i18next'
import { trackEvent } from '@/services/analytics'
import { RECOVERY_EVENTS } from '@/services/analytics/events/recovery'
import { Typography } from '@mui/material'
import { useCallback, useContext, useEffect } from 'react'
import type { PropsWithChildren, ReactElement } from 'react'

import { createRemoveModuleTx } from '@/services/tx/tx-sender'
import { OwnerList } from '../../common/OwnerList'
import { SafeTxContext } from '../../SafeTxProvider'
import type { RecoveryFlowProps } from '.'
import ReviewTransaction from '@/components/tx/ReviewTransactionV2'

export function RemoveRecoveryFlowReview({
  delayModifier,
  onSubmit,
  children,
}: PropsWithChildren<RecoveryFlowProps & { onSubmit: () => void }>): ReactElement {
  const { t } = useTranslation()
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)

  useEffect(() => {
    createRemoveModuleTx(delayModifier.address).then(setSafeTx).catch(setSafeTxError)
  }, [delayModifier.address, setSafeTx, setSafeTxError])

  const onFormSubmit = useCallback(() => {
    trackEvent({ ...RECOVERY_EVENTS.SUBMIT_RECOVERY_REMOVE })
    onSubmit()
  }, [onSubmit])

  return (
    <ReviewTransaction onSubmit={onFormSubmit}>
      <Typography>{t('recovery.removeRecoveryDescription')}</Typography>

      <OwnerList
        title={t('recovery.removingRecoverer')}
        owners={delayModifier.recoverers.map((recoverer) => ({ value: recoverer }))}
        sx={{ bgcolor: ({ palette }) => `${palette.warning.background} !important` }}
      />

      {children}
    </ReviewTransaction>
  )
}
