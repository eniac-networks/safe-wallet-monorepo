import dynamic from 'next/dynamic'

import { AppRoutes } from '@/config/routes'
import { FeatureWrapper } from '@/components/wrappers/FeatureWrapper'
import { SanctionWrapper } from '@/components/wrappers/SanctionWrapper'
import { DisclaimerWrapper } from '@/components/wrappers/DisclaimerWrapper'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { useTranslation } from 'react-i18next'

const LOCAL_STORAGE_CONSENT_KEY = 'bridgeConsent'

const BridgeWidget = dynamic(
  () => import('@/features/bridge/components/BridgeWidget').then((module) => module.BridgeWidget),
  {
    ssr: false,
  },
)

export function Bridge() {
  const { t } = useTranslation()
  return (
    <FeatureWrapper feature={FEATURES.BRIDGE} fallbackRoute={AppRoutes.home}>
      <SanctionWrapper featureTitle={t('bridge.featureTitle')}>
        <DisclaimerWrapper localStorageKey={LOCAL_STORAGE_CONSENT_KEY} widgetName={t('bridge.widgetName')}>
          <BridgeWidget />
        </DisclaimerWrapper>
      </SanctionWrapper>
    </FeatureWrapper>
  )
}
