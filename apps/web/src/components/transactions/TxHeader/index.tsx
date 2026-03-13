import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import PageHeader from '@/components/common/PageHeader'
import css from '@/components/common/PageHeader/styles.module.css'
import TxNavigation from '@/components/transactions/TxNavigation'

const TxHeader = ({ children }: { children?: ReactNode }): ReactElement => {
  const { t } = useTranslation()
  return (
    <PageHeader
      title={t('nav.transactions')}
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>
            <TxNavigation />
          </div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default TxHeader
