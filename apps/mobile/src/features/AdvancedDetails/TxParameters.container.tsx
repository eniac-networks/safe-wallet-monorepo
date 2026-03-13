import React, { useMemo } from 'react'
import { View, ScrollView } from 'tamagui'
import { useTransactionsGetTransactionByIdV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { ListTable } from '@/src/features/ConfirmTx/components/ListTable'
import { useLocalSearchParams } from 'expo-router'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { Alert } from '@/src/components/Alert'
import { LoadingTx } from '../ConfirmTx/components/LoadingTx'
import { formatParameters } from './utils/formatParameters'
import { useTranslation } from 'react-i18next'

export function TxParametersContainer() {
  const activeSafe = useDefinedActiveSafe()
  const { txId } = useLocalSearchParams<{ txId: string }>()
  const { t } = useTranslation()

  const {
    data: txDetails,
    isFetching,
    isError,
  } = useTransactionsGetTransactionByIdV1Query({
    chainId: activeSafe.chainId,
    id: txId,
  })

  const parameters = useMemo(() => formatParameters({ txData: txDetails?.txData, t }), [txDetails?.txData, t])

  if (isError) {
    return (
      <View margin="$4">
        <Alert type="error" message={t('advancedDetails.errorFetchingDetails')} />
      </View>
    )
  }

  return (
    <ScrollView marginTop="$2">
      {isFetching || !txDetails ? <LoadingTx /> : <ListTable items={parameters} />}
    </ScrollView>
  )
}
