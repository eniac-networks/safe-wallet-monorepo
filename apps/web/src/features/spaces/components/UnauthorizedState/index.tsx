import { Box, Typography } from ‘@mui/material’
import css from ‘@/features/spaces/components/Dashboard/styles.module.css’
import Button from ‘@mui/material/Button’
import Link from ‘next/link’
import { AppRoutes } from ‘@/config/routes’
import { useTranslation } from ‘react-i18next’

const UnauthorizedState = () => {
  const { t } = useTranslation()
  return (
    <Box className={css.content}>
      <Box textAlign="center" className={css.contentWrapper}>
        <Box className={css.contentInner}>
          <Typography fontWeight={700} mb={2}>
            {t(‘spaces.noPermissionsTitle’)}
          </Typography>

          <Typography color="text.secondary" mb={2}>
            {t(‘spaces.noPermissionsDescription’)}
          </Typography>

          <Link href={AppRoutes.welcome.spaces} passHref>
            <Button variant="outlined">{t(‘spaces.backToOverview’)}</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default UnauthorizedState
