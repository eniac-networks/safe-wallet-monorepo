import { usePendingTxIds } from '@/hooks/usePendingTxs'
import { SETTINGS_EVENTS, trackEvent } from '@/services/analytics'
import { useAppDispatch } from '@/store'
import { clearPendingTx } from '@/store/pendingTxsSlice'
import { Stack, Typography, Box, Button, Alert } from '@mui/material'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export const ClearPendingTxs = () => {
  const { t } = useTranslation()
  const pendingTxIds = usePendingTxIds()
  const pendingTxCount = pendingTxIds.length
  const dispatch = useAppDispatch()

  const clearPendingTxs = useCallback(() => {
    pendingTxIds.forEach((txId) => {
      dispatch(clearPendingTx({ txId }))
    })
    trackEvent({ ...SETTINGS_EVENTS.DATA.CLEAR_PENDING_TXS, label: pendingTxCount })
  }, [dispatch, pendingTxCount, pendingTxIds])
  return (
    <Stack spacing={2}>
      <Typography>{t('settings.clearPendingTxDescription')}</Typography>
      <Alert severity="warning">
        <Typography>{t('settings.clearPendingTxWarning')}</Typography>
      </Alert>
      <Box>
        {pendingTxCount > 0 ? (
          <Button
            variant="text"
            color="error"
            onClick={clearPendingTxs}
            sx={{ backgroundColor: ({ palette }) => palette.error.background }}
          >
            {t('settings.clearTransactions', { count: pendingTxCount })}
          </Button>
        ) : (
          <Typography variant="body2">{t('settings.noPendingTransactions')}</Typography>
        )}
      </Box>
    </Stack>
  )
}
