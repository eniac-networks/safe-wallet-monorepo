import { Typography, Card, SvgIcon, Button, Box, Stack, Link } from '@mui/material'
import css from './styles.module.css'
import StakeIcon from '@/public/images/common/stake.svg'
import classNames from 'classnames'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import useLocalStorage from '@/services/local-storage/useLocalStorage'
import ExternalLink from '@/components/common/ExternalLink'
import { AppRoutes } from '@/config/routes'
import useIsStakingBannerVisible from '@/components/dashboard/StakingBanner/useIsStakingBannerVisible'
import { useTranslation } from 'react-i18next'

const LEARN_MORE_LINK = 'https://help.safe.global/en/articles/222615-safe-staking'

const StakingBanner = ({
  hideLocalStorageKey = 'hideStakingBanner',
}: { large?: boolean; hideLocalStorageKey?: string } = {}) => {
  const { t } = useTranslation()
  const isDarkMode = useDarkMode()
  const router = useRouter()
  const isStakingBannerVisible = useIsStakingBannerVisible()

  const [_, setWidgetHidden] = useLocalStorage<boolean>(hideLocalStorageKey)

  if (!isStakingBannerVisible) return null

  const onClick = () => {
    trackEvent(OVERVIEW_EVENTS.OPEN_STAKING_WIDGET)
  }

  const onHide = () => {
    setWidgetHidden(true)
    trackEvent(OVERVIEW_EVENTS.HIDE_STAKING_BANNER)
  }

  const onLearnMore = () => {
    trackEvent(OVERVIEW_EVENTS.OPEN_LEARN_MORE_STAKING_BANNER)
  }

  return (
    <>
      <Card className={css.bannerWrapper}>
        {!isDarkMode && <Box className={classNames(css.gradientBackground)} />}

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'initial', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <SvgIcon component={StakeIcon} sx={{ width: '16px', height: '16px' }} inheritViewBox />

            <Typography variant="body2">
              <strong>{t('staking.bannerBold')}</strong> {t('staking.bannerText')}{' '}
              <NextLink
                href={{ pathname: AppRoutes.apps.index, query: { ...router.query, categories: ['Staking'] } }}
                passHref
                type="link"
              >
                <Link>{t('staking.exploreSafeApps')}</Link>
              </NextLink>{' '}
              {t('staking.bannerText2')}
              {LEARN_MORE_LINK && (
                <>
                  {' '}
                  <ExternalLink onClick={onLearnMore} href={LEARN_MORE_LINK}>
                    {t('staking.learnMore')}
                  </ExternalLink>
                </>
              )}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'center', md: 'flex-end' },
            }}
          >
            <Box>
              <Button variant="text" onClick={onHide} size="small" sx={{ whiteSpace: 'nowrap' }}>
                {t('staking.dontShowAgain')}
              </Button>
            </Box>
            <NextLink
              href={AppRoutes.stake && { pathname: AppRoutes.stake, query: { safe: router.query.safe } }}
              passHref
              rel="noreferrer"
              onClick={onClick}
              className={classNames(css.stakeButton)}
            >
              <Button fullWidth size="small" variant="contained">
                {t('staking.stake')}
              </Button>
            </NextLink>
          </Stack>
        </Stack>
      </Card>
    </>
  )
}

export default StakingBanner
