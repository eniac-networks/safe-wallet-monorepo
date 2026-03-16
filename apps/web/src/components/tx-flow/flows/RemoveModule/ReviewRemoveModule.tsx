import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { useCallback, useContext, useEffect, type PropsWithChildren } from 'react'
import { Errors, logError } from '@/services/exceptions'
import { trackEvent, SETTINGS_EVENTS } from '@/services/analytics'
import { createRemoveModuleTx } from '@/services/tx/tx-sender'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import { type RemoveModuleFlowProps } from '.'
import EthHashInfo from '@/components/common/EthHashInfo'
import ReviewTransaction from '@/components/tx/ReviewTransactionV2'

export const ReviewRemoveModule = ({
  params,
  onSubmit,
  children,
}: PropsWithChildren<{ params: RemoveModuleFlowProps; onSubmit: () => void }>) => {
  const { t } = useTranslation()
  const { setSafeTx, safeTxError, setSafeTxError } = useContext(SafeTxContext)

  useEffect(() => {
    createRemoveModuleTx(params.address).then(setSafeTx).catch(setSafeTxError)
  }, [params.address, setSafeTx, setSafeTxError])

  useEffect(() => {
    if (safeTxError) {
      logError(Errors._806, safeTxError.message)
    }
  }, [safeTxError])

  const onFormSubmit = useCallback(() => {
    trackEvent(SETTINGS_EVENTS.MODULES.REMOVE_MODULE)
    onSubmit()
  }, [onSubmit])

  return (
    <ReviewTransaction onSubmit={onFormSubmit}>
      <Typography color="primary.light">{t('settings.module')}</Typography>

      <EthHashInfo address={params.address} showCopyButton hasExplorer shortAddress={false} />

      <Typography my={2}>{t('settings.removeModuleDescription')}</Typography>

      {children}
    </ReviewTransaction>
  )
}
