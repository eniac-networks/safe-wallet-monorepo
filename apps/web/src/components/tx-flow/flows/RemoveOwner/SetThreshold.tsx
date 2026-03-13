import { useState } from 'react'
import { Button, Box, CardActions, Divider, Grid, MenuItem, Select, Typography, SvgIcon, Tooltip } from '@mui/material'
import type { ReactElement, SyntheticEvent } from 'react'
import type { SelectChangeEvent } from '@mui/material'

import EthHashInfo from '@/components/common/EthHashInfo'
import useSafeInfo from '@/hooks/useSafeInfo'
import TxCard from '../../common/TxCard'
import InfoIcon from '@/public/images/notifications/info.svg'
import { TOOLTIP_TITLES } from '@/components/tx-flow/common/constants'
import type { RemoveOwnerFlowProps } from '.'

import commonCss from '@/components/tx-flow/common/styles.module.css'
import { useTranslation } from 'react-i18next'

export const SetThreshold = ({
  params,
  onSubmit,
}: {
  params: RemoveOwnerFlowProps
  onSubmit: (data: RemoveOwnerFlowProps) => void
}): ReactElement => {
  const { t } = useTranslation()
  const { safe } = useSafeInfo()
  const [selectedThreshold, setSelectedThreshold] = useState<number>(params.threshold ?? 1)

  const handleChange = (event: SelectChangeEvent<number>) => {
    setSelectedThreshold(parseInt(event.target.value.toString()))
  }

  const onSubmitHandler = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit({ ...params, threshold: selectedThreshold })
  }

  const newNumberOfOwners = safe ? safe.owners.length - 1 : 1

  return (
    <TxCard>
      <form onSubmit={onSubmitHandler}>
        <Box mb={3}>
          <Typography mb={2}>{t('settings.reviewSignerToRemove')}</Typography>

          <EthHashInfo address={params.removedOwner.address} shortAddress={false} showCopyButton hasExplorer />
        </Box>

        <Divider className={commonCss.nestedDivider} />

        <Box my={3}>
          <Typography variant="h4" fontWeight={700}>
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
          <Typography>{t('newSafe.anyTransactionRequires')}</Typography>
          <Grid
            container
            direction="row"
            sx={{
              alignItems: 'center',
              gap: 1,
              mt: 2,
            }}
          >
            <Grid item xs={1.5}>
              <Select data-testid="threshold-selector" value={selectedThreshold} onChange={handleChange} fullWidth>
                {safe.owners.slice(1).map((_, idx) => (
                  <MenuItem key={idx + 1} value={idx + 1}>
                    {idx + 1}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item>
              <Typography>
                {t('newSafe.outOfSigners', { count: newNumberOfOwners, owners: newNumberOfOwners })}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider className={commonCss.nestedDivider} />

        <CardActions>
          <Button data-testid="next-btn" variant="contained" type="submit">
            {t('newSafe.next')}
          </Button>
        </CardActions>
      </form>
    </TxCard>
  )
}
