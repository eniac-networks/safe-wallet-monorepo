import { Chip, SvgIcon, Tooltip, Typography } from '@mui/material'
import InfoIcon from '@/public/images/notifications/info.svg'
import { useTranslation } from 'react-i18next'

const TxProposalChip = () => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('proposers.proposalChipTooltip')}>
      <span>
        <Chip
          sx={{ backgroundColor: 'background.main', color: 'primary.light' }}
          size="small"
          label={
            <Typography
              variant="caption"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={0.7}
            >
              <SvgIcon component={InfoIcon} inheritViewBox fontSize="small" />
              <Typography data-testid="proposal-status" variant="caption" fontWeight="bold">
                {t('proposers.proposal')}
              </Typography>
            </Typography>
          }
        />
      </span>
    </Tooltip>
  )
}

export default TxProposalChip
