import { AppRoutes } from '@/config/routes'
import type { NextPage } from 'next'
import Link from 'next/link'
import MUILink from '@mui/material/Link'
import { useTranslation } from 'react-i18next'

const Custom403: NextPage = () => {
  const { t } = useTranslation()

  const termsLink = (
    <Link href={AppRoutes.terms} passHref legacyBehavior>
      <MUILink target="_blank" rel="noreferrer">
        {t('errors.terms')}
      </MUILink>
    </Link>
  )

  return (
    <main>
      <h1>{t('errors.accessRestricted')}</h1>
      <p>
        {t('errors.accessRestrictedDescription', { terms: termsLink })}
      </p>
    </main>
  )
}

export default Custom403
