import { Chip } from '@/components/common/Chip'
import EnhancedTable from '@/components/common/EnhancedTable'
import tableCss from '@/components/common/EnhancedTable/styles.module.css'
import OnlyOwner from '@/components/common/OnlyOwner'
import Track from '@/components/common/Track'
import UpsertProposer from '@/features/proposers/components/UpsertProposer'
import DeleteProposerDialog from '@/features/proposers/components/DeleteProposerDialog'
import EditProposerDialog from '@/features/proposers/components/EditProposerDialog'
import { useHasFeature } from '@/hooks/useChains'
import useProposers from '@/hooks/useProposers'
import AddIcon from '@/public/images/common/add.svg'
import { SETTINGS_EVENTS } from '@/services/analytics'
import { Box, Button, Grid, Paper, SvgIcon, Typography } from '@mui/material'
import EthHashInfo from '@/components/common/EthHashInfo'
import ExternalLink from '@/components/common/ExternalLink'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'
import useSafeInfo from '@/hooks/useSafeInfo'
import { Tooltip } from '@mui/material'

const ProposersList = () => {
  const { t } = useTranslation()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>()
  const proposers = useProposers()
  const isEnabled = useHasFeature(FEATURES.PROPOSERS)
  const { safe } = useSafeInfo()
  const isUndeployedSafe = !safe.deployed

  const headCells = useMemo(
    () => [
      { id: 'proposer', label: t('settings.proposerColumn') },
      { id: 'creator', label: t('settings.creatorColumn') },
      { id: 'Actions', label: '' },
    ],
    [t],
  )
  const safeNotActivated = t('settings.safeNotActivated')

  const rows = useMemo(() => {
    if (!proposers.data) return []

    return proposers.data.results.map((proposer) => {
      return {
        cells: {
          proposer: {
            rawValue: proposer.delegate,
            content: (
              <EthHashInfo
                address={proposer.delegate}
                showCopyButton
                hasExplorer
                name={proposer.label || undefined}
                shortAddress
              />
            ),
          },

          creator: {
            rawValue: proposer.delegator,
            content: <EthHashInfo address={proposer.delegator} showCopyButton hasExplorer shortAddress />,
          },
          actions: {
            rawValue: '',
            sticky: true,
            content: isEnabled && (
              <div className={tableCss.actions}>
                <EditProposerDialog proposer={proposer} />
                <DeleteProposerDialog proposer={proposer} />
              </div>
            ),
          },
        },
      }
    })
  }, [isEnabled, proposers.data])

  if (!proposers.data?.results) return null

  const onAdd = () => {
    setIsAddDialogOpen(true)
  }

  return (
    <Paper sx={{ mt: 2 }}>
      <Box data-testid="proposer-section" display="flex" flexDirection="column" gap={2}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Typography fontWeight="bold" mb={2}>
              {t('settings.proposers')}{' '}
              <Chip label="New" sx={{ backgroundColor: 'secondary.light', color: 'static.main' }} />
            </Typography>
            <Typography mb={2}>
              {t('settings.proposersDescription')}{' '}
              <ExternalLink href={HelpCenterArticle.PROPOSERS}>{t('transactions.learnMore')}</ExternalLink>
            </Typography>

            {isEnabled && (
              <Box mb={2}>
                <OnlyOwner>
                  {(isOk) => (
                    <Track {...SETTINGS_EVENTS.PROPOSERS.ADD_PROPOSER}>
                      <Tooltip title={isUndeployedSafe ? safeNotActivated : ''}>
                        <span>
                          <Button
                            data-testid="add-proposer-btn"
                            onClick={onAdd}
                            variant="text"
                            startIcon={<SvgIcon component={AddIcon} inheritViewBox fontSize="small" />}
                            disabled={!isOk || isUndeployedSafe}
                            size="compact"
                          >
                            {t('settings.addProposer')}
                          </Button>
                        </span>
                      </Tooltip>
                    </Track>
                  )}
                </OnlyOwner>
              </Box>
            )}

            {rows.length > 0 && <EnhancedTable rows={rows} headCells={headCells} />}
          </Grid>

          {isAddDialogOpen && (
            <UpsertProposer onClose={() => setIsAddDialogOpen(false)} onSuccess={() => setIsAddDialogOpen(false)} />
          )}
        </Grid>
      </Box>
    </Paper>
  )
}

export default ProposersList
