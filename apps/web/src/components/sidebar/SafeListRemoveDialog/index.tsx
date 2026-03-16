import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import ModalDialog from '@/components/common/ModalDialog'
import { useAppDispatch } from '@/store'
import useAddressBook from '@/hooks/useAddressBook'
import Track from '@/components/common/Track'
import { OVERVIEW_EVENTS, OVERVIEW_LABELS } from '@/services/analytics'
import { AppRoutes } from '@/config/routes'
import router from 'next/router'
import { removeAddressBookEntry } from '@/store/addressBookSlice'
import { removeSafe, removeUndeployedSafe } from '@/store/slices'
import useSafeAddress from '@/hooks/useSafeAddress'
import useChainId from '@/hooks/useChainId'

const SafeListRemoveDialog = ({
  handleClose,
  address,
  chainId,
}: {
  handleClose: () => void
  address: string
  chainId: string
}): ReactElement => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const safeAddress = useSafeAddress()
  const safeChainId = useChainId()
  const addressBook = useAddressBook()
  const trackingLabel =
    router.pathname === AppRoutes.welcome.accounts ? OVERVIEW_LABELS.login_page : OVERVIEW_LABELS.sidebar

  const safe = addressBook?.[address] || address

  const handleConfirm = async () => {
    // When removing the current counterfactual safe, redirect to the accounts page
    if (safeAddress === address && safeChainId === chainId) {
      await router.push(AppRoutes.welcome.accounts)
    }
    dispatch(removeUndeployedSafe({ chainId, address }))
    dispatch(removeSafe({ chainId, address }))
    dispatch(removeAddressBookEntry({ chainId, address }))
    handleClose()
  }

  return (
    <ModalDialog open onClose={handleClose} dialogTitle={t('sidebar.removeAccountTitle')} chainId={chainId}>
      <DialogContent sx={{ p: '24px !important' }}>
        <Typography>{t('sidebar.removeAccountConfirm', { safe })}</Typography>
      </DialogContent>

      <DialogActions>
        <Button data-testid="cancel-btn" onClick={handleClose}>
          {t('common.cancel')}
        </Button>
        <Track {...OVERVIEW_EVENTS.DELETED_FROM_WATCHLIST} label={trackingLabel}>
          <Button data-testid="delete-btn" onClick={handleConfirm} variant="danger" disableElevation>
            {t('common.delete')}
          </Button>
        </Track>
      </DialogActions>
    </ModalDialog>
  )
}

export default SafeListRemoveDialog
