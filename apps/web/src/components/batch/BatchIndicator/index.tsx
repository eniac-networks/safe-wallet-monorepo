import { Badge, ButtonBase, SvgIcon } from '@mui/material'
import BatchIcon from '@/public/images/common/batch.svg'
import { useDraftBatch } from '@/hooks/useDraftBatch'
import Track from '@/components/common/Track'
import { BATCH_EVENTS } from '@/services/analytics'
import BatchTooltip from './BatchTooltip'
import { useTranslation } from 'react-i18next'

const BatchIndicator = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useTranslation()
  const { length } = useDraftBatch()

  return (
    <BatchTooltip>
      <Track {...BATCH_EVENTS.BATCH_SIDEBAR_OPEN} label={length}>
        <ButtonBase title={t('batch.title')} onClick={onClick} sx={{ p: 2 }}>
          <Badge
            variant="standard"
            badgeContent={length}
            color="secondary"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <SvgIcon component={BatchIcon} inheritViewBox fontSize="medium" />
          </Badge>
        </ButtonBase>
      </Track>
    </BatchTooltip>
  )
}

export default BatchIndicator
