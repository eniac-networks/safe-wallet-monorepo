import type { ReactElement, ReactNode } from 'react'
import { Button } from '@mui/material'
import useSafeInfo from '@/hooks/useSafeInfo'
import PagePlaceholder from '../PagePlaceholder'
import { AppRoutes } from '@/config/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const SafeLoadingError = ({ children }: { children: ReactNode }): ReactElement => {
  const { t } = useTranslation()
  const { safeError } = useSafeInfo()

  if (!safeError) return <>{children}</>

  return (
    <PagePlaceholder
      img={<img src="/images/common/error.png" alt={t('common.safeLoadErrorImgAlt')} />}
      text={t('common.safeLoadError')}
    >
      <Link href={AppRoutes.welcome.index} passHref legacyBehavior>
        <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          {t('common.goToMainPage')}
        </Button>
      </Link>
    </PagePlaceholder>
  )
}

export default SafeLoadingError
