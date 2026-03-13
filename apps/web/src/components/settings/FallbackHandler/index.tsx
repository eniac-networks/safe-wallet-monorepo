import NextLink from 'next/link'
import { Typography, Box, Grid, Paper, Link } from '@mui/material'
import semverSatisfies from 'semver/functions/satisfies'
import type { ReactElement } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

import EthHashInfo from '@/components/common/EthHashInfo'
import useSafeInfo from '@/hooks/useSafeInfo'
import { BRAND_NAME } from '@/config/constants'
import ExternalLink from '@/components/common/ExternalLink'
import { useTxBuilderApp } from '@/hooks/safe-apps/useTxBuilderApp'
import { useCompatibilityFallbackHandlerDeployments } from '@/hooks/useCompatibilityFallbackHandlerDeployments'
import { useHasUntrustedFallbackHandler } from '@/hooks/useHasUntrustedFallbackHandler'
import css from '../TransactionGuards/styles.module.css'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'
import { useIsTWAPFallbackHandler } from '@/features/swap/hooks/useIsTWAPFallbackHandler'

const FALLBACK_HANDLER_VERSION = '>=1.1.1'

export const FallbackHandlerWarning = ({
  message,
  txBuilderLinkPrefix,
}: {
  message: ReactElement | string
  txBuilderLinkPrefix?: string
}) => {
  const { t } = useTranslation()
  const prefix = txBuilderLinkPrefix ?? t('settings.canBeAlteredVia')
  const txBuilder = useTxBuilderApp()
  return (
    <>
      {message}
      {!!txBuilder && !!prefix && (
        <>
          {` ${prefix} `}
          <NextLink href={txBuilder.link} passHref legacyBehavior>
            <Link>{t('settings.transactionBuilder')}</Link>
          </NextLink>
          .
        </>
      )}
    </>
  )
}

export const FallbackHandler = (): ReactElement | null => {
  const { t } = useTranslation()
  const { safe } = useSafeInfo()
  const fallbackHandlerDeployments = useCompatibilityFallbackHandlerDeployments()
  const isTWAPFallbackHandler = useIsTWAPFallbackHandler()
  const isUntrusted = useHasUntrustedFallbackHandler()

  const supportsFallbackHandler = !!safe.version && semverSatisfies(safe.version, FALLBACK_HANDLER_VERSION)

  if (!supportsFallbackHandler) {
    return null
  }

  const hasFallbackHandler = !!safe.fallbackHandler

  const warning = !hasFallbackHandler ? (
    <FallbackHandlerWarning
      message={t('settings.noFallbackHandlerSet', { brandName: BRAND_NAME })}
      txBuilderLinkPrefix={t('settings.canBeSetVia')}
    />
  ) : isTWAPFallbackHandler ? (
    <>{t('settings.twapFallbackHandler')}</>
  ) : isUntrusted ? (
    <FallbackHandlerWarning message={t('settings.unofficialFallbackHandler')} />
  ) : undefined

  return (
    <Paper sx={{ padding: 4 }}>
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Grid item lg={4} xs={12}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            {t('settings.fallbackHandler')}
          </Typography>
        </Grid>

        <Grid item xs>
          <Box>
            <Typography>
              {t('settings.fallbackHandlerDescription')}{' '}
              <ExternalLink href={HelpCenterArticle.FALLBACK_HANDLER}>{t('settings.here')}</ExternalLink>
            </Typography>

            <Box
              className={classnames(css.guardDisplay, {
                [css.warning]: !hasFallbackHandler,
                [css.info]: hasFallbackHandler && isUntrusted,
              })}
              sx={{ display: 'block !important' }}
            >
              {warning && (
                <Typography variant="body2" width="100%" mb={hasFallbackHandler ? 1 : 0}>
                  {warning}
                </Typography>
              )}

              {safe.fallbackHandler && (
                <EthHashInfo
                  shortAddress={false}
                  name={safe.fallbackHandler.name || fallbackHandlerDeployments?.contractName}
                  address={safe.fallbackHandler.value}
                  customAvatar={safe.fallbackHandler.logoUri || undefined}
                  showCopyButton
                  hasExplorer
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
