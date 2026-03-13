import type { ReactElement } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { shortenAddress } from '@safe-global/utils/utils/formatters'
import { useRouter } from 'next/router'
import Disclaimer from '@/components/common/Disclaimer'
import { AppRoutes } from '@/config/routes'
import { useTranslation } from 'react-i18next'

export const BlockedAddress = ({
  address,
  featureTitle,
  onClose,
}: {
  address: string
  featureTitle: string
  onClose?: () => void
}): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const displayAddress = address && isMobile ? shortenAddress(address) : address
  const router = useRouter()

  const handleAccept = () => {
    router.push({ pathname: AppRoutes.home, query: router.query })
  }

  return (
    <Disclaimer
      title={t('blockedAddress.title')}
      subtitle={displayAddress}
      content={t('blockedAddress.content', { featureTitle })}
      onAccept={onClose ?? handleAccept}
    />
  )
}

export default BlockedAddress
