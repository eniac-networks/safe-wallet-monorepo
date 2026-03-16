import * as React from 'react'
import { DialogActions, DialogContent, Typography, Button } from '@mui/material'
import type { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'
import ModalDialog from '@/components/common/ModalDialog'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  app: SafeAppData
  onClose: () => void
  onConfirm: (appId: number) => void
}

const RemoveCustomAppModal = ({ open, onClose, onConfirm, app }: Props) => {
  const { t } = useTranslation()
  return (
    <ModalDialog open={open} onClose={onClose} dialogTitle={t('safeApps.removeCustomAppTitle')}>
      <DialogContent>
        <Typography variant="h6" pt={3}>
          {t('safeApps.confirmRemoveApp', { appName: app.name })}
        </Typography>
      </DialogContent>
      <DialogActions disableSpacing>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant="danger" onClick={() => onConfirm(app.id)}>
          {t('safeApps.remove')}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}

export { RemoveCustomAppModal }
