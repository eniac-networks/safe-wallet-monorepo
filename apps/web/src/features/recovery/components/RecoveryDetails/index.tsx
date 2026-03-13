import { useTranslation } from 'react-i18next'
import { Link } from '@mui/material'
import { useState } from 'react'
import { Operation } from '@safe-global/safe-gateway-typescript-sdk'
import type { ReactElement } from 'react'

import { dateString } from '@safe-global/utils/utils/formatters'
import { generateDataRowValue, TxDataRow } from '@/components/transactions/TxDetails/Summary/TxDataRow'
import { RecoverySigners } from '../RecoverySigners'
import { RecoveryDescription } from '../RecoveryDescription'
import type { RecoveryQueueItem } from '@/features/recovery/services/recovery-state'

import txDetailsCss from '@/components/transactions/TxDetails/styles.module.css'

export function RecoveryDetails({ item }: { item: RecoveryQueueItem }): ReactElement {
  const { t } = useTranslation()
  const { transactionHash, timestamp, validFrom, expiresAt, args, address } = item

  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <div className={txDetailsCss.container}>
      <div className={txDetailsCss.details}>
        <div className={txDetailsCss.txData}>
          <RecoveryDescription item={item} />
        </div>

        <div className={txDetailsCss.txSummary}>
          <TxDataRow title={t('recovery.txHash')}>{generateDataRowValue(transactionHash, 'hash', true)}</TxDataRow>
          <TxDataRow title={t('recovery.createdAt')}>{dateString(Number(timestamp))}</TxDataRow>
          <TxDataRow title={t('recovery.executable')}>{dateString(Number(validFrom))}</TxDataRow>

          {expiresAt !== null && <TxDataRow title={t('recovery.expires')}>{dateString(Number(expiresAt))}</TxDataRow>}

          <Link onClick={toggleExpanded} component="button" variant="body1">
            {t('recovery.advancedDetails')}
          </Link>

          {expanded && (
            <>
              <TxDataRow title={t('recovery.module')}>{generateDataRowValue(address, 'address', true)}</TxDataRow>
              <TxDataRow title={t('recovery.value')}>{args.value.toString()}</TxDataRow>
              <TxDataRow title={t('recovery.operation')}>{`${Number(args.operation)} (${Operation[
                Number(args.operation)
              ].toLowerCase()})`}</TxDataRow>
              <TxDataRow title={t('recovery.rawData')}>{generateDataRowValue(args.data, 'rawData')}</TxDataRow>
            </>
          )}
        </div>
      </div>

      <div className={txDetailsCss.txSigners}>
        <RecoverySigners item={item} />
      </div>
    </div>
  )
}
