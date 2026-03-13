import { Card, Typography } from '@mui/material'
import AddressBookIcon from '@/public/images/address-book/empty-address-book.svg'
import { useTranslation } from 'react-i18next'

const EmptyAddressBook = () => {
  const { t } = useTranslation()
  return (
    <>
      <Card sx={{ p: 5, textAlign: 'center' }}>
        <AddressBookIcon />

        <Typography color="text.secondary" mb={2}>
          {t('spaces.contactsWillAppear')}
        </Typography>
      </Card>
    </>
  )
}

export default EmptyAddressBook
