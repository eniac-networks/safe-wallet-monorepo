import { Box, Card, CardContent, CardHeader, List, ListItem, ListItemIcon, ListItemText, SvgIcon } from '@mui/material'
import type { ListItemTextProps } from '@mui/material'
import type { CardHeaderProps } from '@mui/material'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import FileIcon from '@/public/images/settings/data/file.svg'

import useChains from '@/hooks/useChains'
import { ImportErrors } from '@/components/settings/DataManagement/useGlobalImportFileParser'
import type { AddedSafesState } from '@/store/addedSafesSlice'
import type { AddressBookState } from '@/store/addressBookSlice'
import type { SafeAppsState } from '@/store/safeAppsSlice'
import type { SettingsState } from '@/store/settingsSlice'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'

import css from './styles.module.css'
import type { VisitedSafesState } from '@/store/visitedSafesSlice'
import type { UndeployedSafesState } from '@safe-global/utils/features/counterfactual/store/types'

const getItemSecondaryText = (
  chains: ChainInfo[],
  data: AddedSafesState | AddressBookState = {},
  countKey: string,
  t: TFunction,
): ReactElement => {
  return (
    <List sx={{ p: 0 }}>
      {Object.keys(data).map((chainId) => {
        const count = Object.keys(data[chainId] ?? {}).length

        if (count === 0) {
          return null
        }

        const chain = chains.find((chain) => chain.chainId === chainId)

        return (
          <ListItem key={chainId} sx={{ p: 0, m: 0.5 }}>
            <Box
              className={css.networkIcon}
              sx={{ backgroundColor: chain?.theme.backgroundColor ?? '#D9D9D9' }}
              component="span"
            />
            {chain?.chainName}: {count} {t(countKey, { count })}
          </ListItem>
        )
      })}
    </List>
  )
}

type Data = {
  addedSafes?: AddedSafesState
  addressBook?: AddressBookState
  settings?: SettingsState
  safeApps?: SafeAppsState
  undeployedSafes?: UndeployedSafesState
  visitedSafes?: VisitedSafesState
  error?: string
}

type ListProps = Data & {
  showPreview?: boolean
}

type ItemProps = ListProps & { chains: ChainInfo[]; t: TFunction }

const getItems = ({
  addedSafes,
  addressBook,
  settings,
  safeApps,
  undeployedSafes,
  visitedSafes,
  error,
  chains,
  showPreview = false,
  t,
}: ItemProps): Array<ListItemTextProps> => {
  if (error) {
    return [{ primary: <>{error}</> }]
  }

  const addedSafeChainAmount = Object.keys(addedSafes || {}).length
  const addressBookChainAmount = Object.keys(addressBook || {}).length
  const undeployedSafesCount = Object.values(undeployedSafes || {}).flatMap((items) => Object.keys(items)).length

  const items: Array<ListItemTextProps> = []

  if (addedSafeChainAmount > 0) {
    const addedSafesPreview: ListItemTextProps = {
      primary: <>{t('settings.addedSafeAccountsOn', { count: addedSafeChainAmount })}</>,
      secondary: showPreview ? getItemSecondaryText(chains, addedSafes, 'settings.safeCount', t) : undefined,
    }

    items.push(addedSafesPreview)
  }

  if (addressBookChainAmount > 0) {
    const addressBookPreview: ListItemTextProps = {
      primary: <>{t('settings.addressBookFor', { count: addressBookChainAmount })}</>,
      secondary: showPreview ? getItemSecondaryText(chains, addressBook, 'settings.contactCount', t) : undefined,
    }

    items.push(addressBookPreview)
  }

  if (settings) {
    const settingsPreview: ListItemTextProps = {
      primary: <>{t('settings.settingsExportLabel')}</>,
    }

    items.push(settingsPreview)
  }

  if (visitedSafes) {
    const visitedSafesPreview: ListItemTextProps = {
      primary: <>{t('settings.visitedSafesHistory')}</>,
    }

    items.push(visitedSafesPreview)
  }

  const hasBookmarkedSafeApps = Object.values(safeApps || {}).some((chainId) => chainId.pinned?.length > 0)
  if (hasBookmarkedSafeApps) {
    const safeAppsPreview: ListItemTextProps = {
      primary: <>{t('settings.bookmarkedSafeApps')}</>,
    }

    items.push(safeAppsPreview)
  }

  if (undeployedSafes) {
    const undeployedSafesPreview: ListItemTextProps = {
      primary: (
        <>
          {t('settings.notActivatedSafes')} {undeployedSafesCount}
        </>
      ),
    }

    items.push(undeployedSafesPreview)
  }

  if (items.length === 0) {
    return [{ primary: <>{ImportErrors.NO_IMPORT_DATA_FOUND}</> }]
  }

  return items
}

type Props = ListProps & CardHeaderProps

export const FileListCard = ({
  addedSafes,
  addressBook,
  settings,
  safeApps,
  undeployedSafes,
  visitedSafes,
  error,
  showPreview = false,
  ...cardHeaderProps
}: Props): ReactElement => {
  const { t } = useTranslation()
  const chains = useChains()
  const items = getItems({
    addedSafes,
    addressBook,
    settings,
    safeApps,
    visitedSafes,
    undeployedSafes,
    error,
    chains: chains.configs,
    showPreview,
    t,
  })

  return (
    <Card className={css.card}>
      <CardHeader {...cardHeaderProps} className={css.header} />
      <CardContent className={css.content}>
        <List sx={{ p: 0 }}>
          {items.map((item, i) => (
            <ListItem key={i} sx={{ p: 0 }}>
              <ListItemIcon className={css.listIcon}>
                <SvgIcon component={FileIcon} inheritViewBox fontSize="small" sx={{ fill: 'none' }} />
              </ListItemIcon>
              <ListItemText
                {...item}
                // <ul> cannot appear as a descendant of <p>
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
