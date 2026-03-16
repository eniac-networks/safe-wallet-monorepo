import useWallet from '@/hooks/wallets/useWallet'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  Box,
  SvgIcon,
  CircularProgress,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import madProps from '@/utils/mad-props'
import useChainId from '@/hooks/useChainId'
import useSafeAddress from '@/hooks/useSafeAddress'
import { deleteTx } from '@/utils/gateway'
import { getAssertedChainSigner } from '@/services/tx/tx-sender/sdk'
import InfoIcon from '@/public/images/notifications/info.svg'
import ErrorMessage from '@/components/tx/ErrorMessage'
import ExternalLink from '@/components/common/ExternalLink'
import ChainIndicator from '@/components/common/ChainIndicator'
import { txDispatch, TxEvent } from '@/services/tx/txEvents'
import { REJECT_TX_EVENTS } from '@/services/analytics/events/reject-tx'
import { trackEvent } from '@/services/analytics'
import { isWalletRejection } from '@/utils/wallets'
import CheckWallet from '@/components/common/CheckWallet'
import ChainSwitcher from '@/components/common/ChainSwitcher'

type DeleteTxModalProps = {
  safeTxHash: string
  onClose: () => void
  onSuccess: () => void
  wallet: ReturnType<typeof useWallet>
  chainId: ReturnType<typeof useChainId>
  safeAddress: ReturnType<typeof useSafeAddress>
}

const InternalDeleteTxModal = ({
  safeTxHash,
  onSuccess,
  onClose,
  wallet,
  safeAddress,
  chainId,
}: DeleteTxModalProps) => {
  const { t } = useTranslation()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onConfirm = async () => {
    setError(undefined)
    setIsLoading(true)
    trackEvent(REJECT_TX_EVENTS.DELETE_CONFIRM)

    if (!wallet?.provider || !safeAddress || !chainId || !safeTxHash) {
      setIsLoading(false)
      setError(new Error('Please connect your wallet first'))
      trackEvent(REJECT_TX_EVENTS.DELETE_FAIL)
      return
    }

    try {
      const signer = await getAssertedChainSigner(wallet.provider)

      await deleteTx({
        safeTxHash,
        safeAddress,
        chainId,
        signer,
      })
    } catch (error) {
      setIsLoading(false)
      setError(error as Error)
      trackEvent(isWalletRejection(error as Error) ? REJECT_TX_EVENTS.DELETE_CANCEL : REJECT_TX_EVENTS.DELETE_FAIL)
      return
    }

    setIsLoading(false)
    txDispatch(TxEvent.DELETED, { safeTxHash })
    onSuccess()
    trackEvent(REJECT_TX_EVENTS.DELETE_SUCCESS)
  }

  const onCancel = () => {
    trackEvent(REJECT_TX_EVENTS.DELETE_CANCEL)
    onClose()
  }

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        <Box data-testid="untrusted-token-warning" display="flex" alignItems="center">
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SvgIcon component={InfoIcon} inheritViewBox color="error" />
            {t('recovery.deleteTxTitle')}
          </Typography>

          <Box flexGrow={1} />

          <ChainIndicator chainId={chainId} />

          <IconButton aria-label="close" onClick={onClose} sx={{ marginLeft: 'auto' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box>{t('recovery.deleteTxDescription')}</Box>

        <Box mt={2}>
          {t('recovery.deleteTxRisksPrefix')}{' '}
          <ExternalLink href="https://help.safe.global/en/articles/40836-why-do-i-need-to-pay-for-cancelling-a-transaction">
            {t('recovery.potentialRisks')}
          </ExternalLink>{' '}
          {t('recovery.deleteTxRisksSuffix')}
        </Box>

        <Box mt={2}>
          <ChainSwitcher />
        </Box>

        {error && (
          <Box mt={2}>
            <ErrorMessage error={error}>{t('recovery.errorDeletingTx')}</ErrorMessage>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ padding: 3, justifyContent: 'space-between' }}>
        <Button size="small" variant="text" onClick={onCancel}>
          {t('recovery.keepIt')}
        </Button>

        <CheckWallet checkNetwork>
          {(isOk) => (
            <Button
              data-testid="delete-tx-btn"
              size="small"
              variant="contained"
              color="primary"
              onClick={onConfirm}
              disabled={!isOk || isLoading}
              sx={{ minWidth: '122px', minHeight: '36px' }}
            >
              {isLoading ? <CircularProgress size={20} /> : t('settings.yesDelete')}
            </Button>
          )}
        </CheckWallet>
      </DialogActions>
    </Dialog>
  )
}

const DeleteTxModal = madProps(InternalDeleteTxModal, {
  wallet: useWallet,
  chainId: useChainId,
  safeAddress: useSafeAddress,
})

export default DeleteTxModal
