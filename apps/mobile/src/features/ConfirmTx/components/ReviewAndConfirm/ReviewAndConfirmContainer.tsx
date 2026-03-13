import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Loader } from '@/src/components/Loader'
import { Text, View } from 'tamagui'
import { ReviewAndConfirmView } from './ReviewAndConfirmView'
import { useTransactionData } from '../../hooks/useTransactionData'
import { useTranslation } from 'react-i18next'

export function ReviewAndConfirmContainer() {
  const { txId } = useLocalSearchParams<{ txId: string }>()
  const { t } = useTranslation()

  const { data: txDetails, isFetching: isLoading, isError } = useTransactionData(txId || '')

  if (!txId) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>{t('signTransaction.missingTxId')}</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Loader />
      </View>
    )
  }

  if (isError || !txDetails) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>{t('confirmTx.errorLoadingTxDetails')}</Text>
      </View>
    )
  }

  return <ReviewAndConfirmView txDetails={txDetails} txId={txId} />
}
