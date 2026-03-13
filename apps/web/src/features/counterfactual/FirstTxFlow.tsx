import { AppRoutes } from '@/config/routes'
import { useIsRecoverySupported } from '@/features/recovery/hooks/useIsRecoverySupported'
import useRecovery from '@/features/recovery/hooks/useRecovery'
import dynamic from 'next/dynamic'
import { OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import ModalDialog from '@/components/common/ModalDialog'
import ChoiceButton from '@/components/common/ChoiceButton'
import { TxModalContext } from '@/components/tx-flow'
import { AddOwnerFlow, TokenTransferFlow, UpsertRecoveryFlow } from '@/components/tx-flow/flows'
const ActivateAccountFlow = dynamic(() => import('./ActivateAccountFlow'))
import { useTxBuilderApp } from '@/hooks/safe-apps/useTxBuilderApp'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import SaveAddressIcon from '@/public/images/common/save-address.svg'
import RecoveryPlus from '@/public/images/common/recovery-plus.svg'
import SwapIcon from '@/public/images/common/swap.svg'
import SafeLogo from '@/public/images/logo-no-text.svg'
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined'
import useIsSwapFeatureEnabled from '../swap/hooks/useIsSwapFeatureEnabled'

const FirstTxFlow = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation()
  const txBuilder = useTxBuilderApp()
  const router = useRouter()
  const { setTxFlow } = useContext(TxModalContext)
  const supportsRecovery = useIsRecoverySupported()
  const [recovery] = useRecovery()
  const isSwapFeatureEnabled = useIsSwapFeatureEnabled()

  const handleClick = (onClick: () => void) => {
    onClose()
    onClick()
  }

  const onSendToken = () => {
    trackEvent({ ...OVERVIEW_EVENTS.CHOOSE_TRANSACTION_TYPE, label: 'send_token' })
    setTxFlow(<TokenTransferFlow />)
  }

  const onActivateSafe = () => {
    trackEvent({ ...OVERVIEW_EVENTS.CHOOSE_TRANSACTION_TYPE, label: 'activate_safe' })
    setTxFlow(<ActivateAccountFlow />)
  }

  const onAddSigner = () => {
    trackEvent({ ...OVERVIEW_EVENTS.CHOOSE_TRANSACTION_TYPE, label: 'add_signer' })
    setTxFlow(<AddOwnerFlow />)
  }

  const onRecovery = () => {
    trackEvent({ ...OVERVIEW_EVENTS.CHOOSE_TRANSACTION_TYPE, label: 'setup_recovery' })
    setTxFlow(<UpsertRecoveryFlow />)
  }

  const onSwap = () => {
    trackEvent({ ...OVERVIEW_EVENTS.CHOOSE_TRANSACTION_TYPE, label: 'swap' })
    router.push(
      isSwapFeatureEnabled
        ? { pathname: AppRoutes.swap, query: router.query }
        : { pathname: AppRoutes.apps.index, query: { ...router.query, categories: 'Aggregator' } },
    )
  }

  const onCustomTransaction = () => {
    if (!txBuilder) return

    trackEvent({ ...OVERVIEW_EVENTS.CHOOSE_TRANSACTION_TYPE, label: 'tx_builder' })
    router.push(txBuilder.link)
  }

  const showRecoveryOption = supportsRecovery && !recovery

  return (
    <ModalDialog open={open} dialogTitle={t('counterfactual.createNewTransaction')} hideChainIndicator onClose={onClose}>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: 'center',
          flexDirection: 'column',
          p: 3,
        }}
      >
        <Grid item>
          <ChoiceButton
            title={t('counterfactual.activateSafeNow')}
            description={t('counterfactual.activateSafeDescription')}
            icon={SafeLogo}
            onClick={() => handleClick(onActivateSafe)}
          />
        </Grid>

        <Grid item>
          <ChoiceButton
            title={t('settings.addSigner')}
            description={t('counterfactual.addSignerDescription')}
            icon={SaveAddressIcon}
            onClick={() => handleClick(onAddSigner)}
          />
        </Grid>

        {showRecoveryOption && (
          <Grid item>
            <ChoiceButton
              title={t('counterfactual.setupRecovery')}
              description={t('counterfactual.setupRecoveryDescription')}
              icon={RecoveryPlus}
              onClick={() => handleClick(onRecovery)}
            />
          </Grid>
        )}

        <Grid item>
          <ChoiceButton
            title={t('counterfactual.swapTokens')}
            description={t('counterfactual.swapDescription')}
            icon={SwapIcon}
            onClick={() => handleClick(onSwap)}
          />
        </Grid>

        {txBuilder && (
          <Grid item>
            <ChoiceButton
              title={t('counterfactual.customTransaction')}
              description={t('counterfactual.customTransactionDescription')}
              icon={HandymanOutlinedIcon}
              onClick={() => handleClick(onCustomTransaction)}
            />
          </Grid>
        )}

        <Grid item>
          <ChoiceButton title={t('counterfactual.sendToken')} icon={AssetsIcon} onClick={() => handleClick(onSendToken)} />
        </Grid>
      </Grid>
    </ModalDialog>
  )
}

export default FirstTxFlow
