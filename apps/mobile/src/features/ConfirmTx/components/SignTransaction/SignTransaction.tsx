import { LoadingScreen } from '@/src/components/LoadingScreen'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import SignError from './SignError'
import SignSuccess from './SignSuccess'
import { useSigningGuard } from './hooks/useSigningGuard'
import { useTransactionSigning } from './hooks/useTransactionSigning'
import { useAppSelector } from '@/src/store/hooks'
import { selectActiveSigner } from '@/src/store/activeSignerSlice'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { useTranslation } from 'react-i18next'

export function SignTransaction() {
  const { t } = useTranslation()
  const { txId } = useLocalSearchParams<{ txId: string }>()
  const activeSafe = useDefinedActiveSafe()
  const activeSigner = useAppSelector((state) => selectActiveSigner(state, activeSafe.address))
  const { canSign } = useSigningGuard()
  const { status, executeSign, retry, isApiLoading, isApiError } = useTransactionSigning({
    txId: txId || '',
    signerAddress: activeSigner?.value || '',
  })

  // Auto-sign when component mounts if user can sign
  useEffect(() => {
    if (canSign && status === 'idle' && txId && activeSigner) {
      executeSign()
    }
  }, [canSign, status, executeSign, txId, activeSigner])

  // Handle early returns after all hooks are called
  if (!txId) {
    const handleRetry = () => {
      console.error('Cannot retry: missing transaction ID')
    }
    return <SignError description={t('signTransaction.missingTxId')} onRetryPress={handleRetry} />
  }

  if (!activeSigner) {
    const handleRetry = () => {
      console.error('Cannot retry: no active signer')
    }
    return <SignError description={t('signTransaction.noSignerSelected')} onRetryPress={handleRetry} />
  }

  // Handle API errors
  if (isApiError) {
    return <SignError onRetryPress={retry} description={t('signTransaction.failedToSubmit')} />
  }

  // Handle signing errors
  if (status === 'error') {
    return <SignError onRetryPress={retry} description={t('signTransaction.errorSigning')} />
  }

  // Handle success
  if (status === 'success') {
    return <SignSuccess />
  }

  // Show loading state
  if (status === 'loading' || isApiLoading) {
    return <LoadingScreen title={t('signTransaction.signing')} description={t('signTransaction.takeFewSeconds')} />
  }

  // This should rarely be reached (idle state while authorized)
  return <LoadingScreen title={t('signTransaction.preparingToSign')} description={t('signTransaction.initializing')} />
}
