import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import { useCallback, useContext } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { TxFlowContext } from '../../TxFlowProvider'
import SignForm from './SignForm'
import useIsCounterfactualSafe from '@/features/counterfactual/hooks/useIsCounterfactualSafe'
import { type SlotComponentProps, SlotName } from '../../slots'
import { useRegisterSlot } from '../../slots/hooks'
import type { SubmitCallback } from '../../TxFlow'
import { useAlreadySigned } from '@/components/tx/SignOrExecuteForm/hooks'
import useSafeInfo from '@/hooks/useSafeInfo'

export const Sign = ({
  onSubmit,
  onSubmitSuccess,
  disabled = false,
  ...props
}: SlotComponentProps<SlotName.ComboSubmit>) => {
  const { safeTx, txOrigin } = useContext(SafeTxContext)
  const { txId, trackTxEvent, isSubmitDisabled } = useContext(TxFlowContext)

  const handleSubmitSuccess = useCallback<SubmitCallback>(
    async ({ txId, isExecuted = false } = {}) => {
      onSubmitSuccess?.({ txId, isExecuted })
      trackTxEvent(txId!, isExecuted)
    },
    [onSubmitSuccess, trackTxEvent],
  )

  return (
    <SignForm
      disableSubmit={isSubmitDisabled || disabled}
      origin={txOrigin}
      safeTx={safeTx}
      onSubmit={onSubmit}
      onSubmitSuccess={handleSubmitSuccess}
      txId={txId}
      {...props}
    />
  )
}

const useShouldRegisterSlot = () => {
  const { isProposing, willExecuteThroughRole } = useContext(TxFlowContext)
  const { safeTx } = useContext(SafeTxContext)
  const isCounterfactualSafe = useIsCounterfactualSafe()
  const hasSigned = useAlreadySigned(safeTx)
  const { safe } = useSafeInfo()

  const isFullySigned = safeTx ? safeTx.signatures.size >= safe.threshold : false

  return !!safeTx && !hasSigned && !isFullySigned && !isCounterfactualSafe && !willExecuteThroughRole && !isProposing
}

const SignSlot = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation()
  const condition = useShouldRegisterSlot()
  useRegisterSlot({
    slotName: SlotName.ComboSubmit,
    id: 'sign',
    Component: Sign,
    label: t('safeMessages.sign'),
    condition,
  })
  return children
}

export default SignSlot
