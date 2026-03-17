import type { NextPage } from 'next'
import Head from 'next/head'

import Typography from '@mui/material/Typography'
import SingleMsg from '@/components/safe-messages/SingleMsg'
import { BRAND_NAME } from '@/config/constants'
import { useTranslation } from 'react-i18next'

const SingleTransaction: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} – ${t('transactions.messageDetails')}`}</title>
      </Head>

      <main>
        <Typography data-testid="tx-details" variant="h3" fontWeight={700} pt={1} mb={3}>
          {t('transactions.messageDetails')}
        </Typography>

        <SingleMsg />
      </main>
    </>
  )
}

export default SingleTransaction
