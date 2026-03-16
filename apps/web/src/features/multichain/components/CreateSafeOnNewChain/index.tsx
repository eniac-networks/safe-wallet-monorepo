import ModalDialog from '@/components/common/ModalDialog'
import NetworkInput from '@/components/common/NetworkInput'
import { updateAddressBook } from '@/components/new-safe/create/logic/address-book'
import ErrorMessage from '@/components/tx/ErrorMessage'
import useAddressBook from '@/hooks/useAddressBook'
import { CREATE_SAFE_CATEGORY, CREATE_SAFE_EVENTS, OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import { gtmSetChainId } from '@/services/analytics/gtm'
import { showNotification } from '@/store/notificationsSlice'
import { Box, Button, CircularProgress, DialogActions, DialogContent, Stack, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSafeCreationData } from '../../hooks/useSafeCreationData'
import { replayCounterfactualSafeDeployment } from '@/features/counterfactual/utils'

import useChains from '@/hooks/useChains'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectRpc } from '@/store/settingsSlice'
import { createWeb3ReadOnly } from '@/hooks/wallets/web3'
import { hasMultiChainAddNetworkFeature, predictAddressBasedOnReplayData } from '@/features/multichain/utils/utils'
import { sameAddress } from '@safe-global/utils/utils/addresses'
import ExternalLink from '@/components/common/ExternalLink'
import { useRouter } from 'next/router'
import ChainIndicator from '@/components/common/ChainIndicator'
import { type ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { useMemo, useState } from 'react'
import { useCompatibleNetworks } from '@safe-global/utils/features/multichain/hooks/useCompatibleNetworks'
import { MULTICHAIN_HELP_ARTICLE } from '@/config/constants'
import { PayMethod } from '@safe-global/utils/features/counterfactual/types'
import { type Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { AppRoutes, UNDEPLOYED_SAFE_BLOCKED_ROUTES } from '@/config/routes'

type CreateSafeOnNewChainForm = {
  chainId: string
}

type ReplaySafeDialogProps = {
  safeAddress: string
  safeCreationResult: ReturnType<typeof useSafeCreationData>
  replayableChains?: ReturnType<typeof useCompatibleNetworks>
  chain?: ChainInfo
  currentName: string | undefined
  open: boolean
  onClose: () => void
  isUnsupportedSafeCreationVersion?: boolean
}

const ReplaySafeDialog = ({
  safeAddress,
  chain,
  currentName,
  open,
  onClose,
  safeCreationResult,
  replayableChains,
  isUnsupportedSafeCreationVersion,
}: ReplaySafeDialogProps) => {
  const { t } = useTranslation()
  const formMethods = useForm<CreateSafeOnNewChainForm>({
    mode: 'all',
    defaultValues: {
      chainId: chain?.chainId || '',
    },
  })
  const { handleSubmit, formState } = formMethods
  const router = useRouter()
  const addressBook = useAddressBook()

  const customRpc = useAppSelector(selectRpc)
  const dispatch = useAppDispatch()
  const [creationError, setCreationError] = useState<Error>()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Load some data
  const [safeCreationData, safeCreationDataError, safeCreationDataLoading] = safeCreationResult

  const onCancel = () => {
    trackEvent({ ...OVERVIEW_EVENTS.CANCEL_ADD_NEW_NETWORK })
    onClose()
  }

  const onFormSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const selectedChain = chain ?? replayableChains?.find((config) => config.chainId === data.chainId)
      if (!safeCreationData || !selectedChain) {
        return
      }

      // We need to create a readOnly provider of the deployed chain
      const customRpcUrl = selectedChain ? customRpc?.[selectedChain.chainId] : undefined
      const provider = createWeb3ReadOnly(selectedChain as ChainInfo, customRpcUrl)
      if (!provider) {
        return
      }

      // 1. Double check that the creation Data will lead to the correct address
      const predictedAddress = await predictAddressBasedOnReplayData(safeCreationData, provider)
      if (!sameAddress(safeAddress, predictedAddress)) {
        setCreationError(new Error('The replayed Safe leads to an unexpected address'))
        return
      }

      gtmSetChainId(selectedChain.chainId)

      trackEvent({ ...OVERVIEW_EVENTS.SUBMIT_ADD_NEW_NETWORK, label: selectedChain.chainId })

      // 2. Replay Safe creation and add it to the counterfactual Safes
      replayCounterfactualSafeDeployment(
        selectedChain.chainId,
        safeAddress,
        safeCreationData,
        currentName || '',
        dispatch,
        PayMethod.PayLater,
      )

      trackEvent({ ...OVERVIEW_EVENTS.PROCEED_WITH_TX, label: 'counterfactual', category: CREATE_SAFE_CATEGORY })
      trackEvent({ ...CREATE_SAFE_EVENTS.CREATED_SAFE, label: 'counterfactual' })

      router.push({
        pathname: UNDEPLOYED_SAFE_BLOCKED_ROUTES.includes(router.pathname) ? AppRoutes.home : router.pathname,
        query: {
          safe: `${selectedChain.shortName}:${safeAddress}`,
        },
      })

      trackEvent({ ...OVERVIEW_EVENTS.SWITCH_NETWORK, label: selectedChain.chainId })

      dispatch(
        updateAddressBook(
          [selectedChain.chainId],
          safeAddress,
          currentName || '',
          safeCreationData.safeAccountConfig.owners.map((owner) => ({
            address: owner,
            name: addressBook[owner] || '',
          })),
          safeCreationData.safeAccountConfig.threshold,
        ),
      )

      dispatch(
        showNotification({
          variant: 'success',
          groupKey: 'replay-safe-success',
          message: t('multichain.addedToChain', { chainName: selectedChain.chainName }),
        }),
      )
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)

      // Close modal
      onClose()
    }
  })

  const submitDisabled =
    isUnsupportedSafeCreationVersion ||
    !!safeCreationDataError ||
    safeCreationDataLoading ||
    !formState.isValid ||
    isSubmitting

  const noChainsAvailable =
    !chain && safeCreationData && replayableChains && replayableChains.filter((chain) => chain.available).length === 0

  return (
    <ModalDialog open={open} onClose={onClose} dialogTitle={t('multichain.addAnotherNetwork')} hideChainIndicator>
      <form onSubmit={onFormSubmit} id="recreate-safe">
        <DialogContent data-testid="add-chain-dialog">
          <FormProvider {...formMethods}>
            <Stack spacing={2}>
              <Typography>{t('multichain.addToNewChain')}</Typography>

              {chain && (
                <Box
                  data-testid="added-network"
                  sx={{
                    p: 2,
                    backgroundColor: 'background.main',
                    borderRadius: '6px',
                  }}
                >
                  <ChainIndicator chainId={chain.chainId} />
                </Box>
              )}

              <ErrorMessage level="info">{t('multichain.initialSetupInfo')}</ErrorMessage>

              {safeCreationDataLoading ? (
                <Stack
                  direction="column"
                  sx={{
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body2">{t('multichain.loadingSafeData')}</Typography>
                </Stack>
              ) : safeCreationDataError ? (
                <ErrorMessage error={safeCreationDataError} level="error">
                  {t('multichain.cannotDetermineParams')}
                </ErrorMessage>
              ) : isUnsupportedSafeCreationVersion ? (
                <ErrorMessage>{t('multichain.outdatedMastercopy')}</ErrorMessage>
              ) : noChainsAvailable ? (
                <ErrorMessage level="error">{t('multichain.cannotReplayOnAnyChain')}</ErrorMessage>
              ) : (
                <>
                  {!chain && (
                    <NetworkInput
                      required
                      name="chainId"
                      chainConfigs={(replayableChains as (ChainInfo & { available: boolean })[]) ?? []}
                    />
                  )}
                </>
              )}

              {creationError && (
                <ErrorMessage error={creationError} level="error">
                  {t('multichain.cannotCreateSameAddress')}
                </ErrorMessage>
              )}
            </Stack>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          {isUnsupportedSafeCreationVersion ? (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <ExternalLink sx={{ flexGrow: 1 }} href={MULTICHAIN_HELP_ARTICLE}>
                {t('settings.readMore')}
              </ExternalLink>
              <Button variant="contained" onClick={onClose}>
                {t('multichain.gotIt')}
              </Button>
            </Box>
          ) : (
            <>
              <Button onClick={onCancel}>{t('common.cancel')}</Button>
              <Button data-testid="modal-add-network-btn" type="submit" variant="contained" disabled={submitDisabled}>
                {isSubmitting ? <CircularProgress size={20} /> : t('multichain.addNetwork')}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </ModalDialog>
  )
}

export const CreateSafeOnNewChain = ({
  safeAddress,
  deployedChainIds,
  ...props
}: Omit<
  ReplaySafeDialogProps,
  'safeCreationResult' | 'replayableChains' | 'chain' | 'isUnsupportedSafeCreationVersion'
> & {
  deployedChainIds: string[]
}) => {
  const { configs } = useChains()
  const deployedChains = useMemo(
    () => configs.filter((config) => config.chainId === deployedChainIds[0]),
    [configs, deployedChainIds],
  )

  const safeCreationResult = useSafeCreationData(safeAddress, deployedChains)
  const allCompatibleChains = useCompatibleNetworks(safeCreationResult[0], configs as Chain[])
  const isUnsupportedSafeCreationVersion = Boolean(!allCompatibleChains?.length)
  const replayableChains = useMemo(
    () =>
      allCompatibleChains?.filter(
        (config) => !deployedChainIds.includes(config.chainId) && hasMultiChainAddNetworkFeature(config as ChainInfo),
      ) || [],
    [allCompatibleChains, deployedChainIds],
  )

  return (
    <ReplaySafeDialog
      safeCreationResult={safeCreationResult}
      replayableChains={replayableChains}
      safeAddress={safeAddress}
      isUnsupportedSafeCreationVersion={isUnsupportedSafeCreationVersion}
      {...props}
    />
  )
}

export const CreateSafeOnSpecificChain = ({ ...props }: Omit<ReplaySafeDialogProps, 'replayableChains'>) => {
  return <ReplaySafeDialog {...props} isUnsupportedSafeCreationVersion={false} />
}
