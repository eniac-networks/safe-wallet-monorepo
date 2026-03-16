import { useTranslation } from 'react-i18next'
import CheckWallet from '@/components/common/CheckWallet'
import EthHashInfo from '@/components/common/EthHashInfo'
import ExternalLink from '@/components/common/ExternalLink'
import ModalDialog from '@/components/common/ModalDialog'
import QRCode from '@/components/common/QRCode'
import Track from '@/components/common/Track'
import FirstTxFlow from '@/features/counterfactual/FirstTxFlow'
import { selectUndeployedSafe } from '@/features/counterfactual/store/undeployedSafesSlice'
import useBalances from '@/hooks/useBalances'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import { OVERVIEW_EVENTS } from '@/services/analytics'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectSettings, setQrShortName } from '@/store/settingsSlice'
import { selectOutgoingTransactions } from '@/store/txHistorySlice'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import classnames from 'classnames'
import { type ReactNode, useState } from 'react'
import { Card, WidgetBody, WidgetContainer } from '@/components/dashboard/styled'
import { Box, Button, CircularProgress, FormControlLabel, Grid, Switch, Typography } from '@mui/material'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import css from './styles.module.css'
import ActivateAccountButton from '@/features/counterfactual/ActivateAccountButton'
import { isReplayedSafeProps } from '@/features/counterfactual/utils'
import { getExplorerLink } from '@safe-global/utils/utils/gateway'

const calculateProgress = (items: boolean[]) => {
  const totalNumberOfItems = items.length
  const completedItems = items.filter((item) => item)
  return Math.round((completedItems.length / totalNumberOfItems) * 100)
}

const StatusCard = ({
  badge,
  title,
  content,
  completed,
  children,
}: {
  badge: ReactNode
  title: string
  content: string
  completed: boolean
  children?: ReactNode
}) => {
  return (
    <Card className={css.card}>
      <div className={css.topBadge}>{badge}</div>
      <div className={css.status}>
        {completed ? (
          <CheckCircleRoundedIcon color="success" fontSize="medium" />
        ) : (
          <CircleOutlinedIcon color="inherit" fontSize="medium" />
        )}
      </div>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'primary.light',
        }}
      >
        {content}
      </Typography>
      {children}
    </Card>
  )
}

const ActivationStatusWidget = ({ explorerLink }: { explorerLink?: string }) => {
  const { t } = useTranslation()
  return (
    <StatusCard
      badge={
        <Typography
          variant="body2"
          sx={{ backgroundColor: 'border.light', borderRadius: '0 0 4px 4px', padding: '4px 8px' }}
        >
          {t('dashboard.justSubmitted')}
        </Typography>
      }
      title={t('dashboard.transactionPending')}
      content={t('dashboard.dependingOnNetwork')}
      completed={false}
    >
      {explorerLink && (
        <ExternalLink href={explorerLink} sx={{ mt: 2 }}>
          {t('dashboard.viewExplorer')}
        </ExternalLink>
      )}
    </StatusCard>
  )
}

const UsefulHintsWidget = () => {
  const { t } = useTranslation()
  return (
    <StatusCard
      badge={
        <Typography variant="body2" className={classnames(css.badgeText, css.badgeTextInfo)}>
          <LightbulbOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
          {t('dashboard.didYouKnow')}
        </Typography>
      }
      title={t('dashboard.exploreOver70DApps')}
      content={t('dashboard.inOurSafeApp')}
      completed={false}
    />
  )
}

const AddFundsWidget = ({ completed }: { completed: boolean }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const { safeAddress } = useSafeInfo()
  const chain = useCurrentChain()
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectSettings)
  const qrPrefix = settings.shortName.qr ? `${chain?.shortName}:` : ''
  const qrCode = `${qrPrefix}${safeAddress}`

  const title = t('dashboard.addNativeAssets')
  const content = t('dashboard.receiveDescription', { currency: chain?.nativeCurrency.name })

  const toggleDialog = () => {
    setOpen((prev) => !prev)
  }

  return (
    <StatusCard
      badge={
        <Typography variant="body2" className={css.badgeText}>
          {t('dashboard.firstInteraction')}
        </Typography>
      }
      title={title}
      content={content}
      completed={completed}
    >
      {!completed && (
        <>
          <Box
            sx={{
              mt: 2,
            }}
          >
            <Track {...OVERVIEW_EVENTS.ADD_FUNDS}>
              <Button
                data-testid="add-funds-btn"
                onClick={toggleDialog}
                variant="contained"
                size="small"
                sx={{ minHeight: '40px' }}
              >
                {t('dashboard.addFunds')}
              </Button>
            </Track>
          </Box>
          <ModalDialog
            open={open}
            onClose={toggleDialog}
            dialogTitle={t('dashboard.addFundsToSafeAccount')}
            hideChainIndicator
          >
            <Box
              sx={{
                px: 4,
                pb: 5,
                pt: 4,
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <Grid
                  data-testid="qr-code"
                  item
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      border: 1,
                      borderRadius: '6px',
                      borderColor: 'border.light',
                      display: 'inline-flex',
                    }}
                  >
                    <QRCode value={qrCode} size={132} />
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          data-testid="qr-code-switch"
                          checked={settings.shortName.qr}
                          onChange={(e) => dispatch(setQrShortName(e.target.checked))}
                        />
                      }
                      label={t('dashboard.qrChainPrefix', { prefix: `${chain?.shortName}:` })}
                    />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography
                    sx={{
                      mb: 2,
                    }}
                  >
                    {t('dashboard.copyAddressInstruction')}
                  </Typography>

                  <Box
                    data-testid="address-info"
                    sx={{
                      bgcolor: 'background.main',
                      p: 2,
                      borderRadius: '6px',
                      alignSelf: 'flex-start',
                      fontSize: '14px',
                    }}
                  >
                    <EthHashInfo
                      address={safeAddress}
                      showName={false}
                      shortAddress={false}
                      showCopyButton
                      hasExplorer
                      avatarSize={24}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ModalDialog>
        </>
      )}
    </StatusCard>
  )
}

const FirstTransactionWidget = ({ completed }: { completed: boolean }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const title = t('dashboard.createYourFirstTransaction')
  const content = t('dashboard.simplySend')

  return (
    <>
      <StatusCard
        badge={
          <Typography variant="body2" className={css.badgeText}>
            {t('dashboard.firstInteraction')}
          </Typography>
        }
        title={title}
        content={content}
        completed={completed}
      >
        {!completed && (
          <CheckWallet>
            {(isOk) => (
              <Track {...OVERVIEW_EVENTS.NEW_TRANSACTION} label="onboarding">
                <Button
                  data-testid="create-tx-btn"
                  onClick={() => setOpen(true)}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, minHeight: '40px' }}
                  disabled={!isOk}
                >
                  {t('dashboard.createTransaction')}
                </Button>
              </Track>
            )}
          </CheckWallet>
        )}
      </StatusCard>
      <FirstTxFlow open={open} onClose={() => setOpen(false)} />
    </>
  )
}

const ActivateSafeWidget = ({ chain }: { chain: ChainInfo | undefined }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const title = chain
    ? t('dashboard.activateAccountOnChain', { chain: chain.chainName })
    : t('dashboard.activateYourSafeAccount')
  const content = t('dashboard.activateDescription')

  return (
    <>
      <StatusCard
        badge={
          <Typography variant="body2" className={css.badgeText}>
            {t('dashboard.firstInteraction')}
          </Typography>
        }
        title={title}
        completed={false}
        content={content}
      >
        <Box
          sx={{
            mt: 2,
          }}
        >
          <ActivateAccountButton />
        </Box>
      </StatusCard>
      <FirstTxFlow open={open} onClose={() => setOpen(false)} />
    </>
  )
}

const AccountReadyWidget = () => {
  const { t } = useTranslation()
  return (
    <Card className={classnames(css.card, css.accountReady)}>
      <div className={classnames(css.checkIcon)}>
        <CheckCircleOutlineRoundedIcon sx={{ width: '60px', height: '60px' }} />
      </div>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          mt: 2,
        }}
      >
        {t('dashboard.safeAccountIsReady')}
      </Typography>
      <Typography>{t('dashboard.continueToImprove')}</Typography>
    </Card>
  )
}

const FirstSteps = () => {
  const { t } = useTranslation()
  const { balances } = useBalances()
  const { safe, safeAddress } = useSafeInfo()
  const outgoingTransactions = useAppSelector(selectOutgoingTransactions)
  const chain = useCurrentChain()
  const undeployedSafe = useAppSelector((state) => selectUndeployedSafe(state, safe.chainId, safeAddress))

  const isMultiSig = safe.threshold > 1
  const isReplayedSafe = undeployedSafe && isReplayedSafeProps(undeployedSafe?.props)

  const hasNonZeroBalance = balances && (balances.items.length > 1 || BigInt(balances.items[0]?.balance || 0) > 0)
  const hasOutgoingTransactions = !!outgoingTransactions && outgoingTransactions.length > 0
  const completedItems = [hasNonZeroBalance, hasOutgoingTransactions]

  const progress = calculateProgress(completedItems)
  const stepsCompleted = completedItems.filter((item) => item).length

  if (safe.deployed) return null

  const isActivating = undeployedSafe?.status.status !== 'AWAITING_EXECUTION'

  return (
    <WidgetContainer>
      <WidgetBody data-testid="activation-section">
        <Grid
          container
          sx={{
            gap: 3,
            mb: 2,
            flexWrap: 'nowrap',
            alignItems: 'center',
          }}
        >
          <Grid
            item
            sx={{
              position: 'relative',
              display: 'inline-flex',
            }}
          >
            <svg className={css.gradient}>
              <defs>
                <linearGradient
                  id="progress_gradient"
                  x1="21.1648"
                  y1="8.21591"
                  x2="-9.95028"
                  y2="22.621"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5FDDFF" />
                  <stop offset="1" stopColor="#12FF80" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress variant="determinate" value={100} className={css.circleBg} size={60} thickness={5} />
            <CircularProgress
              variant={isActivating ? 'indeterminate' : 'determinate'}
              value={progress === 0 ? 3 : progress} // Just to give an indication of the progress even at 0%
              className={css.circleProgress}
              size={60}
              thickness={5}
              sx={{ 'svg circle': { stroke: 'url(#progress_gradient)', strokeLinecap: 'round' } }}
            />
          </Grid>
          <Grid item>
            <Typography
              component="div"
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              {isActivating ? t('dashboard.accountIsBeingActivated') : t('dashboard.activateYourSafeAccount')}
            </Typography>

            {isActivating ? (
              <Typography variant="body2">
                <strong>{t('dashboard.thisMayTakeMinutes')}</strong>
              </Typography>
            ) : (
              <Typography variant="body2">
                <strong>
                  {t('dashboard.stepsCompleted', { completed: stepsCompleted, total: completedItems.length })}
                </strong>{' '}
                {t('dashboard.finishNextSteps')}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {isActivating && chain ? (
              <ActivationStatusWidget
                explorerLink={
                  undeployedSafe?.status.txHash
                    ? getExplorerLink(undeployedSafe.status.txHash, chain.blockExplorerUriTemplate).href
                    : undefined
                }
              />
            ) : (
              <AddFundsWidget completed={hasNonZeroBalance} />
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            {isActivating ? (
              <UsefulHintsWidget />
            ) : isMultiSig || isReplayedSafe ? (
              <ActivateSafeWidget chain={chain} />
            ) : (
              <FirstTransactionWidget completed={hasOutgoingTransactions} />
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <AccountReadyWidget />
          </Grid>
        </Grid>
      </WidgetBody>
    </WidgetContainer>
  )
}

export default FirstSteps
