import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactElement } from 'react'
import { useCurrentChain } from '@/hooks/useChains'

import NavTabs from '@/components/common/NavTabs'
import { safeAppsNavItems } from '@/components/sidebar/SidebarNavigation/config'
import css from './styles.module.css'
import { useTranslation } from 'react-i18next'

const SafeAppsHeader = (): ReactElement => {
  const { t } = useTranslation()
  const chain = useCurrentChain()
  return (
    <>
      <Box className={css.container}>
        {/* Safe Apps Title */}
        <Typography className={css.title} variant="h3">
          {t('safeApps.exploreEcosystem', { chainName: chain?.chainName })}
        </Typography>

        {/* Safe Apps Subtitle */}
        <Typography className={css.subtitle}>{t('safeApps.connectToApps')}</Typography>
      </Box>

      {/* Safe Apps Tabs */}
      <Box className={css.tabs}>
        <NavTabs tabs={safeAppsNavItems} />
      </Box>
    </>
  )
}

export default SafeAppsHeader
