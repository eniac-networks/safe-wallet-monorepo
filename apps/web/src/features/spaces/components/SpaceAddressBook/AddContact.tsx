import { Alert, DialogActions, Stack, Button, DialogContent, Typography, CircularProgress, Box } from '@mui/material'
import PlusIcon from '@/public/images/common/plus.svg'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import ModalDialog from '@/components/common/ModalDialog'
import { useState } from 'react'
import AddressInput from '@/components/common/AddressInput'
import NameInput from '@/components/common/NameInput'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import NetworkMultiSelectorInput from '@/components/common/NetworkSelector/NetworkMultiSelectorInput'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import useChains from '@/hooks/useChains'
import { useAddressBooksUpsertAddressBookItemsV1Mutation } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import { useCurrentSpaceId } from '@/features/spaces/hooks/useCurrentSpaceId'
import { showNotification } from '@/store/notificationsSlice'
import { useAppDispatch } from '@/store'
import { useTranslation } from 'react-i18next'

export type ContactField = {
  name: string
  address: string
  networks: ChainInfo[]
}

const AddContact = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { configs: allNetworks } = useChains()
  const dispatch = useAppDispatch()
  const spaceId = useCurrentSpaceId()
  const [upsertAddressBook] = useAddressBooksUpsertAddressBookItemsV1Mutation()

  const defaultValues = {
    name: '',
    address: '',
    networks: allNetworks,
  }

  const methods = useForm<ContactField>({
    mode: 'onChange',
    defaultValues,
  })

  const { handleSubmit, formState, control, reset } = methods

  const { errors } = formState

  const handleClose = () => {
    setOpen(false)
    reset(defaultValues)
    setError('')
  }

  const handleOpen = () => {
    setOpen(true)
    reset(defaultValues)
    setError('')
  }

  const onSubmit = handleSubmit(async (data) => {
    setError(undefined)

    const addressBookItem = {
      name: data.name,
      address: data.address,
      chainIds: data.networks.map((network) => network.chainId),
    }

    try {
      setIsSubmitting(true)
      trackEvent({ ...SPACE_EVENTS.ADD_ADDRESS_SUBMIT })

      const result = await upsertAddressBook({
        spaceId: Number(spaceId),
        upsertAddressBookItemsDto: { items: [addressBookItem] },
      })

      if (result.error) {
        setError(t('spaces.somethingWentWrong'))
        return
      }

      dispatch(
        showNotification({
          message: t('spaces.addedContact'),
          variant: 'success',
          groupKey: 'add-contact-success',
        }),
      )

      handleClose()
    } catch (error) {
      setError(t('spaces.somethingWentWrong'))
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <>
      <Button variant="contained" size="small" startIcon={<PlusIcon />} onClick={handleOpen} sx={{ height: '40px' }}>
        {t('spaces.addContact')}
      </Button>
      <ModalDialog open={open} onClose={handleClose} dialogTitle={t('spaces.addContact')} hideChainIndicator>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <DialogContent sx={{ py: 2 }}>
              <Stack spacing={3}>
                <NameInput name="name" label={t('addressBook.name')} required />

                <AddressInput name="address" label={t('addressBook.address')} required showPrefix={false} />

                <Box>
                  <Typography variant="h5" fontWeight={700} display="inline-flex" alignItems="center" gap={1} mb={1}>
                    {t('spaces.selectNetworks')}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    {t('spaces.networksDescription')}{' '}
                  </Typography>
                  <Controller
                    name="networks"
                    control={control}
                    render={({ field }) => (
                      <NetworkMultiSelectorInput
                        name="networks"
                        showSelectAll
                        value={field.value || []}
                        error={!!errors.networks}
                        helperText={errors.networks ? t('spaces.selectAtLeastOneNetwork') : ''}
                      />
                    )}
                    rules={{ required: true }}
                  />
                </Box>
              </Stack>

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
              <Button type="submit" variant="contained" disabled={!formState.isValid || isSubmitting} disableElevation>
                {isSubmitting ? <CircularProgress size={20} /> : t('spaces.addContact')}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </ModalDialog>
    </>
  )
}

export default AddContact
