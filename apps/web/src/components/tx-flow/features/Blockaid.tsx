import { useContext, useEffect } from 'react'
import { TxFlowContext } from '@/components/tx-flow/TxFlowProvider'
import { SlotName, withSlot } from '../slots'
import { FEATURES } from '@/utils/featureToggled'
import { ErrorBoundary } from '@sentry/react'
import { BlockaidWarning } from '@/components/tx/security/blockaid'
import { TxSecurityContext } from '@/components/tx/security/shared/TxSecurityContext'
import { useTranslation } from 'react-i18next'

const BlockaidSlot = withSlot({
  Component: () => {
    const { t } = useTranslation()
    const { setIsSubmitDisabled } = useContext(TxFlowContext)
    const { needsRiskConfirmation, isRiskConfirmed } = useContext(TxSecurityContext)

    useEffect(() => {
      setIsSubmitDisabled(needsRiskConfirmation && !isRiskConfirmed)
    }, [needsRiskConfirmation, isRiskConfirmed, setIsSubmitDisabled])

    return (
      <ErrorBoundary fallback={<div>{t('txFlow.errorShowingScanResult')}</div>}>
        <BlockaidWarning />
      </ErrorBoundary>
    )
  },
  slotName: SlotName.Footer,
  id: 'blockaid',
  feature: FEATURES.RISK_MITIGATION,
})

export default BlockaidSlot
