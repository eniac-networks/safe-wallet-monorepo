import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorMessage from '../ErrorMessage'
import { TxSecurityContext } from '../security/shared/TxSecurityContext'

const RiskConfirmationError = () => {
  const { t } = useTranslation()
  const { isRiskConfirmed, isRiskIgnored } = useContext(TxSecurityContext)

  if (isRiskConfirmed || !isRiskIgnored) {
    return null
  }

  return <ErrorMessage level="warning">{t('transactions.acknowledgeRisk')}</ErrorMessage>
}

export default RiskConfirmationError
