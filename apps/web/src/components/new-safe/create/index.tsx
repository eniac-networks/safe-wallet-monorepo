import { Container, Typography, Grid } from '@mui/material'
import { useRouter } from 'next/router'

import useWallet from '@/hooks/wallets/useWallet'
import OverviewWidget from '@/components/new-safe/create/OverviewWidget'
import type { NamedAddress } from '@/components/new-safe/create/types'
import type { TxStepperProps } from '@/components/new-safe/CardStepper/useCardStepper'
import SetNameStep from '@/components/new-safe/create/steps/SetNameStep'
import OwnerPolicyStep from '@/components/new-safe/create/steps/OwnerPolicyStep'
import ReviewStep from '@/components/new-safe/create/steps/ReviewStep'
import { CreateSafeStatus } from '@/components/new-safe/create/steps/StatusStep'
import { CardStepper } from '@/components/new-safe/CardStepper'
import { AppRoutes } from '@/config/routes'
import { CREATE_SAFE_CATEGORY } from '@/services/analytics'
import type { AlertColor } from '@mui/material'
import type { CreateSafeInfoItem } from '@/components/new-safe/create/CreateSafeInfos'
import CreateSafeInfos from '@/components/new-safe/create/CreateSafeInfos'
import { type ReactElement, useMemo, useState } from 'react'
import ExternalLink from '@/components/common/ExternalLink'
import { useTranslation } from 'react-i18next'
import { type SafeVersion } from '@safe-global/types-kit'
import { useCurrentChain } from '@/hooks/useChains'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { getLatestSafeVersion } from '@safe-global/utils/utils/chains'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'

export type NewSafeFormData = {
  name: string
  networks: ChainInfo[]
  threshold: number
  owners: NamedAddress[]
  saltNonce?: number
  safeVersion: SafeVersion
  safeAddress?: string
  willRelay?: boolean
  paymentReceiver?: string
}

const CreateSafe = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const wallet = useWallet()
  const chain = useCurrentChain()

  const staticHints: Record<
    number,
    { title: string; variant: AlertColor; steps: { title: string; text: string | ReactElement }[] }
  > = useMemo(
    () => ({
      1: {
        title: t('newSafe.hintCreationTitle'),
        variant: 'info',
        steps: [
          {
            title: t('newSafe.hintNetworkFeeTitle'),
            text: t('newSafe.hintNetworkFeeText'),
          },
          {
            title: t('newSafe.hintAddressBookTitle'),
            text: t('newSafe.hintAddressBookText'),
          },
        ],
      },
      2: {
        title: t('newSafe.hintCreationTitle'),
        variant: 'info',
        steps: [
          {
            title: t('newSafe.hintFlatHierarchyTitle'),
            text: t('newSafe.hintFlatHierarchyText'),
          },
          {
            title: t('newSafe.hintManageSignersTitle'),
            text: t('newSafe.hintManageSignersText'),
          },
          {
            title: t('newSafe.hintSafeSetupTitle'),
            text: (
              <>
                {t('newSafe.hintSafeSetupText')}
                <br />
                <ExternalLink href={HelpCenterArticle.SAFE_SETUP} fontWeight="bold">
                  {t('newSafe.hintSafeSetupLink')}
                </ExternalLink>
              </>
            ),
          },
        ],
      },
      3: {
        title: t('newSafe.hintCreationTitle'),
        variant: 'info',
        steps: [
          {
            title: t('newSafe.hintWaitTitle'),
            text: t('newSafe.hintWaitText'),
          },
        ],
      },
      4: {
        title: t('newSafe.hintUsageTitle'),
        variant: 'success',
        steps: [
          {
            title: t('newSafe.hintConnectTitle'),
            text: t('newSafe.hintConnectText'),
          },
        ],
      },
    }),
    [t],
  )

  const [safeName, setSafeName] = useState('')
  const [overviewNetworks, setOverviewNetworks] = useState<ChainInfo[]>()

  const [dynamicHint, setDynamicHint] = useState<CreateSafeInfoItem>()
  const [activeStep, setActiveStep] = useState(0)

  const CreateSafeSteps: TxStepperProps<NewSafeFormData>['steps'] = [
    {
      title: t('newSafe.step1Title'),
      subtitle: t('newSafe.step1Subtitle'),
      render: (data, onSubmit, onBack, setStep) => (
        <SetNameStep
          setOverviewNetworks={setOverviewNetworks}
          setDynamicHint={setDynamicHint}
          setSafeName={setSafeName}
          data={data}
          onSubmit={onSubmit}
          onBack={onBack}
          setStep={setStep}
        />
      ),
    },
    {
      title: t('newSafe.step2Title'),
      subtitle: t('newSafe.step2Subtitle'),
      render: (data, onSubmit, onBack, setStep) => (
        <OwnerPolicyStep
          setDynamicHint={setDynamicHint}
          data={data}
          onSubmit={onSubmit}
          onBack={onBack}
          setStep={setStep}
        />
      ),
    },
    {
      title: t('newSafe.step3Title'),
      subtitle: t('newSafe.step3Subtitle'),
      render: (data, onSubmit, onBack, setStep) => (
        <ReviewStep data={data} onSubmit={onSubmit} onBack={onBack} setStep={setStep} />
      ),
    },
    {
      title: '',
      subtitle: '',
      render: (data, onSubmit, onBack, setStep, setProgressColor, setStepData) => (
        <CreateSafeStatus
          data={data}
          onSubmit={onSubmit}
          onBack={onBack}
          setStep={setStep}
          setProgressColor={setProgressColor}
          setStepData={setStepData}
        />
      ),
    },
  ]

  const staticHint = useMemo(() => staticHints[activeStep], [activeStep, staticHints])

  const initialStep = 0
  const initialData: NewSafeFormData = {
    name: '',
    networks: [],
    owners: [],
    threshold: 1,
    safeVersion: getLatestSafeVersion(chain) as SafeVersion,
  }

  const onClose = () => {
    router.push(AppRoutes.welcome.index)
  }

  return (
    <Container>
      <Grid
        container
        columnSpacing={3}
        sx={{
          justifyContent: 'center',
          mt: [2, null, 7],
        }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h2"
            sx={{
              pb: 2,
            }}
          >
            {t('newSafe.createTitle')}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            order: [1, null, 0],
          }}
        >
          <CardStepper
            initialData={initialData}
            initialStep={initialStep}
            onClose={onClose}
            steps={CreateSafeSteps}
            eventCategory={CREATE_SAFE_CATEGORY}
            setWidgetStep={setActiveStep}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          sx={{
            mb: [3, null, 0],
            order: [0, null, 1],
          }}
        >
          <Grid container spacing={3}>
            {activeStep < 2 && <OverviewWidget safeName={safeName} networks={overviewNetworks || []} />}
            {wallet?.address && <CreateSafeInfos staticHint={staticHint} dynamicHint={dynamicHint} />}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CreateSafe
