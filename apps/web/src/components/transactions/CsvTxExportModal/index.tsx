import { useMemo, type ReactElement } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  MenuItem,
  Box,
  Grid,
  SvgIcon,
  FormControl,
  Alert,
} from '@mui/material'
import { subMonths, startOfYear, isBefore, isAfter, startOfDay, addMonths, endOfDay } from 'date-fns'
import ExportIcon from '@/public/images/common/export.svg'
import UpdateIcon from '@/public/images/notifications/update.svg'
import ModalDialog from '@/components/common/ModalDialog'
import DatePickerInput from '@/components/common/DatePickerInput'
import useSafeAddress from '@/hooks/useSafeAddress'
import { useAppDispatch } from '@/store'
import useChainId from '@/hooks/useChainId'
import type { JobStatusDto } from '@safe-global/store/gateway/AUTO_GENERATED/csv-export'
import { useCsvExportLaunchExportV1Mutation } from '@safe-global/store/gateway/AUTO_GENERATED/csv-export'
import { showNotification } from '@/store/notificationsSlice'
import { trackEvent, MixPanelEventParams } from '@/services/analytics'
import { TX_LIST_EVENTS } from '@/services/analytics/events/txList'

enum DateRangeOption {
  LAST_30_DAYS = '30d',
  LAST_6_MONTHS = '6m',
  LAST_12_MONTHS = '12m',
  YTD = 'ytd',
  CUSTOM = 'custom',
}

const DATE_RANGE_LABELS: Record<DateRangeOption, string> = {
  [DateRangeOption.LAST_30_DAYS]: 'Last 30 days',
  [DateRangeOption.LAST_6_MONTHS]: 'Last 6 months',
  [DateRangeOption.LAST_12_MONTHS]: 'Last 12 months',
  [DateRangeOption.YTD]: 'Year to date (YTD)',
  [DateRangeOption.CUSTOM]: 'Custom',
}

enum CsvTxExportField {
  RANGE = 'range',
  FROM = 'from',
  TO = 'to',
}

const MAX_RANGE_MONTHS = 12

const getExportDates = (
  range: DateRangeOption,
  from: Date | null,
  to: Date | null,
  now = new Date(),
): { executionDateGte?: string; executionDateLte?: string } => {
  let executionDateGte: string | undefined
  let executionDateLte: string | undefined = endOfDay(now).toISOString()

  switch (range) {
    case DateRangeOption.LAST_30_DAYS:
      executionDateGte = startOfDay(subMonths(now, 1)).toISOString()
      break
    case DateRangeOption.LAST_6_MONTHS:
      executionDateGte = startOfDay(subMonths(now, 6)).toISOString()
      break
    case DateRangeOption.LAST_12_MONTHS:
      executionDateGte = startOfDay(subMonths(now, 12)).toISOString()
      break
    case DateRangeOption.YTD:
      executionDateGte = startOfYear(now).toISOString()
      break
    case DateRangeOption.CUSTOM:
      executionDateGte = from ? startOfDay(from).toISOString() : undefined
      executionDateLte = to ? endOfDay(to).toISOString() : undefined
      break
  }

  return { executionDateGte, executionDateLte }
}

type CsvTxExportForm = {
  [CsvTxExportField.RANGE]: DateRangeOption | ''
  [CsvTxExportField.FROM]: Date | null
  [CsvTxExportField.TO]: Date | null
}

type CsvTxExportModalProps = {
  onClose: () => void
  onExport: (job: JobStatusDto) => void
  hasActiveFilter: boolean
}

const CsvTxExportModal = ({ onClose, onExport, hasActiveFilter }: CsvTxExportModalProps): ReactElement => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const safeAddress = useSafeAddress()
  const chainId = useChainId()
  const [launchExport] = useCsvExportLaunchExportV1Mutation()

  const dateRangeLabels = useMemo<Record<DateRangeOption, string>>(
    () => ({
      [DateRangeOption.LAST_30_DAYS]: t('transactions.last30Days'),
      [DateRangeOption.LAST_6_MONTHS]: t('transactions.last6Months'),
      [DateRangeOption.LAST_12_MONTHS]: t('transactions.last12Months'),
      [DateRangeOption.YTD]: t('transactions.yearToDate'),
      [DateRangeOption.CUSTOM]: t('transactions.custom'),
    }),
    [t],
  )

  const infoNotification = () => {
    dispatch(
      showNotification({
        variant: 'info',
        groupKey: 'export-csv-started',
        title: t('transactions.generatingCsvExport'),
        message: t('transactions.mightTakeFewMinutes'),
        icon: <SvgIcon component={UpdateIcon} inheritViewBox fontSize="inherit" />,
      }),
    )
  }

  const errorNotification = () => {
    dispatch(
      showNotification({
        variant: 'error',
        groupKey: 'export-csv-error',
        title: t('transactions.somethingWentWrong'),
        message: t('transactions.tryExportingAgain'),
      }),
    )
  }

  const methods = useForm<CsvTxExportForm>({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      [CsvTxExportField.RANGE]: '',
      [CsvTxExportField.FROM]: null,
      [CsvTxExportField.TO]: null,
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = methods

  const selectedRange = watch(CsvTxExportField.RANGE)
  const from = watch(CsvTxExportField.FROM)
  const to = watch(CsvTxExportField.TO)

  const isOverYear = !!(from && to && isAfter(to, addMonths(from, MAX_RANGE_MONTHS)))

  const isExportDisabled = useMemo(() => {
    return (
      !selectedRange ||
      (selectedRange === DateRangeOption.CUSTOM && (!from || !to || !!errors.from || !!errors.to)) ||
      isOverYear
    )
  }, [selectedRange, from, to, errors.from, errors.to, isOverYear])

  const onSubmit = handleSubmit(async ({ range, from, to }) => {
    if (!range) return
    const { executionDateGte, executionDateLte } = getExportDates(range, from, to)

    try {
      const job = await launchExport({
        chainId,
        safeAddress,
        transactionExportDto: { executionDateGte, executionDateLte },
      }).unwrap()
      onExport(job)
      infoNotification()
    } catch (e) {
      errorNotification()
    }

    trackEvent(TX_LIST_EVENTS.CSV_EXPORT_SUBMITTED, {
      [MixPanelEventParams.DATE_RANGE]: DATE_RANGE_LABELS[range as DateRangeOption],
    })
    onClose()
  })

  return (
    <ModalDialog
      open
      onClose={onClose}
      dialogTitle={
        <>
          <SvgIcon component={ExportIcon} inheritViewBox sx={{ mr: 1 }} />
          {t('transactions.exportCsv')}
        </>
      }
      hideChainIndicator
      maxWidth="xs"
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <DialogContent sx={{ p: '24px !important' }}>
            <Typography mb={3}>{t('transactions.csvIncludesTransactions')}</Typography>

            {hasActiveFilter && (
              <Alert severity="info" color="background" sx={{ mb: 3 }}>
                {t('transactions.filtersWontApply')}
              </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 1 }}>
              <Controller
                name={CsvTxExportField.RANGE}
                control={control}
                render={({ field }) => (
                  <TextField select focused={false} label={t('transactions.dateRange')} fullWidth {...field}>
                    {Object.values(DateRangeOption).map((option) => (
                      <MenuItem key={option} value={option}>
                        {dateRangeLabels[option]}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>

            {selectedRange === DateRangeOption.CUSTOM && (
              <Box mt={2} mb={1} display="flex" flexDirection="column" gap={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <DatePickerInput
                      name={CsvTxExportField.FROM}
                      label={t('transactions.from')}
                      deps={[CsvTxExportField.TO]}
                      validate={(val) => {
                        const toDate = getValues(CsvTxExportField.TO)
                        if (val && toDate && isBefore(startOfDay(toDate), startOfDay(val))) {
                          return t('transactions.mustBeBeforeTo')
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePickerInput
                      name={CsvTxExportField.TO}
                      label={t('transactions.to')}
                      deps={[CsvTxExportField.FROM]}
                      validate={(val) => {
                        const fromDate = getValues(CsvTxExportField.FROM)
                        if (val && fromDate && isAfter(startOfDay(fromDate), startOfDay(val))) {
                          return t('transactions.mustBeAfterFrom')
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                <YearRangeAlert isOverYear={isOverYear} />
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'flex-end', '&::after': { display: 'none' } }}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{ height: 36 }}
              disabled={isExportDisabled}
              disableElevation
              startIcon={<SvgIcon component={ExportIcon} inheritViewBox fontSize="small" />}
            >
              {t('transactions.export')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </ModalDialog>
  )
}

const YearRangeAlert = ({ isOverYear }: { isOverYear: boolean }): ReactElement => {
  const { t } = useTranslation()
  const { severity, message } = isOverYear
    ? {
        severity: 'warning' as const,
        message: t('transactions.dateRangeExceeds'),
      }
    : {
        severity: 'info' as const,
        message: t('transactions.selectUpTo12Months'),
      }

  return <Alert severity={severity}>{message}</Alert>
}

export default CsvTxExportModal
