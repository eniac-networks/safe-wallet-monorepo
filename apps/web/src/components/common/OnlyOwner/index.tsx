import { useMemo, type ReactElement } from 'react'
import useIsSafeOwner from '@/hooks/useIsSafeOwner'
import useWallet from '@/hooks/wallets/useWallet'
import useConnectWallet from '../ConnectWallet/useConnectWallet'
import { Tooltip, type TooltipProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

type CheckWalletProps = {
  children: (ok: boolean) => ReactElement
  placement?: TooltipProps['placement']
}

const OnlyOwner = ({ children, placement = 'bottom' }: CheckWalletProps): ReactElement => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const isSafeOwner = useIsSafeOwner()
  const connectWallet = useConnectWallet()

  const message = useMemo(() => {
    if (!wallet) {
      return t('common.connectYourWallet')
    }

    if (!isSafeOwner) {
      return t('common.notSafeOwner')
    }
  }, [isSafeOwner, wallet, t])

  if (!message) return children(true)

  return (
    <Tooltip title={message} placement={placement}>
      <span onClick={wallet ? undefined : connectWallet}>{children(false)}</span>
    </Tooltip>
  )
}

export default OnlyOwner
