import { Card, Box, Grid2 as Grid, Typography, Button, SvgIcon, Stack, Tooltip } from '@mui/material'
import Image from 'next/image'
import EarnIllustrationLight from '@/public/images/common/earn-illustration-light.png'

import CheckIcon from '@/public/images/common/check.svg'
import StarIcon from '@/public/images/common/star.svg'
import EyeIcon from '@/public/images/common/eye.svg'
import FiatIcon from '@/public/images/common/fiat.svg'
import Track from '@/components/common/Track'
import useBalances from '@/hooks/useBalances'
import { EligibleEarnTokens, VaultAPYs } from '@/features/earn/constants'
import useChainId from '@/hooks/useChainId'
import TokenIcon from '@/components/common/TokenIcon'
import TokenAmount from '@/components/common/TokenAmount'
import FiatValue from '@/components/common/FiatValue'
import { formatPercentage } from '@safe-global/utils/utils/formatters'
import css from './styles.module.css'
import Kiln from '@/public/images/common/kiln-symbol.svg'
import Morpho from '@/public/images/common/morpho-symbol.svg'
import Cross from '@/public/images/common/cross.svg'
import classNames from 'classnames'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import { trackEvent } from '@/services/analytics'
import { EARN_EVENTS, EARN_LABELS } from '@/services/analytics/events/earn'
import ExternalLink from '@/components/common/ExternalLink'
import { EARN_HELP_ARTICLE, ApproximateAPY } from '@/features/earn/constants'
import { useTranslation } from 'react-i18next'

export const EarnPoweredBy = () => {
  const { t } = useTranslation()
  const isDarkMode = useDarkMode()

  return (
    <Stack spacing={1} direction="row">
      <Typography variant="overline" color="text.secondary" fontWeight="bold">
        {t('earn.poweredBy')}
      </Typography>
      <SvgIcon
        component={Morpho}
        inheritViewBox
        color="border"
        className={classNames(css.morphoIcon, { [css.kilnIconDarkMode]: isDarkMode })}
      />
      <SvgIcon
        component={Cross}
        inheritViewBox
        color="border"
        sx={{ width: 12, height: 12 }}
        className={classNames({ [css.kilnIconDarkMode]: isDarkMode })}
      />
      <SvgIcon
        component={Kiln}
        inheritViewBox
        color="border"
        className={classNames(css.kilnIcon, { [css.kilnIconDarkMode]: isDarkMode })}
      />
    </Stack>
  )
}

export const EarnBannerCopy = () => {
  const { t } = useTranslation()
  const isDarkMode = useDarkMode()

  return (
    <>
      <Typography variant="h2" className={classNames(css.header, { [css.gradientText]: isDarkMode })}>
        {t('earn.earnUpTo')}{' '}
        <Typography className={classNames({ [css.gradientText]: isDarkMode })} variant="h2" component="span">
          {formatPercentage(ApproximateAPY)} {t('earn.apyStar')}
        </Typography>{' '}
        {t('earn.getMorphoRewards')}
      </Typography>

      <Typography variant="body1" className={css.content} mt={2}>
        {t('earn.depositDescription')}{' '}
        <Track {...EARN_EVENTS.OPEN_EARN_LEARN_MORE} label={EARN_LABELS.safe_dashboard_banner}>
          <ExternalLink href={EARN_HELP_ARTICLE}>{t('earn.learnMore')}</ExternalLink>
        </Track>
      </Typography>
    </>
  )
}

const EarnInfo = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const { t } = useTranslation()
  const { balances } = useBalances()
  const chainId = useChainId()
  const router = useRouter()

  const eligibleAssets = balances.items.filter((token) => EligibleEarnTokens[chainId].includes(token.tokenInfo.address))

  return (
    <Box m={3}>
      <Card sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid container size={{ xs: 12, md: 7 }} rowSpacing={3}>
            <Grid size={{ xs: 12 }} zIndex={2}>
              <EarnPoweredBy />
            </Grid>

            <Grid size={{ xs: 12 }} zIndex={2} maxWidth={600}>
              <EarnBannerCopy />
            </Grid>

            <Grid container size={{ xs: 12 }} textAlign="center" spacing={2}>
              <Grid size={{ xs: 12, md: 'auto' }}>
                <Track {...EARN_EVENTS.GET_STARTED_WITH_EARN}>
                  <Button fullWidth variant="contained" onClick={onGetStarted}>
                    {t('earn.getStarted')}
                  </Button>
                </Track>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            size={{ xs: 12, md: 5 }}
            display={{ xs: 'none', sm: 'flex' }}
            position="relative"
            sx={{ backgroundColor: 'background.main', alignItems: 'center', justifyContent: 'center' }}
          >
            <Image src={EarnIllustrationLight} alt={t('earn.earnIllustration')} width={239} height={239} />
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 'grow' }}>
          <Typography variant="h3" mt={3} mb={2} fontWeight="bold">
            {t('earn.yourBenefits')}
          </Typography>
          <Card sx={{ p: 4 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Box className={css.benefitIcon}>
                  <SvgIcon component={CheckIcon} color="success" inheritViewBox fontSize="small" />
                </Box>
                <Box>
                  <Typography fontWeight="bold" mb={0.5}>
                    {t('earn.benefit1Title')}
                  </Typography>
                  <Typography>{t('earn.benefit1Description')}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} className={css.benefit}>
                <Box className={css.benefitIcon}>
                  <SvgIcon component={StarIcon} color="success" inheritViewBox fontSize="small" />
                </Box>
                <Box>
                  <Typography fontWeight="bold" mb={0.5}>
                    {t('earn.benefit2Title')}
                  </Typography>
                  <Typography>{t('earn.benefit2Description')}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} className={css.benefit}>
                <Box className={css.benefitIcon}>
                  <SvgIcon component={EyeIcon} color="success" inheritViewBox fontSize="small" />
                </Box>
                <Box>
                  <Typography fontWeight="bold" mb={0.5}>
                    {t('earn.benefit3Title')}
                  </Typography>
                  <Typography>{t('earn.benefit3Description')}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} className={css.benefit}>
                <Box className={css.benefitIcon}>
                  <SvgIcon component={FiatIcon} color="success" inheritViewBox fontSize="small" />
                </Box>
                <Box>
                  <Typography fontWeight="bold" mb={0.5}>
                    {t('earn.benefit4Title')}
                  </Typography>
                  <Typography>{t('earn.benefit4Description')}</Typography>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {eligibleAssets.length > 0 && (
          <Grid size={{ xs: 12, md: 'grow' }}>
            <Typography variant="h3" mt={3} mb={2} fontWeight="bold">
              {t('earn.eligibleAssets')}
            </Typography>

            <Stack spacing={2}>
              {eligibleAssets.map((asset) => {
                const vaultAPY = formatPercentage(VaultAPYs[chainId][asset.tokenInfo.address] / 100)

                const onEarnClick = () => {
                  onGetStarted()

                  trackEvent({ ...EARN_EVENTS.OPEN_EARN_PAGE, label: EARN_LABELS.info_asset })

                  router.push({
                    pathname: AppRoutes.earn,
                    query: {
                      ...router.query,
                      asset_id: `${chainId}_${asset.tokenInfo.address}`,
                    },
                  })
                }

                return (
                  <Card key={asset.tokenInfo.address} sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <TokenIcon logoUri={asset.tokenInfo.logoUri} tokenSymbol={asset.tokenInfo.symbol} size={32} />
                        <Box>
                          <Typography variant="body2">
                            <TokenAmount
                              value={asset.balance}
                              decimals={asset.tokenInfo.decimals}
                              tokenSymbol={asset.tokenInfo.symbol}
                              logoUri={undefined}
                            />
                          </Typography>
                          <Typography variant="body2">
                            <FiatValue value={asset.fiatBalance} />
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Tooltip title={t('earn.apyAsOf')}>
                          <Typography variant="caption" className={css.apy}>
                            {t('earn.upTo')} {vaultAPY}*
                          </Typography>
                        </Tooltip>

                        <Button variant="outlined" size="small" onClick={onEarnClick}>
                          {t('earn.earn')}
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
                )
              })}
            </Stack>
          </Grid>
        )}
      </Grid>

      <Typography component="div" variant="caption" zIndex={2} mt={2}>
        {t('earn.apyDisclaimer')}
      </Typography>
    </Box>
  )
}

export default EarnInfo
