import { useContext } from 'react'
import type { TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ArrowIconNW from '@/public/images/common/arrow-top-right.svg'
import CheckWallet from '@/components/common/CheckWallet'
import useSpendingLimit from '@/hooks/useSpendingLimit'
import Track from '@/components/common/Track'
import { ASSETS_EVENTS } from '@/services/analytics/events/assets'
import { TokenTransferFlow } from '@/components/tx-flow/flows'
import { TxModalContext } from '@/components/tx-flow'

const SendButton = ({ tokenInfo, light }: { tokenInfo: TokenInfo; light?: boolean }) => {
  const { t } = useTranslation()
  const spendingLimit = useSpendingLimit(tokenInfo)
  const { setTxFlow } = useContext(TxModalContext)

  const onSendClick = () => {
    setTxFlow(<TokenTransferFlow recipients={[{ tokenAddress: tokenInfo.address }]} />)
  }

  return (
    <CheckWallet allowSpendingLimit={!!spendingLimit}>
      {(isOk) => (
        <Track {...ASSETS_EVENTS.SEND}>
          <Button
            data-testid="send-button"
            variant="contained"
            color={light ? 'background.paper' : 'primary'}
            size="compact"
            startIcon={<ArrowIconNW />}
            onClick={onSendClick}
            disabled={!isOk}
            sx={{ height: 32, px: 2 }}
          >
            {t('transactions.send')}
          </Button>
        </Track>
      )}
    </CheckWallet>
  )
}

export default SendButton
