import type { ReactElement } from 'react'
import React from 'react'
import { AppRoutes } from '@/config/routes'
import HomeIcon from '@/public/images/sidebar/home.svg'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import TransactionIcon from '@/public/images/sidebar/transactions.svg'
import ABIcon from '@/public/images/sidebar/address-book.svg'
import AppsIcon from '@/public/images/apps/apps-icon.svg'
import SettingsIcon from '@/public/images/sidebar/settings.svg'
import BridgeIcon from '@/public/images/common/bridge.svg'
import SwapIcon from '@/public/images/common/swap.svg'
import StakeIcon from '@/public/images/common/stake.svg'
import EarnIcon from '@/public/images/common/earn.svg'
import { SvgIcon } from '@mui/material'
import { Chip } from '@/components/common/Chip'

export type NavItem = {
  label: string
  icon?: ReactElement
  href: string
  tag?: ReactElement
  disabled?: boolean
}

export const navItems: NavItem[] = [
  {
    label: 'nav.home',
    icon: <SvgIcon component={HomeIcon} inheritViewBox />,
    href: AppRoutes.home,
  },
  {
    label: 'nav.assets',
    icon: <SvgIcon component={AssetsIcon} inheritViewBox />,
    href: AppRoutes.balances.index,
  },
  {
    label: 'nav.transactions',
    icon: <SvgIcon component={TransactionIcon} inheritViewBox />,
    href: AppRoutes.transactions.history,
  },
  {
    label: 'nav.addressBook',
    icon: <SvgIcon component={ABIcon} inheritViewBox />,
    href: AppRoutes.addressBook,
  },
  {
    label: 'nav.apps',
    icon: <SvgIcon component={AppsIcon} inheritViewBox />,
    href: AppRoutes.apps.index,
  },
  {
    label: 'nav.settings',
    icon: <SvgIcon data-testid="settings-nav-icon" component={SettingsIcon} inheritViewBox />,
    href: AppRoutes.settings.setup,
  },
  {
    label: 'nav.swap',
    icon: <SvgIcon component={SwapIcon} inheritViewBox />,
    href: AppRoutes.swap,
  },
  {
    label: 'nav.bridge',
    icon: <SvgIcon component={BridgeIcon} inheritViewBox />,
    href: AppRoutes.bridge,
  },
  {
    label: 'nav.stake',
    icon: <SvgIcon component={StakeIcon} inheritViewBox />,
    href: AppRoutes.stake,
  },
  {
    label: 'nav.earn',
    icon: <SvgIcon component={EarnIcon} inheritViewBox />,
    href: AppRoutes.earn,
    tag: <Chip label="New" sx={{ backgroundColor: 'secondary.light', color: 'static.main' }} />,
  },
]

export const transactionNavItems = [
  {
    label: 'nav.queue',
    href: AppRoutes.transactions.queue,
  },
  {
    label: 'nav.history',
    href: AppRoutes.transactions.history,
  },
  {
    label: 'nav.messages',
    href: AppRoutes.transactions.messages,
  },
]

export const balancesNavItems = [
  {
    label: 'nav.tokens',
    href: AppRoutes.balances.index,
  },
  {
    label: 'nav.positions',
    href: AppRoutes.balances.positions,
  },
  {
    label: 'nav.nfts',
    href: AppRoutes.balances.nfts,
  },
]

export const settingsNavItems = [
  {
    label: 'nav.setup',
    href: AppRoutes.settings.setup,
  },
  {
    label: 'nav.appearance',
    href: AppRoutes.settings.appearance,
  },
  {
    label: 'nav.security',
    href: AppRoutes.settings.security,
  },
  {
    label: 'nav.notifications',
    href: AppRoutes.settings.notifications,
  },
  {
    label: 'nav.modules',
    href: AppRoutes.settings.modules,
  },
  {
    label: 'nav.safeApps',
    href: AppRoutes.settings.safeApps.index,
  },
  {
    label: 'nav.data',
    href: AppRoutes.settings.data,
  },
  {
    label: 'nav.environmentVariables',
    href: AppRoutes.settings.environmentVariables,
  },
]

export const generalSettingsNavItems = [
  {
    label: 'nav.cookies',
    href: AppRoutes.settings.cookies,
  },
  {
    label: 'nav.appearance',
    href: AppRoutes.settings.appearance,
  },
  {
    label: 'nav.notifications',
    href: AppRoutes.settings.notifications,
  },
  {
    label: 'nav.security',
    href: AppRoutes.settings.security,
  },
  {
    label: 'nav.data',
    href: AppRoutes.settings.data,
  },
  {
    label: 'nav.environmentVariables',
    href: AppRoutes.settings.environmentVariables,
  },
]

export const safeAppsNavItems = [
  {
    label: 'nav.allApps',
    href: AppRoutes.apps.index,
  },
  {
    label: 'nav.myCustomApps',
    href: AppRoutes.apps.custom,
  },
]
