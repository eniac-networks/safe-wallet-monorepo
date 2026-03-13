import { IconName } from '@/src/types/iconTypes'
import { AlertType } from '@/src/components/Alert'
import { TFunction } from 'i18next'

export interface SecurityState {
  enabled: boolean
  isScanning: boolean
  hasError: boolean
  payload: unknown
  error: Error | undefined
  isHighRisk: boolean
  isMediumRisk: boolean
  hasWarnings: boolean
  hasIssues: boolean
  hasContractManagement: boolean
}

export const getTransactionChecksIcon = (security: SecurityState): IconName => {
  if (security.hasError) {
    return 'shield-crossed'
  }
  if (security.isMediumRisk || security.hasContractManagement) {
    return 'alert-triangle'
  }
  return 'shield'
}

export const getTransactionChecksLabel = (isScanning: boolean, t: TFunction): string => {
  if (isScanning) {
    return t('transactionChecks.checkingTransaction')
  }
  return t('transactionChecks.title')
}

export const getAlertType = (security: SecurityState): AlertType => {
  if (security.isHighRisk) {
    return 'error'
  }
  if (security.isMediumRisk) {
    return 'warning'
  }
  return 'info'
}

export const shouldShowBottomContent = (security: SecurityState): boolean => {
  if (!security.enabled) {
    return false
  }
  return security.hasIssues || security.hasContractManagement || !!security.error
}
