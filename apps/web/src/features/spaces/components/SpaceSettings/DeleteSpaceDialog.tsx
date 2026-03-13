import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  SvgIcon,
  Typography,
} from '@mui/material'
import ModalDialog from '@/components/common/ModalDialog'
import { type GetSpaceResponse, useSpacesDeleteV1Mutation } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import CheckIcon from '@/public/images/common/check.svg'
import CloseIcon from '@/public/images/common/close.svg'
import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { showNotification } from '@/store/notificationsSlice'
import { useAppDispatch } from '@/store'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { trackEvent } from '@/services/analytics'
import { useTranslation } from 'react-i18next'

const ListIcon = ({ variant }: { variant: 'success' | 'danger' }) => {
  const Icon = variant === 'success' ? CheckIcon : CloseIcon

  return (
    <ListItemIcon className={variant === 'success' ? css.success : css.danger}>
      <SvgIcon component={Icon} inheritViewBox />
    </ListItemIcon>
  )
}

const DeleteSpaceDialog = ({ space, onClose }: { space: GetSpaceResponse | undefined; onClose: () => void }) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [deleteSpace] = useSpacesDeleteV1Mutation()

  const onDelete = async () => {
    if (!space) return

    setError(undefined)

    try {
      await deleteSpace({ id: space.id })

      onClose()

      trackEvent({ ...SPACE_EVENTS.DELETE_SPACE })
      dispatch(
        showNotification({
          message: t('spaces.deletedSpaceSuccess', { name: space.name }),
          variant: 'success',
          groupKey: 'delete-space-success',
        }),
      )

      router.push({ pathname: AppRoutes.welcome.spaces })
    } catch (e) {
      console.error(e)
      setError(t('spaces.deleteSpaceError'))
    }
  }

  return (
    <ModalDialog dialogTitle={t('spaces.deleteSpace')} hideChainIndicator open onClose={onClose}>
      <DialogContent sx={{ mt: 2 }}>
        <Typography mb={2}>
          {t('spaces.confirmDeleteSpace', { name: space?.name })}
        </Typography>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ListItem disablePadding>
            <ListIcon variant="danger" />
            {t('spaces.deleteRevokeAccess')}
          </ListItem>
          <ListItem disablePadding>
            <ListIcon variant="danger" />
            {t('spaces.deleteRemoveMembers')}
          </ListItem>
          <ListItem disablePadding>
            <ListIcon variant="success" />
            {t('spaces.deleteKeepSafeAccounts')}
          </ListItem>
        </List>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('settings.noKeepIt')}</Button>
        <Button data-testid="space-confirm-delete-button" variant="danger" onClick={onDelete}>
          {t('spaces.permanentlyDeleteIt')}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}

export default DeleteSpaceDialog
