import { useTranslation } from 'react-i18next'
import { Stack } from '@mui/material'
import Disclaimer from '@/components/common/Disclaimer'
import WidgetDisclaimer from '@/components/common/WidgetDisclaimer'
import StakingWidget from '../StakingWidget'
import { useRouter } from 'next/router'
import BlockedAddress from '@/components/common/BlockedAddress'
import useBlockedAddress from '@/hooks/useBlockedAddress'
import useConsent from '@/hooks/useConsent'
import { STAKE_CONSENT_STORAGE_KEY } from '@/features/stake/constants'

const StakePage = () => {
  const { t } = useTranslation()
  const { isConsentAccepted, onAccept } = useConsent(STAKE_CONSENT_STORAGE_KEY)
  const router = useRouter()
  const { asset } = router.query

  const blockedAddress = useBlockedAddress()

  if (blockedAddress) {
    return (
      <Stack
        direction="column"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <BlockedAddress address={blockedAddress} featureTitle={t('stake.featureTitle')} />
      </Stack>
    )
  }

  return (
    <>
      {isConsentAccepted === undefined ? null : isConsentAccepted ? (
        <StakingWidget asset={String(asset)} />
      ) : (
        <Stack
          direction="column"
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Disclaimer
            title={t('stake.note')}
            content={<WidgetDisclaimer widgetName={t('stake.widgetName')} />}
            onAccept={onAccept}
            buttonText={t('common.continue')}
          />
        </Stack>
      )}
    </>
  )
}

export default StakePage
