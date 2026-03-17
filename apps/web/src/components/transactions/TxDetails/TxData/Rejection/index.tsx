import ExternalLink from '@/components/common/ExternalLink'
import { NOT_AVAILABLE } from '@/components/transactions/TxDetails'
import type { MultisigExecutionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'

interface Props {
  nonce?: MultisigExecutionDetails['nonce']
  isTxExecuted: boolean
}

const RejectionTxInfo = ({ nonce, isTxExecuted }: Props) => {
  const { t } = useTranslation()
  const txNonce = nonce ?? NOT_AVAILABLE
  const message = isTxExecuted
    ? t('transactions.rejectionDidntSend', { nonce: txNonce })
    : t('transactions.rejectionWontSend', { nonce: txNonce })

  const title = t('transactions.whyPayToReject')

  return (
    <>
      <Typography data-testid="onchain-rejection" mr={2}>
        {message}
      </Typography>
      {!isTxExecuted && (
        <Box mt={2} sx={{ width: 'fit-content' }}>
          <ExternalLink href={HelpCenterArticle.CANCELLING_TRANSACTIONS} title={title}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Typography sx={{ textDecoration: 'underline' }}>{title}</Typography>
            </Box>
          </ExternalLink>
        </Box>
      )}
    </>
  )
}

export default RejectionTxInfo
