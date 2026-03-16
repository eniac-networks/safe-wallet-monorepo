import { Chip } from '@/components/common/Chip'
import ABIcon from '@/public/images/sidebar/address-book.svg'
import TransactionIcon from '@/public/images/sidebar/transactions.svg'
import React, { type ReactElement } from 'react'
import { AppRoutes } from '@/config/routes'
import HomeIcon from '@/public/images/sidebar/home.svg'
import SettingsIcon from '@/public/images/sidebar/settings.svg'
import MembersIcon from '@/public/images/sidebar/members.svg'
import AccountsIcon from '@/public/images/sidebar/wallet.svg'
import { SvgIcon } from '@mui/material'
import type { TFunction } from 'i18next'

export type DynamicNavItem = {
  label: string
  icon?: ReactElement
  href: string
  tag?: ReactElement
  disabled?: boolean
  activeMemberOnly?: boolean
}

export const getNavItems = (t: TFunction): DynamicNavItem[] => [
  {
    label: t('spaces.navHome'),
    icon: <SvgIcon component={HomeIcon} inheritViewBox />,
    href: AppRoutes.spaces.index,
  },
  {
    label: t('spaces.navSafeAccounts'),
    icon: <SvgIcon component={AccountsIcon} inheritViewBox />,
    href: AppRoutes.spaces.safeAccounts,
  },
  {
    label: t('spaces.navTransactions'),
    icon: <SvgIcon component={TransactionIcon} inheritViewBox />,
    href: '', // TODO: Replace with empty page
    disabled: true,
    tag: <Chip label={t('spaces.navSoon')} sx={{ backgroundColor: 'background.main', color: 'primary.light' }} />,
  },
  {
    label: t('spaces.navMembers'),
    icon: <SvgIcon component={MembersIcon} inheritViewBox />,
    href: AppRoutes.spaces.members,
  },
  {
    label: t('spaces.navAddressBook'),
    icon: <SvgIcon component={ABIcon} inheritViewBox />,
    href: AppRoutes.spaces.addressBook,
  },
  {
    label: t('spaces.navSettings'),
    icon: <SvgIcon component={SettingsIcon} inheritViewBox />,
    href: AppRoutes.spaces.settings,
    activeMemberOnly: true,
  },
]
