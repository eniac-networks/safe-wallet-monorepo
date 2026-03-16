import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import classnames from 'classnames'
import { useCurrentChain } from '@/hooks/useChains'
import { useTranslation } from 'react-i18next'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import {
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'

import css from './styles.module.css'
import ErrorMessage from '@/components/tx/ErrorMessage'
import { PayMethod } from '@safe-global/utils/features/counterfactual/types'

const PayNowPayLater = ({
  totalFee,
  canRelay,
  isMultiChain,
  payMethod,
  setPayMethod,
}: {
  totalFee: string
  canRelay: boolean
  isMultiChain: boolean
  payMethod: PayMethod
  setPayMethod: Dispatch<SetStateAction<PayMethod>>
}) => {
  const { t } = useTranslation()
  const chain = useCurrentChain()

  const onChoosePayMethod = (_: ChangeEvent<HTMLInputElement>, newPayMethod: string) => {
    setPayMethod(newPayMethod as PayMethod)
  }

  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        {t('counterfactual.beforeWeContinue')}
      </Typography>
      {isMultiChain && <ErrorMessage level="info">{t('counterfactual.activateSeparately')}</ErrorMessage>}
      <List>
        {isMultiChain && (
          <ListItem disableGutters>
            <ListItemIcon className={css.listItem}>
              <CheckRoundedIcon fontSize="small" color="inherit" />
            </ListItemIcon>
            <Typography variant="body2">{t('counterfactual.startExploring')}</Typography>
          </ListItem>
        )}
        <ListItem disableGutters>
          <ListItemIcon className={css.listItem}>
            <CheckRoundedIcon fontSize="small" color="inherit" />
          </ListItemIcon>
          <Typography variant="body2">{t('counterfactual.oneTimeActivationFeeNote')}</Typography>
        </ListItem>
        {!isMultiChain && (
          <ListItem disableGutters>
            <ListItemIcon className={css.listItem}>
              <CheckRoundedIcon fontSize="small" color="inherit" />
            </ListItemIcon>
            <Typography variant="body2">{t('counterfactual.payLaterNote')}</Typography>
          </ListItem>
        )}
        <ListItem disableGutters>
          <ListItemIcon className={css.listItem}>
            <CheckRoundedIcon fontSize="small" color="inherit" />
          </ListItemIcon>
          <Typography variant="body2">{t('counterfactual.safeNoProfit')}</Typography>
        </ListItem>
      </List>
      {!isMultiChain && (
        <FormControl fullWidth>
          <RadioGroup row value={payMethod} onChange={onChoosePayMethod} className={css.radioGroup}>
            <FormControlLabel
              data-testid="pay-now-execution-method"
              sx={{ flex: 1 }}
              value={PayMethod.PayNow}
              className={classnames(css.radioContainer, { [css.active]: payMethod === PayMethod.PayNow })}
              label={
                <>
                  <Typography className={css.radioTitle}>{t('counterfactual.payNow')}</Typography>
                  <Typography className={css.radioSubtitle} variant="body2" color="text.secondary">
                    {canRelay ? (
                      t('counterfactual.sponsoredFree')
                    ) : (
                      <>
                        &asymp; {totalFee} {chain?.nativeCurrency.symbol}
                      </>
                    )}
                  </Typography>
                </>
              }
              control={<Radio />}
            />

            <FormControlLabel
              data-testid="connected-wallet-execution-method"
              sx={{ flex: 1 }}
              value={PayMethod.PayLater}
              className={classnames(css.radioContainer, { [css.active]: payMethod === PayMethod.PayLater })}
              label={
                <>
                  <Typography className={css.radioTitle}>{t('counterfactual.payLater')}</Typography>
                  <Typography className={css.radioSubtitle} variant="body2" color="text.secondary">
                    {t('counterfactual.withFirstTransaction')}
                  </Typography>
                </>
              }
              control={<Radio />}
            />
          </RadioGroup>
        </FormControl>
      )}
    </>
  )
}

export default PayNowPayLater
