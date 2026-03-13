import { type ReactElement, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import ModalDialog from '@/components/common/ModalDialog'
import memberIcon from '@/public/images/spaces/member.svg'
import adminIcon from '@/public/images/spaces/admin.svg'
import CheckIcon from '@mui/icons-material/Check'
import css from './styles.module.css'
import { useMembersInviteUserV1Mutation } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import { useCurrentSpaceId } from 'src/features/spaces/hooks/useCurrentSpaceId'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import { MemberRole } from '@/features/spaces/hooks/useSpaceMembers'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { useAppDispatch } from '@/store'
import { showNotification } from '@/store/notificationsSlice'
import MemberInfoForm from '@/features/spaces/components/AddMemberModal/MemberInfoForm'
import AddressBookInput from '@/components/common/AddressBookInput'
import useAddressBook from '@/hooks/useAddressBook'
import { useTranslation } from 'react-i18next'

type MemberField = {
  name: string
  address: string
  role: MemberRole
}

export const RoleMenuItem = ({
  role,
  hasDescription = false,
  selected = false,
}: {
  role: MemberRole
  hasDescription?: boolean
  selected?: boolean
}): ReactElement => {
  const { t } = useTranslation()
  const isAdmin = role === MemberRole.ADMIN

  return (
    <Box width="100%" alignItems="center" className={css.roleMenuItem}>
      <Box sx={{ gridArea: 'icon', display: 'flex', alignItems: 'center' }}>
        <SvgIcon mr={1} component={isAdmin ? adminIcon : memberIcon} inheritViewBox fontSize="small" />
      </Box>
      <Typography gridArea="title" fontWeight={hasDescription ? 'bold' : undefined}>
        {isAdmin ? t('spaces.roleAdmin') : t('spaces.roleMember')}
      </Typography>
      {hasDescription && (
        <>
          <Box gridArea="description">
            <Typography variant="body2" sx={{ maxWidth: '300px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
              {isAdmin ? t('spaces.adminDescription') : t('spaces.memberDescription')}
            </Typography>
          </Box>
          <Box gridArea="checkIcon" sx={{ visibility: selected ? 'visible' : 'hidden', mx: 1 }}>
            <CheckIcon fontSize="small" sx={{ color: 'text.primary' }} />
          </Box>
        </>
      )}
    </Box>
  )
}

const AddMemberModal = ({ onClose }: { onClose: () => void }): ReactElement => {
  const { t } = useTranslation()
  const spaceId = useCurrentSpaceId()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inviteMembers] = useMembersInviteUserV1Mutation()
  const addressBook = useAddressBook()

  const methods = useForm<MemberField>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      address: '',
      role: MemberRole.MEMBER,
    },
  })

  const { handleSubmit, formState, watch, setValue } = methods

  const addressValue = watch('address')

  useEffect(() => {
    const addressBookName = addressBook[addressValue]
    if (addressBookName) {
      setValue('name', addressBookName)
    }
  }, [addressBook, addressValue, setValue])

  const onSubmit = handleSubmit(async (data) => {
    setError(undefined)

    if (!spaceId) {
      setError(t('spaces.somethingWentWrong'))
      return
    }

    try {
      setIsSubmitting(true)
      trackEvent({ ...SPACE_EVENTS.ADD_MEMBER })
      const response = await inviteMembers({
        spaceId: Number(spaceId),
        inviteUsersDto: { users: [{ address: data.address, role: data.role, name: data.name }] },
      })

      if (response.data) {
        if (router.pathname !== AppRoutes.spaces.members) {
          router.push({ pathname: AppRoutes.spaces.members, query: { spaceId } })
        }

        dispatch(
          showNotification({
            message: t('spaces.invitedToSpace', { name: data.name }),
            variant: 'success',
            groupKey: 'invite-member-success',
          }),
        )

        onClose()
      }
      if (response.error) {
        // @ts-ignore
        const errorMessage = response.error?.data?.message || t('spaces.inviteFailed')
        setError(errorMessage)
      }
    } catch (e) {
      console.error(e)
      setError(t('spaces.somethingWentWrong'))
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <ModalDialog open onClose={onClose} dialogTitle={t('spaces.addMember')} hideChainIndicator>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <DialogContent sx={{ py: 2 }}>
            <Typography mb={2}>
              {t('spaces.inviteDescription')}
            </Typography>

            <Stack spacing={3}>
              <MemberInfoForm />

              <AddressBookInput
                data-testid="member-address-input"
                name="address"
                label={t('addressBook.address')}
                required
                showPrefix={false}
              />
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>

          <DialogActions>
            <Button data-testid="cancel-btn" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              data-testid="add-member-modal-button"
              type="submit"
              variant="contained"
              disabled={!formState.isValid || isSubmitting}
              disableElevation
            >
              {isSubmitting ? <CircularProgress size={20} /> : t('spaces.addMember')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </ModalDialog>
  )
}

export default AddMemberModal
