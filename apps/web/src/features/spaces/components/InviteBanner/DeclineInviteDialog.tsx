import { useState } from 'react'
import { Typography } from '@mui/material'
import { DialogContent, DialogActions, Button } from '@mui/material'
import ModalDialog from '@/components/common/ModalDialog'
import ErrorMessage from '@/components/tx/ErrorMessage'
import type { GetSpaceResponse } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import { useMembersDeclineInviteV1Mutation } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { trackEvent } from '@/services/analytics'
import { showNotification } from '@/store/notificationsSlice'
import { useAppDispatch } from '@/store'
import { useTranslation } from 'react-i18next'

type DeclineInviteDialogProps = {
  space: GetSpaceResponse
  onClose: () => void
}

const DeclineInviteDialog = ({ space, onClose }: DeclineInviteDialogProps) => {
  const { t } = useTranslation()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [declineInvite] = useMembersDeclineInviteV1Mutation()
  const dispatch = useAppDispatch()

  const handleConfirm = async () => {
    setErrorMessage('')
    trackEvent({ ...SPACE_EVENTS.DECLINE_INVITE_SUBMIT })
    try {
      const { error } = await declineInvite({ spaceId: space.id })

      if (error) {
        throw error
      }

      onClose()

      dispatch(
        showNotification({
          message: t('spaces.declinedInviteSuccess', { name: space.name }),
          variant: 'success',
          groupKey: 'decline-invite-success',
        }),
      )
    } catch (e) {
      setErrorMessage(t('spaces.declineInviteError'))
    }
  }

  return (
    <ModalDialog open onClose={onClose} dialogTitle={t('spaces.declineInvitation')} hideChainIndicator>
      <DialogContent sx={{ p: '24px !important' }}>
        <Typography>{t('spaces.confirmDeclineInvite', { name: space.name })}</Typography>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </DialogContent>

      <DialogActions>
        <Button data-testid="cancel-btn" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button data-testid="decline-btn" onClick={handleConfirm} variant="danger" disableElevation>
          {t('spaces.decline')}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}

export default DeclineInviteDialog
