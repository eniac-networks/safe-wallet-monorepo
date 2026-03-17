import { useAppDispatch, useAppSelector } from '@/store'
import { selectSettings, setTokenList, TOKEN_LISTS } from '@/store/settingsSlice'
import type { SelectChangeEvent } from '@mui/material'
import { Box, SvgIcon, Tooltip, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import InfoIcon from '@/public/images/notifications/info.svg'
import ExternalLink from '@/components/common/ExternalLink'
import { OnboardingTooltip } from '@/components/common/OnboardingTooltip'
import Track from '@/components/common/Track'
import { ASSETS_EVENTS, trackEvent } from '@/services/analytics'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { HelpCenterArticle } from '@safe-global/utils/config/constants'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

const LS_TOKENLIST_ONBOARDING = 'tokenlist_onboarding'

const TokenListSelect = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectSettings)
  const hasDefaultTokenlist = useHasFeature(FEATURES.DEFAULT_TOKENLIST)

  const TokenListLabel = useMemo(
    () => ({
      [TOKEN_LISTS.TRUSTED]: t('balances.defaultTokens'),
      [TOKEN_LISTS.ALL]: t('balances.allTokens'),
    }),
    [t],
  )

  const handleSelectTokenList = (event: SelectChangeEvent<TOKEN_LISTS>) => {
    const selectedString = event.target.value as TOKEN_LISTS
    dispatch(setTokenList(selectedString))
  }

  if (!hasDefaultTokenlist) {
    return null
  }

  return (
    <FormControl size="small">
      <InputLabel id="tokenlist-select-label">{t('balances.tokenList')}</InputLabel>

      <OnboardingTooltip
        widgetLocalStorageId={LS_TOKENLIST_ONBOARDING}
        text={
          <>
            {t('balances.spamFilterOn')}
            <br />
            {t('balances.spamFilterTooltip')}
          </>
        }
      >
        <Select
          labelId="tokenlist-select-label"
          id="tokenlist-select"
          value={settings.tokenList}
          label={t('balances.tokenList')}
          onChange={handleSelectTokenList}
          renderValue={(value) => TokenListLabel[value]}
          onOpen={() => trackEvent(ASSETS_EVENTS.OPEN_TOKEN_LIST_MENU)}
          sx={{ minWidth: '152px' }}
        >
          <MenuItem value={TOKEN_LISTS.TRUSTED}>
            <Track {...ASSETS_EVENTS.SHOW_DEFAULT_TOKENS}>
              <Box display="flex" flexDirection="row" gap="4px" alignItems="center" minWidth={155}>
                {TokenListLabel.TRUSTED}
                <Tooltip
                  arrow
                  title={
                    <Typography>
                      {t('balances.learnMoreAbout')}{' '}
                      <ExternalLink href={HelpCenterArticle.SPAM_TOKENS}>{t('balances.defaultTokens')}</ExternalLink>
                    </Typography>
                  }
                >
                  <span>
                    <SvgIcon sx={{ display: 'block' }} color="border" fontSize="small" component={InfoIcon} />
                  </span>
                </Tooltip>
              </Box>
            </Track>
          </MenuItem>

          <MenuItem value={TOKEN_LISTS.ALL}>
            <Track {...ASSETS_EVENTS.SHOW_ALL_TOKENS}>
              <span>{TokenListLabel.ALL}</span>
            </Track>
          </MenuItem>
        </Select>
      </OnboardingTooltip>
    </FormControl>
  )
}

export default TokenListSelect
