import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { ReactElement } from 'react'

import ModalDialog from '@/components/common/ModalDialog'
import { useAppDispatch } from '@/store'
import { removeAddressBookEntry } from '@/store/addressBookSlice'
import useChainId from '@/hooks/useChainId'
import useAddressBook from '@/hooks/useAddressBook'
import { useTranslation } from 'react-i18next'

const RemoveDialog = ({ handleClose, address }: { handleClose: () => void; address: string }): ReactElement => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const chainId = useChainId()
  const addressBook = useAddressBook()

  const name = addressBook?.[address]

  const handleConfirm = () => {
    dispatch(removeAddressBookEntry({ chainId, address }))
    handleClose()
  }

  return (
    <ModalDialog open onClose={handleClose} dialogTitle={t('addressBook.deleteTitle')}>
      <DialogContent sx={{ p: '24px !important' }}>
        <Typography>{t('addressBook.deleteConfirm', { name })}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{t('common.cancel')}</Button>
        <Button onClick={handleConfirm} variant="danger" disableElevation>
          {t('addressBook.delete')}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}

export default RemoveDialog
