import type { ReactElement, ReactNode } from 'react'
import { SvgIcon, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import Link from 'next/link'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
import ExternalLink from '../ExternalLink'
import MUILink from '@mui/material/Link'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { HELP_CENTER_URL } from '@safe-global/utils/config/constants'
import { useTranslation } from 'react-i18next'

const footerPages = [
  AppRoutes.welcome.index,
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.cookie,
  AppRoutes.terms,
  AppRoutes.licenses,
]

const FooterLink = ({ children, href }: { children: ReactNode; href: string }): ReactElement => {
  return href ? (
    <Link href={href} passHref legacyBehavior>
      <MUILink>{children}</MUILink>
    </Link>
  ) : (
    <MUILink>{children}</MUILink>
  )
}

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const isOfficialHost = useIsOfficialHost()
  const { t } = useTranslation()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  const getHref = (path: string): string => {
    return router.pathname === path ? '' : path
  }

  return (
    <footer className={css.container}>
      <ul>
        {isOfficialHost ? (
          <>
            <li>
              <Typography variant="caption">{t('footer.copyright', { year: new Date().getFullYear() })}</Typography>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.terms)}>{t('footer.terms')}</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.privacy)}>{t('footer.privacy')}</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.licenses)}>{t('footer.licenses')}</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.imprint)}>{t('footer.imprint')}</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.cookie)}>{t('footer.cookiePolicy')}</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.settings.index)}>{t('footer.preferences')}</FooterLink>
            </li>
            <li>
              <ExternalLink href={HELP_CENTER_URL} noIcon sx={{ span: { textDecoration: 'underline' } }}>
                {t('footer.help')}
              </ExternalLink>
            </li>
          </>
        ) : (
          <li>{t('footer.unofficialDistribution')}</li>
        )}

        <li>
          <ExternalLink href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`} noIcon>
            <SvgIcon component={GitHubIcon} inheritViewBox fontSize="inherit" sx={{ mr: 0.5 }} /> v{packageJson.version}
          </ExternalLink>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
