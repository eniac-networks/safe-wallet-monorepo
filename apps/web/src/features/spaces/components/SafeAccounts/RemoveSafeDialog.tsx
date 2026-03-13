import ModalDialog from '@/components/common/ModalDialog'
import { isMultiChainSafeItem } from '@/features/multichain/utils/utils'
import type { SafeItem } from '@/features/myAccounts/hooks/useAllSafes'
import type { MultiChainSafeItem } from '@/features/myAccounts/hooks/useAllSafesGrouped'
import { useCurrentSpaceId } from '@/features/spaces/hooks/useCurrentSpaceId'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { Alert } from '@mui/material'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import { useSpaceSafesDeleteV1Mutation } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showNotification } from '@/store/notificationsSlice'
import { useAppDispatch } from '@/store'

function getToBeDeletedSafeAccounts(safeItem: SafeItem | MultiChainSafeItem) {
  if (isMultiChainSafeItem(safeItem)) {
    return safeItem.safes.map((safe) => ({ chainId: safe.chainId, address: safe.address }))
  }

  return [{ chainId: safeItem.chainId, address: safeItem.address }]
}

const RemoveSafeDialog = ({
  safeItem,
  handleClose,
}: {
  safeItem: SafeItem | MultiChainSafeItem
  handleClose: () => void
}) => {
  const { t } = useTranslation()
  const { address } = safeItem
  const spaceId = useCurrentSpaceId()
  const dispatch = useAppDispatch()
  const [removeSafeAccounts] = useSpaceSafesDeleteV1Mutation()
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    const safeAccounts = getToBeDeletedSafeAccounts(safeItem)
    trackEvent({ ...SPACE_EVENTS.DELETE_ACCOUNT })

    try {
      const result = await removeSafeAccounts({
        spaceId: Number(spaceId),
        deleteSpaceSafesDto: { safes: safeAccounts },
      })

      if (result.error) {
        throw result.error
      }

      dispatch(
        showNotification({
          message: t('spaces.removeSafeSuccess'),
          variant: 'success',
          groupKey: 'remove-safe-account-success',
        }),
      )
    } catch (e) {
      setError(t('spaces.removeSafeError'))
    }
  }

  return (
    <ModalDialog open onClose={handleClose} dialogTitle={t('spaces.removeSafeAccount')} hideChainIndicator>
      <DialogContent sx={{ p: '24px !important' }}>
        <Typography>
          {t('spaces.confirmRemoveSafe', { address })}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button data-testid="cancel-btn" onClick={handleClose}>
          {t('common.cancel')}
        </Button>
        <Button data-testid="delete-btn" onClick={handleConfirm} variant="danger" disableElevation>
          {t('spaces.remove')}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}

export default RemoveSafeDialog
