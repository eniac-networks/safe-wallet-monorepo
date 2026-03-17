import useIsSafeOwner from '@/hooks/useIsSafeOwner'
import { Alert, Box, Button, Paper, SvgIcon, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect } from 'react'
import type { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import useSafeInfo from '@/hooks/useSafeInfo'
import { useSigner } from '@/hooks/wallets/useWallet'
import CheckIcon from '@/public/images/common/check.svg'
import CloseIcon from '@/public/images/common/close.svg'
import { useDarkMode } from '@/hooks/useDarkMode'
import CircularProgress from '@mui/material/CircularProgress'
import ExternalLink from '@/components/common/ExternalLink'
import { useCurrentChain } from '@/hooks/useChains'
import {
  isTxSimulationEnabled,
  type SimulationTxParams,
} from '@safe-global/utils/components/tx/security/tenderly/utils'

import css from './styles.module.css'
import sharedCss from '@/components/tx/security/shared/styles.module.css'
import { TxInfoContext } from '@/components/tx-flow/TxInfoProvider'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import InfoIcon from '@/public/images/notifications/info.svg'
import WarningIcon from '@/public/images/notifications/warning.svg'
import Track from '@/components/common/Track'
import { MODALS_EVENTS } from '@/services/analytics'
import useAsync from '@safe-global/utils/hooks/useAsync'
import { getSafeInfo } from '@safe-global/safe-gateway-typescript-sdk'

const SimulationStatus = ({
  isSuccess,
  isError,
  isCallTraceError,
}: {
  isSuccess: boolean
  isError: boolean
  isCallTraceError: boolean
}) => {
  const { t } = useTranslation()

  if (!isSuccess || isError) {
    return (
      <Typography variant="body2" className={sharedCss.result} sx={{ color: 'error.main' }}>
        <SvgIcon component={CloseIcon} inheritViewBox fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
        {t('common.error')}
      </Typography>
    )
  }

  if (isCallTraceError) {
    return (
      <Typography
        data-testid="simulation-warning-msg"
        variant="body2"
        className={sharedCss.result}
        sx={{ color: 'warning.main' }}
      >
        <SvgIcon component={WarningIcon} inheritViewBox fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
        {t('common.warning')}
      </Typography>
    )
  }

  return (
    <Typography
      data-testid="simulation-success-msg"
      variant="body2"
      className={sharedCss.result}
      sx={{ color: 'success.main' }}
    >
      <SvgIcon component={CheckIcon} inheritViewBox fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
      {t('common.success')}
    </Typography>
  )
}

export type TxSimulationProps = {
  transactions?: SimulationTxParams['transactions']
  gasLimit?: number
  disabled: boolean
  executionOwner?: string
  title?: string
  nestedSafe?: string
}

// TODO: Investigate resetting on gasLimit change as we are not simulating with the gasLimit of the tx
// otherwise remove all usage of gasLimit in simulation. Note: this was previously being done.
// TODO: Test this component
const TxSimulationBlock = ({
  transactions,
  disabled,
  gasLimit,
  executionOwner,
  nestedSafe,
  title,
}: TxSimulationProps): ReactElement => {
  const { t } = useTranslation()
  const resolvedTitle = title ?? t('transactions.runSimulation')
  const { safe } = useSafeInfo()
  const chain = useCurrentChain()
  const signer = useSigner()
  const isSafeOwner = useIsSafeOwner()
  const isDarkMode = useDarkMode()
  const { safeTx } = useContext(SafeTxContext)
  const {
    simulation: { simulateTransaction, resetSimulation },
    status,
    nestedTx,
  } = useContext(TxInfoContext)

  const [nestedSafeInfo] = useAsync(
    () => (!!chain && !!nestedSafe ? getSafeInfo(chain.chainId, nestedSafe) : undefined),
    [chain, nestedSafe],
  )

  const handleSimulation = async () => {
    if (!signer || !transactions) {
      return
    }

    const simulationTxParams = {
      safe: nestedSafeInfo ?? safe,
      // fall back to the first owner of the safe in case the transaction is created by a proposer
      executionOwner: executionOwner ?? (isSafeOwner ? signer.address : safe.owners[0].value),
      transactions,
      gasLimit,
    } as SimulationTxParams

    if (!!nestedSafe) {
      nestedTx.simulation.simulateTransaction(simulationTxParams)
    } else {
      simulateTransaction(simulationTxParams)
    }
  }

  const { isFinished, isError, isSuccess, isLoading, isCallTraceError } = !!nestedSafe ? nestedTx.status : status

  // Reset simulation if safeTx changes
  useEffect(() => {
    resetSimulation()
  }, [safeTx, resetSimulation])

  return (
    <Box>
      <Paper variant="outlined" className={sharedCss.wrapper} sx={{ backgroundColor: 'transparent' }}>
        <div className={css.wrapper}>
          <Typography variant="body2" fontWeight={700}>
            {resolvedTitle}

            <Tooltip title={t('transactions.simulationTooltip')} arrow placement="top">
              <span>
                <SvgIcon
                  component={InfoIcon}
                  inheritViewBox
                  color="border"
                  fontSize="small"
                  sx={{
                    verticalAlign: 'middle',
                    ml: 0.5,
                  }}
                />
              </span>
            </Tooltip>
          </Typography>
          <Typography variant="caption" className={sharedCss.poweredBy}>
            {t('common.poweredBy')}{' '}
            <img
              src={isDarkMode ? '/images/transactions/tenderly-light.svg' : '/images/transactions/tenderly-dark.svg'}
              alt="Tenderly"
              width="65px"
              height="15px"
            />
          </Typography>
        </div>

        <div className={sharedCss.result}>
          {isLoading ? (
            <CircularProgress
              size={22}
              sx={{
                color: ({ palette }) => palette.text.secondary,
              }}
            />
          ) : isFinished ? (
            <SimulationStatus isSuccess={isSuccess} isError={isError} isCallTraceError={isCallTraceError} />
          ) : (
            <Track {...MODALS_EVENTS.SIMULATE_TX}>
              <Button
                data-testid="simulate-btn"
                variant="outlined"
                size="small"
                className={css.simulate}
                onClick={handleSimulation}
                disabled={!transactions || disabled}
              >
                {t('transactions.simulate')}
              </Button>
            </Track>
          )}
        </div>
      </Paper>
    </Box>
  )
}

export const TxSimulation = (props: TxSimulationProps): ReactElement | null => {
  const chain = useCurrentChain()

  if (!chain || !isTxSimulationEnabled(chain)) {
    return null
  }

  return <TxSimulationBlock {...props} />
}

const SimulationMessage = ({
  isSuccess,
  isError,
  isCallTraceError,
  simulationLink,
  simulationData,
  requestError,
}: {
  isSuccess: boolean
  isError: boolean
  isCallTraceError: boolean
  simulationLink: string | undefined
  simulationData: any
  requestError: string | undefined
}) => {
  const { t } = useTranslation()

  if (!isSuccess || isError) {
    return (
      <Alert severity="error" sx={{ border: 'unset' }}>
        <Typography variant="body1" fontWeight={700}>
          {t('transactions.simulationFailed')}
        </Typography>
        {requestError ? (
          <Typography color="error" variant="body2">
            <Trans
              i18nKey="transactions.simulationUnexpectedError"
              values={{ error: requestError }}
              components={[<span key="0" />, <b key="1" />]}
            />
          </Typography>
        ) : (
          <Typography variant="body2">
            <Trans
              i18nKey="transactions.simulationFailedDetails"
              values={{
                errorMessage: simulationData?.transaction.error_message,
                address: simulationData?.transaction.error_info?.address,
              }}
              components={[<b key="0" />, <b key="1" />, <b key="2" />, <ExternalLink key="3" href={simulationLink} />]}
            />
          </Typography>
        )}
      </Alert>
    )
  }

  if (isCallTraceError) {
    return (
      <Alert severity="warning" sx={{ border: 'unset' }}>
        <Typography fontWeight={700}>{t('transactions.simulationSuccessWithWarnings')}</Typography>
        <Trans
          i18nKey="transactions.simulationWarningDetails"
          components={[<span key="0" />, <ExternalLink key="1" href={simulationLink} />]}
        />
      </Alert>
    )
  }

  return (
    <Alert severity="info" sx={{ border: 'unset' }}>
      <Typography fontWeight={700}>{t('transactions.simulationSuccessful')}</Typography>
      <Trans
        i18nKey="transactions.simulationSuccessDetails"
        components={[<span key="0" />, <ExternalLink key="1" href={simulationLink} />]}
      />
    </Alert>
  )
}

// TODO: Test this component
export const TxSimulationMessage = ({ isNested = false }: { isNested?: boolean }) => {
  const txInfo = useContext(TxInfoContext)

  const { isFinished, isError, isSuccess, isCallTraceError } = isNested ? txInfo.nestedTx.status : txInfo.status
  const { simulationLink, simulationData, requestError } = isNested ? txInfo.nestedTx.simulation : txInfo.simulation

  if (!isFinished) {
    return null
  }

  return (
    <SimulationMessage
      isSuccess={isSuccess}
      isError={isError}
      isCallTraceError={isCallTraceError}
      simulationLink={simulationLink}
      simulationData={simulationData}
      requestError={requestError}
    />
  )
}
