import React, { useMemo } from 'react'
import { getTokenValue, ScrollView, View, Text, YStack } from 'tamagui'
import { useTransactionsGetTransactionByIdV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { ListTable } from '@/src/features/ConfirmTx/components/ListTable'
import { useLocalSearchParams } from 'expo-router'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { Alert } from '@/src/components/Alert'
import { LoadingTx } from '@/src/features/ConfirmTx/components/LoadingTx'
import { formatHistoryTxDetails } from './utils/formatHistoryTxDetails'
import { useTranslation } from 'react-i18next'

export function HistoryAdvancedDetailsContainer() {
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

  const sections = useMemo(() => formatHistoryTxDetails({ txDetails, t }), [txDetails, t])

  if (isError) {
    return (
      <View margin="$4">
        <Alert type="error" message={t('advancedDetails.errorFetchingDetails')} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ paddingTop: getTokenValue('$2'), paddingHorizontal: getTokenValue('$4') }}>
      {isFetching || !txDetails ? (
        <LoadingTx />
      ) : (
        <YStack gap="$4">
          {sections.map((section, index) => (
            <View key={index}>
              {section.title && (
                <Text fontWeight="600" fontSize="$5" marginBottom="$3">
                  {section.title}
                </Text>
              )}
              <ListTable items={section.items} />
            </View>
          ))}
        </YStack>
      )}
    </ScrollView>
  )
}
