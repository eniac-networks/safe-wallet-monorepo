import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, type ButtonProps } from '@mui/material'

import { useTxBuilderApp } from '@/hooks/safe-apps/useTxBuilderApp'
import { AppRoutes } from '@/config/routes'
import Track from '@/components/common/Track'
import { MODALS_EVENTS } from '@/services/analytics'
import { useContext } from 'react'
import { TxModalContext } from '..'
import SwapIcon from '@/public/images/common/swap.svg'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import useIsSwapFeatureEnabled from '@/features/swap/hooks/useIsSwapFeatureEnabled'
import { useTranslation } from 'react-i18next'

const buttonSx = {
  height: '58px',
  '& svg path': { fill: 'currentColor' },
}

export const SendTokensButton = ({ onClick, sx }: { onClick: () => void; sx?: ButtonProps['sx'] }) => {
  const { t } = useTranslation()
  return (
    <Track {...MODALS_EVENTS.SEND_FUNDS}>
      <Button
        data-testid="send-tokens-btn"
        onClick={onClick}
        variant="contained"
        sx={sx ?? buttonSx}
        fullWidth
        startIcon={<AssetsIcon width={20} />}
      >
        {t('sidebar.sendTokens')}
      </Button>
    </Track>
  )
}

export const TxBuilderButton = () => {
  const { t } = useTranslation()
  const txBuilder = useTxBuilderApp()
  const router = useRouter()
  const { setTxFlow } = useContext(TxModalContext)

  if (!txBuilder?.app) return null

  const isTxBuilder = typeof txBuilder.link.query === 'object' && router.query.appUrl === txBuilder.link.query?.appUrl
  const onClick = isTxBuilder ? () => setTxFlow(undefined) : undefined

  return (
    <Track {...MODALS_EVENTS.CONTRACT_INTERACTION}>
      <Link href={txBuilder.link} passHref style={{ width: '100%' }}>
        <Button
          variant="outlined"
          sx={buttonSx}
          fullWidth
          onClick={onClick}
          startIcon={<img src={txBuilder.app.iconUrl} height={24} width="auto" alt={txBuilder.app.name} />}
        >
          {t('sidebar.transactionBuilder')}
        </Button>
      </Link>
    </Track>
  )
}

export const MakeASwapButton = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { setTxFlow } = useContext(TxModalContext)
  const isSwapFeatureEnabled = useIsSwapFeatureEnabled()
  if (!isSwapFeatureEnabled) return null

  const isSwapPage = router.pathname === AppRoutes.swap
  const onClick = isSwapPage ? () => setTxFlow(undefined) : undefined

  return (
    <Track {...MODALS_EVENTS.SWAP}>
      <Link href={{ pathname: AppRoutes.swap, query: { safe: router.query.safe } }} passHref legacyBehavior>
        <Button variant="contained" sx={buttonSx} fullWidth onClick={onClick} startIcon={<SwapIcon width={20} />}>
          {t('sidebar.swapTokens')}
        </Button>
      </Link>
    </Track>
  )
}
