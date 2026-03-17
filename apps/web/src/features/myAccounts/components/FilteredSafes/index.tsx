import SafesList from '@/features/myAccounts/components/SafesList'
import type { AllSafeItems } from '@/features/myAccounts/hooks/useAllSafesGrouped'
import { useSafesSearch } from '@/features/myAccounts/hooks/useSafesSearch'
import { OVERVIEW_EVENTS } from '@/services/analytics'
import { trackEvent } from '@/services/analytics'
import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const FilteredSafes = ({
  searchQuery,
  allSafes,
  onLinkClick,
}: {
  searchQuery: string
  allSafes: AllSafeItems
  onLinkClick?: () => void
}) => {
  const { t } = useTranslation()
  const filteredSafes = useSafesSearch(allSafes ?? [], searchQuery)

  useEffect(() => {
    if (searchQuery) {
      trackEvent({ category: OVERVIEW_EVENTS.SEARCH.category, action: OVERVIEW_EVENTS.SEARCH.action })
    }
  }, [searchQuery])

  return (
    <>
      <Typography variant="h5" fontWeight="normal" mb={2} color="primary.light">
        {t('myAccounts.foundResults', { count: filteredSafes.length })}
      </Typography>
      <Box mt={1}>
        <SafesList safes={filteredSafes} onLinkClick={onLinkClick} />
      </Box>
    </>
  )
}

export default FilteredSafes
