import { Card, CardContent, CardHeader, cardHeaderClasses, Stack, SvgIcon, Typography } from '@mui/material'
import { type TransactionData } from '@safe-global/safe-gateway-typescript-sdk'

import { Divider } from '@/components/tx/ColorCodedTxAccordion'

import NestedTransactionIcon from '@/public/images/transactions/nestedTx.svg'
import { type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import MethodCall from '../DecodedData/MethodCall'
import { MethodDetails } from '../DecodedData/MethodDetails'
import ExternalLink from '@/components/common/ExternalLink'
import Track from '@/components/common/Track'
import Link from 'next/link'
import { MODALS_EVENTS } from '@/services/analytics'
import { AppRoutes } from '@/config/routes'
import { useSignedHash } from './useSignedHash'
import { useCurrentChain } from '@/hooks/useChains'

export const NestedTransaction = ({
  txData,
  children,
  isConfirmationView = false,
}: {
  txData: TransactionData | undefined
  children: ReactElement
  isConfirmationView?: boolean
}) => {
  const { t } = useTranslation()
  const chain = useCurrentChain()
  const signedHash = useSignedHash(txData)
  return (
    <Stack spacing={2}>
      {!isConfirmationView && txData?.dataDecoded && (
        <>
          <MethodCall contractAddress={txData.to.value} method={txData.dataDecoded.method} />
          <MethodDetails data={txData.dataDecoded} addressInfoIndex={txData.addressInfoIndex} />
          <Divider />
        </>
      )}

      <Card variant="outlined" sx={{ backgroundColor: 'background.main' }}>
        <CardHeader
          sx={{
            borderBottom: '1px solid',
            borderColor: 'border.light',
            [`& .${cardHeaderClasses.action}`]: {
              marginTop: 0,
              marginBottom: 0,
              marginRight: 0,
            },
          }}
          avatar={<SvgIcon component={NestedTransactionIcon} inheritViewBox fontSize="small" />}
          action={
            chain &&
            txData &&
            signedHash && (
              <Track {...MODALS_EVENTS.OPEN_NESTED_TX}>
                <Link
                  href={{
                    pathname: AppRoutes.transactions.tx,
                    query: {
                      safe: `${chain?.shortName}:${txData.to.value}`,
                      id: signedHash,
                    },
                  }}
                  passHref
                  legacyBehavior
                >
                  <ExternalLink color="text.secondary">
                    <Typography variant="body2" fontWeight={700}>
                      {t('transactions.open')}
                    </Typography>
                  </ExternalLink>
                </Link>
              </Track>
            )
          }
          title={<Typography variant="h5">{t('transactions.nestedTransaction')}</Typography>}
        />
        <CardContent>
          <Stack spacing={4}>{children}</Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
