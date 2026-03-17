import SafesList from '@/features/myAccounts/components/SafesList'
import type { AllSafeItems } from '@/features/myAccounts/hooks/useAllSafesGrouped'
import css from '@/features/myAccounts/styles.module.css'
import BookmarkIcon from '@/public/images/apps/bookmark.svg'
import { Box, SvgIcon, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const PinnedSafes = ({ allSafes, onLinkClick }: { allSafes: AllSafeItems; onLinkClick?: () => void }) => {
  const { t } = useTranslation()
  const pinnedSafes = useMemo<AllSafeItems>(() => [...(allSafes?.filter(({ isPinned }) => isPinned) ?? [])], [allSafes])

  return (
    <Box data-testid="pinned-accounts" mb={2} minHeight="170px">
      <div className={css.listHeader}>
        <SvgIcon component={BookmarkIcon} inheritViewBox fontSize="small" sx={{ mt: '2px', mr: 1, strokeWidth: 2 }} />
        <Typography variant="h5" fontWeight={700} mb={2}>
          {t('myAccounts.pinned')}
        </Typography>
      </div>
      {pinnedSafes.length > 0 ? (
        <SafesList safes={pinnedSafes} onLinkClick={onLinkClick} />
      ) : (
        <Box data-testid="empty-pinned-list" className={css.noPinnedSafesMessage}>
          <Typography color="text.secondary" variant="body2" maxWidth="350px" textAlign="center">
            {t('myAccounts.pinnedSafesHintStart')}
            <SvgIcon
              component={BookmarkIcon}
              inheritViewBox
              fontSize="small"
              sx={{ mx: '4px', color: 'text.secondary', position: 'relative', top: '2px' }}
            />
            {t('myAccounts.pinnedSafesHintEnd')}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default PinnedSafes
