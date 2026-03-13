import React from 'react'

import { SafeTab } from '@/src/components/SafeTab'

import { TokensContainer } from '@/src/features/Assets/components/Tokens'
import { NFTsContainer } from '@/src/features/Assets/components/NFTs'
import { AssetsHeaderContainer } from '@/src/features/Assets/components/AssetsHeader'
import { useTranslation } from 'react-i18next'

export function AssetsContainer() {
  const { t } = useTranslation()

  const tabItems = [
    {
      label: t('assets.tokens'),
      Component: TokensContainer,
    },
    {
      label: t('assets.nfts'),
      Component: NFTsContainer,
    },
  ]

  return <SafeTab items={tabItems} headerHeight={200} renderHeader={AssetsHeaderContainer} />
}
