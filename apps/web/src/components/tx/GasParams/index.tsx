import { getTotalFee } from '@/hooks/useGasPrice'
import type { ReactElement, SyntheticEvent } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography, Link, Grid, SvgIcon } from '@mui/material'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WarningIcon from '@/public/images/notifications/warning.svg'
import { useCurrentChain } from '@/hooks/useChains'
import { formatVisualAmount } from '@safe-global/utils/utils/formatters'
import { type AdvancedParameters } from '../AdvancedParams/types'
import { trackEvent, MODALS_EVENTS } from '@/services/analytics'
import classnames from 'classnames'
import css from './styles.module.css'
import accordionCss from '@/styles/accordion.module.css'
import madProps from '@/utils/mad-props'
import { useTranslation } from 'react-i18next'

const GasDetail = ({ name, value, isLoading }: { name: string; value: string; isLoading: boolean }): ReactElement => {
  const valueSkeleton = <Skeleton variant="text" sx={{ minWidth: '5em' }} />
  return (
    <Grid container>
      <Grid item xs>
        {name}
      </Grid>
      <Grid item>{value || (isLoading ? valueSkeleton : '-')}</Grid>
    </Grid>
  )
}

type GasParamsProps = {
  params: AdvancedParameters
  isExecution: boolean
  isEIP1559?: boolean
  onEdit?: () => void
  gasLimitError?: Error
  willRelay?: boolean
}

export const _GasParams = GasParamsBase
function GasParamsBase({
  params,
  isExecution,
  isEIP1559,
  onEdit,
  gasLimitError,
  willRelay,
  chain,
}: GasParamsProps & { chain?: ChainInfo }): ReactElement {
  const { t } = useTranslation()
  const { nonce, userNonce, safeTxGas, gasLimit, maxFeePerGas, maxPriorityFeePerGas } = params

  const onChangeExpand = (_: SyntheticEvent, expanded: boolean) => {
    trackEvent({ ...MODALS_EVENTS.ESTIMATION, label: expanded ? 'Open' : 'Close' })
  }

  const isLoading = !gasLimit || !maxFeePerGas
  const isError = gasLimitError && !gasLimit

  // Total gas cost
  const totalFee = !isLoading
    ? formatVisualAmount(getTotalFee(maxFeePerGas, gasLimit), chain?.nativeCurrency.decimals)
    : '> 0.001'

  // Individual gas params
  const gasLimitString = gasLimit?.toString() || ''
  const maxFeePerGasGwei = maxFeePerGas ? formatVisualAmount(maxFeePerGas) : ''
  const maxPrioGasGwei = maxPriorityFeePerGas ? formatVisualAmount(maxPriorityFeePerGas) : ''

  const onEditClick = (e: SyntheticEvent) => {
    e.preventDefault()
    onEdit?.()
  }

  const EditComponent = (
    <>
      {gasLimitError || !isExecution || (isExecution && !isLoading) ? (
        <Link
          component="button"
          onClick={onEditClick}
          sx={{
            fontSize: 'medium',
            mt: 2,
          }}
        >
          {t('common.edit')}
        </Link>
      ) : (
        <Skeleton variant="text" sx={{ display: 'inline-block', minWidth: '2em', mt: 2 }} />
      )}
    </>
  )

  return (
    <div className={classnames({ [css.error]: gasLimitError })}>
      <Accordion
        elevation={0}
        onChange={onChangeExpand}
        className={classnames({ [css.withExecutionMethod]: isExecution })}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} className={accordionCss.accordion}>
          {isExecution ? (
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 1,
              }}
            >
              <span style={{ flex: '1' }}>{t('gasParams.estimatedFee')} </span>
              {gasLimitError ? (
                <>
                  <SvgIcon
                    component={WarningIcon}
                    inheritViewBox
                    fontSize="small"
                    sx={{ color: 'var(--color-error-main)', mr: 'var(--space-1)' }}
                  />
                  <span style={{ fontWeight: 'normal' }}>{t('gasParams.cannotEstimate')}</span>
                </>
              ) : isLoading ? (
                <Skeleton variant="text" sx={{ display: 'inline-block', minWidth: '7em' }} />
              ) : (
                <span>{willRelay ? t('gasParams.free') : `${totalFee} ${chain?.nativeCurrency.symbol}`}</span>
              )}
            </Typography>
          ) : (
            <Typography>
              {t('gasParams.signingWithNonce')}&nbsp;
              {nonce !== undefined ? (
                nonce
              ) : (
                <Skeleton variant="text" sx={{ display: 'inline-block', minWidth: '2em' }} />
              )}
            </Typography>
          )}
        </AccordionSummary>

        <AccordionDetails>
          {nonce !== undefined && (
            <GasDetail isLoading={false} name={t('gasParams.safeTxNonce')} value={nonce.toString()} />
          )}

          {safeTxGas !== undefined && <GasDetail isLoading={false} name="safeTxGas" value={safeTxGas.toString()} />}

          {isExecution && (
            <>
              {userNonce !== undefined && (
                <GasDetail isLoading={false} name={t('gasParams.walletNonce')} value={userNonce.toString()} />
              )}

              <GasDetail
                isLoading={isLoading}
                name={t('gasParams.gasLimit')}
                value={isError ? t('gasParams.cannotEstimate') : gasLimitString}
              />

              {isEIP1559 ? (
                <>
                  <GasDetail isLoading={isLoading} name={t('gasParams.maxPriorityFee')} value={maxPrioGasGwei} />
                  <GasDetail isLoading={isLoading} name={t('gasParams.maxFee')} value={maxFeePerGasGwei} />
                </>
              ) : (
                <GasDetail isLoading={isLoading} name={t('gasParams.gasPrice')} value={maxFeePerGasGwei} />
              )}
            </>
          )}

          {onEdit && EditComponent}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const GasParams = madProps(GasParamsBase, {
  chain: useCurrentChain,
})

export default GasParams
