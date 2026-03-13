import { useSpacesCreateWithUserV1Mutation } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import { useRouter } from 'next/router'
import { type ReactElement, useState } from 'react'
import { Alert, Box, Button, CircularProgress, DialogActions, DialogContent, SvgIcon, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import SpaceIcon from '@/public/images/spaces/space.svg'
import ModalDialog from '@/components/common/ModalDialog'
import NameInput from '@/components/common/NameInput'
import { AppRoutes } from '@/config/routes'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { showNotification } from '@/store/notificationsSlice'
import { useAppDispatch } from '@/store'
import ExternalLink from '@/components/common/ExternalLink'
import { useTranslation } from 'react-i18next'

function SpaceCreationModal({ onClose }: { onClose: () => void }): ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const methods = useForm<{ name: string }>({ mode: 'onChange' })
  const [createSpaceWithUser] = useSpacesCreateWithUserV1Mutation()
  const { handleSubmit, formState } = methods

  const onSubmit = handleSubmit(async (data) => {
    setError(undefined)

    try {
      setIsSubmitting(true)
      trackEvent({ ...SPACE_EVENTS.CREATE_SPACE })
      const response = await createSpaceWithUser({ createSpaceDto: { name: data.name } })

      if (response.data) {
        const spaceId = response.data.id.toString()
        router.push({ pathname: AppRoutes.spaces.index, query: { spaceId } })
        onClose()

        dispatch(
          showNotification({
            message: t('spaces.createdSpaceSuccess', { name: data.name }),
            variant: 'success',
            groupKey: 'create-space-success',
          }),
        )
      }

      if (response.error) {
        throw response.error
      }
    } catch (error) {
      // @ts-ignore
      const errorMessage = error?.data?.message || t('spaces.createSpaceError')
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <ModalDialog
      open
      onClose={onClose}
      dialogTitle={
        <>
          <SvgIcon component={SpaceIcon} inheritViewBox sx={{ fill: 'none', mr: 1 }} />
          {t('spaces.createSpace')}
        </>
      }
      hideChainIndicator
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <DialogContent sx={{ py: 2 }}>
            <Box mb={2}>
              <NameInput data-testid="space-name-input" label={t('newSafe.nameLabel')} autoFocus name="name" required />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t('spaces.dataPrivacyPrefix')}<ExternalLink href={AppRoutes.privacy}>{t('newSafe.privacyPolicy')}</ExternalLink>
            </Typography>

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
              data-testid="create-space-modal-button"
              type="submit"
              variant="contained"
              disabled={!formState.isValid || isSubmitting}
              disableElevation
              sx={{ minWidth: '200px' }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : t('spaces.createSpace')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </ModalDialog>
  )
}

export default SpaceCreationModal
