import { Controller, useForm } from 'react-hook-form'
import {
  TextField,
  MenuItem,
  Button,
  CardActions,
  Divider,
  Typography,
  Box,
  Grid,
  SvgIcon,
  Tooltip,
} from '@mui/material'
import { useContext, useEffect } from 'react'
import useSafeInfo from '@/hooks/useSafeInfo'
import TxCard from '@/components/tx-flow/common/TxCard'
import { ChangeThresholdFlowFieldNames } from '@/components/tx-flow/flows/ChangeThreshold'
import type { ChangeThresholdFlowProps } from '@/components/tx-flow/flows/ChangeThreshold'
import InfoIcon from '@/public/images/notifications/info.svg'
import { TOOLTIP_TITLES } from '@/components/tx-flow/common/constants'
import commonCss from '@/components/tx-flow/common/styles.module.css'
import { useTranslation } from 'react-i18next'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import { createUpdateThresholdTx } from '@/services/tx/tx-sender'
import { TxFlowContext } from '@/components/tx-flow/TxFlowProvider'

export const ChooseThreshold = () => {
  const { t } = useTranslation()
  const { onNext, data } = useContext(TxFlowContext)
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)
  const { safe } = useSafeInfo()

  const formMethods = useForm<ChangeThresholdFlowProps>({
    defaultValues: data,
    mode: 'onChange',
  })

  const newThreshold = formMethods.watch(ChangeThresholdFlowFieldNames.threshold)

  useEffect(() => {
    createUpdateThresholdTx(newThreshold).then(setSafeTx).catch(setSafeTxError)
  }, [newThreshold, setSafeTx, setSafeTxError])

  return (
    <TxCard>
      <div>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
          }}
        >
          {t('newSafe.threshold')}
          <Tooltip title={TOOLTIP_TITLES.THRESHOLD} arrow placement="top">
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

        <Typography>{t('settings.anyTransactionWillRequire')}</Typography>
      </div>
      <form onSubmit={formMethods.handleSubmit(onNext)}>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Controller
            control={formMethods.control}
            rules={{
              validate: (value) => {
                if (value === safe.threshold) {
                  return t('settings.currentPolicyAlreadySet', { threshold: safe.threshold })
                }
              },
            }}
            name={ChangeThresholdFlowFieldNames.threshold}
            render={({ field, fieldState }) => {
              const isError = !!fieldState.error

              return (
                <Grid
                  container
                  direction="row"
                  sx={{
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <Grid item>
                    <TextField select {...field} error={isError}>
                      {safe.owners.map((_, idx) => (
                        <MenuItem data-testid="threshold-item" key={idx + 1} value={idx + 1}>
                          {idx + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {t('newSafe.outOfSigners', { count: safe.owners.length, owners: safe.owners.length })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {isError ? (
                      <Typography
                        color="error"
                        sx={{
                          mb: 2,
                        }}
                      >
                        {fieldState.error?.message}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          mb: 2,
                        }}
                      >
                        {fieldState.isDirty ? t('settings.previousPolicyWas') + ' ' : t('settings.currentPolicyIs') + ' '}
                        <b>
                          {safe.threshold} out of {safe.owners.length}
                        </b>
                        .
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              )
            }}
          />
        </Box>

        <Divider className={commonCss.nestedDivider} />

        <CardActions>
          <Button
            data-testid="threshold-next-btn"
            variant="contained"
            type="submit"
            disabled={
              !!formMethods.formState.errors[ChangeThresholdFlowFieldNames.threshold] ||
              // Prevent initial submit before field was interacted with
              newThreshold === safe.threshold
            }
          >
            {t('newSafe.next')}
          </Button>
        </CardActions>
      </form>
    </TxCard>
  )
}
