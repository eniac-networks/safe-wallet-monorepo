import { useCurrentChain, useHasFeature } from '@/hooks/useChains'
import { type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TxSimulation, TxSimulationMessage } from '@/components/tx/security/tenderly'
import TxCard from '@/components/tx-flow/common/TxCard'
import { Box, Typography } from '@mui/material'

import type { SafeTransaction, MetaTransactionData } from '@safe-global/types-kit'

import css from './styles.module.css'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { isTxSimulationEnabled } from '@safe-global/utils/components/tx/security/tenderly/utils'

const TxChecks = ({
  executionOwner,
  disabled = false,
  transaction,
}: {
  executionOwner?: string
  disabled?: boolean
  transaction: SafeTransaction | Array<MetaTransactionData>
}): ReactElement | null => {
  const { t } = useTranslation()
  const chain = useCurrentChain()
  const isRiskMitigationFeatureEnabled = useHasFeature(FEATURES.RISK_MITIGATION)
  const isTxSimulationFeatureEnabled = isTxSimulationEnabled(chain)

  return (
    <TxCard>
      <Typography variant="h5">{t('transactions.transactionChecks')}</Typography>

      {(isTxSimulationFeatureEnabled || isRiskMitigationFeatureEnabled) && (
        <>
          <TxSimulation disabled={disabled} transactions={transaction} executionOwner={executionOwner} />

          <Box className={css.mobileTxCheckMessages}>
            <TxSimulationMessage />
          </Box>
        </>
      )}
    </TxCard>
  )
}

export default TxChecks
