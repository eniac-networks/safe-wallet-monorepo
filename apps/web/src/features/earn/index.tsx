import { Stack } from '@mui/material'
import Disclaimer from '@/components/common/Disclaimer'
import WidgetDisclaimer from '@/components/common/WidgetDisclaimer'
import BlockedAddress from '@/components/common/BlockedAddress'
import useBlockedAddress from '@/hooks/useBlockedAddress'
import useConsent from '@/hooks/useConsent'
import { EARN_CONSENT_STORAGE_KEY } from '@/features/earn/constants'
import EarnView from '@/features/earn/components/EarnView'
import { useTranslation } from 'react-i18next'

const EarnPage = () => {
  const { t } = useTranslation()
  const { isConsentAccepted, onAccept } = useConsent(EARN_CONSENT_STORAGE_KEY)
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
        <BlockedAddress address={blockedAddress} featureTitle={t('earn.featureTitle')} />
      </Stack>
    )
  }

  if (isConsentAccepted === undefined) return null

  return (
    <>
      {isConsentAccepted ? (
        <EarnView />
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
            title={t('earn.note')}
            content={<WidgetDisclaimer widgetName={t('earn.widgetName')} />}
            onAccept={onAccept}
            buttonText={t('common.continue')}
          />
        </Stack>
      )}
    </>
  )
}

export default EarnPage
