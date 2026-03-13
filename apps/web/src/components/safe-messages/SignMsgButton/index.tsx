import type { MessageItem } from '@safe-global/store/gateway/AUTO_GENERATED/messages'
import { Button, Tooltip } from '@mui/material'
import { useContext } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

import useWallet from '@/hooks/wallets/useWallet'
import Track from '@/components/common/Track'
import { MESSAGE_EVENTS } from '@/services/analytics/events/txList'
import useIsSafeMessageSignableBy from '@/hooks/messages/useIsSafeMessageSignableBy'
import { TxModalContext } from '@/components/tx-flow'
import { SignMessageFlow } from '@/components/tx-flow/flows'
import CheckWallet from '@/components/common/CheckWallet'
import { useTranslation } from 'react-i18next'

const SignMsgButton = ({ msg, compact = false }: { msg: MessageItem; compact?: boolean }): ReactElement => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const isSignable = useIsSafeMessageSignableBy(msg, wallet?.address || '')
  const { setTxFlow } = useContext(TxModalContext)

  const onClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setTxFlow(<SignMessageFlow {...msg} origin={msg.origin || undefined} />)
  }

  return (
    <CheckWallet>
      {(isOk) => (
        <Tooltip title={isOk && !isSignable ? t('messages.alreadySigned') : ''}>
          <span>
            <Track {...MESSAGE_EVENTS.SIGN}>
              <Button
                onClick={onClick}
                variant={isSignable ? 'contained' : 'outlined'}
                disabled={!isOk || !isSignable}
                size={compact ? 'small' : 'stretched'}
                sx={compact ? { py: 0.8 } : undefined}
              >
                {t('messages.sign')}
              </Button>
            </Track>
          </span>
        </Tooltip>
      )}
    </CheckWallet>
  )
}

export default SignMsgButton
