import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import EmptyBatchIcon from '@/public/images/common/empty-batch.svg'
import InfoIcon from '@/public/images/notifications/info.svg'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import AppsIcon from '@/public/images/apps/apps-icon.svg'
import SettingsIcon from '@/public/images/sidebar/settings.svg'
import { Box, SvgIcon, Typography } from '@mui/material'

const EmptyBatch = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" textAlign="center" mt={3} px={4}>
      <SvgIcon component={EmptyBatchIcon} inheritViewBox sx={{ fontSize: 110 }} />

      <Typography variant="h4" fontWeight={700}>
        {t('batch.addInitialTx')}
      </Typography>

      <Typography variant="body2" mt={2} mb={4} px={8} sx={{ textWrap: 'balance' }}>
        {t('batch.emptyDescription')}
      </Typography>

      {children}

      <Typography variant="body2" color="border.main" mt={8}>
        <Box mb={1}>
          <SvgIcon component={InfoIcon} inheritViewBox />
        </Box>

        <b>{t('batch.whatTypeQuestion')}</b>

        <Box display="flex" mt={3} gap={6}>
          <div>
            <SvgIcon component={AssetsIcon} inheritViewBox />
            <div>{t('batch.tokenAndNftTransfers')}</div>
          </div>

          <div>
            <SvgIcon component={AppsIcon} inheritViewBox />
            <div>{t('batch.safeAppTransactions')}</div>
          </div>

          <div>
            <SvgIcon component={SettingsIcon} inheritViewBox />
            <div>{t('batch.safeAccountSettings')}</div>
          </div>
        </Box>
      </Typography>
    </Box>
  )
}

export default EmptyBatch
