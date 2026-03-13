import type { ReactElement } from 'react'
import type { Label } from '@safe-global/safe-gateway-typescript-sdk'
import { LabelValue } from '@safe-global/safe-gateway-typescript-sdk'
import css from './styles.module.css'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useTranslation } from 'react-i18next'

const GroupLabel = ({ item }: { item: Label }): ReactElement => {
  const { t } = useTranslation()
  const { safe } = useSafeInfo()

  const label =
    item.label === LabelValue.Queued
      ? t('transactions.queuedWithNonce', { label: item.label, nonce: safe.nonce })
      : item.label

  return <div className={css.container}>{label}</div>
}

export default GroupLabel
