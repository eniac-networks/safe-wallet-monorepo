import FiatValue from '@/components/common/FiatValue'
import { Stack, SvgIcon, Tooltip } from '@mui/material'
import InfoIcon from '@/public/images/notifications/info.svg'
import type { Balance } from '@safe-global/store/gateway/AUTO_GENERATED/balances'
import { useTranslation } from 'react-i18next'

export const FiatBalance = ({ balanceItem }: { balanceItem: Balance }) => {
  const { t } = useTranslation()
  const isMissingFiatConversion = balanceItem.fiatConversion === '0' && balanceItem.fiatBalance === '0'

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
      <FiatValue value={isMissingFiatConversion ? null : balanceItem.fiatBalance} precise />

      {isMissingFiatConversion && (
        <Tooltip title={t('balances.fiatConversionTooltip')} placement="top" arrow>
          <SvgIcon component={InfoIcon} inheritViewBox color="error" fontSize="small" />
        </Tooltip>
      )}
    </Stack>
  )
}
