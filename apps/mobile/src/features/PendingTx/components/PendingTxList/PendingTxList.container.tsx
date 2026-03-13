import { SafeListItem } from '@/src/components/SafeListItem'
import React, { useMemo } from 'react'
import { SectionList, RefreshControl } from 'react-native'
import { useTheme, View, Text, getTokenValue } from 'tamagui'
import { Badge } from '@/src/components/Badge'
import { NavBarTitle } from '@/src/components/Title/NavBarTitle'
import { LargeHeaderTitle } from '@/src/components/Title/LargeHeaderTitle'
import { useScrollableHeader } from '@/src/navigation/useScrollableHeader'
import { TransactionQueuedItem } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { PendingTransactionItems } from '@safe-global/store/gateway/types'
import { keyExtractor, renderItem } from '@/src/features/PendingTx/utils'
import { Loader } from '@/src/components/Loader'
import { TransactionSkeleton, TransactionSkeletonItem } from '@/src/components/TransactionSkeleton'
import { CircleSnail } from 'react-native-progress'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

export interface GroupedPendingTxsWithTitle {
  title: string
  data: (PendingTransactionItems | TransactionQueuedItem[])[]
}

interface PendingTxListContainerProps {
  transactions: GroupedPendingTxsWithTitle[]
  onEndReached: (info: { distanceFromEnd: number }) => void
  isLoading?: boolean
  amount: number
  hasMore: boolean
  refreshing?: boolean
  onRefresh?: () => void
}

export function PendingTxListContainer({
  transactions,
  onEndReached,
  isLoading,
  hasMore,
  amount,
  refreshing,
  onRefresh,
}: PendingTxListContainerProps) {
  const theme = useTheme()
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()
  const { handleScroll } = useScrollableHeader({
    children: (
      <>
        <NavBarTitle paddingRight={5}>{t('pendingTx.pendingTransactions')}</NavBarTitle>
        <Badge
          content={`${amount}${hasMore ? '+' : ''}`}
          circleSize={'$6'}
          fontSize={10}
          themeName="badge_warning_variant2"
        />
      </>
    ),
  })

  const hasTransactions = transactions && transactions.length > 0
  const isInitialLoading = isLoading && !hasTransactions && !refreshing

  // ListEmptyComponent for initial loading state and empty state
  const renderEmptyComponent = useMemo(() => {
    if (isInitialLoading) {
      return (
        <View
          flex={1}
          alignItems="flex-start"
          justifyContent="flex-start"
          paddingTop="$4"
          testID="pending-tx-initial-loader"
        >
          <TransactionSkeleton count={4} sectionTitles={[t('pendingTx.next'), t('pendingTx.inQueue')]} />
        </View>
      )
    }

    // Empty state when SectionList has no sections (handled by ListEmptyComponent automatically)
    return (
      <View
        flex={1}
        minHeight={400}
        alignItems="center"
        justifyContent="center"
        paddingTop="$10"
        testID="pending-tx-empty-state"
      >
        <View alignItems="center" gap="$3">
          <Text color="$textSecondary" textAlign="center">
            {t('pendingTx.queuedWillAppear')}
          </Text>
        </View>
      </View>
    )
  }, [isInitialLoading, t])

  // ListFooterComponent for pagination loading (bottom loading)
  const renderFooterComponent = useMemo(() => {
    if (isLoading && hasTransactions) {
      return (
        <View testID="pending-tx-pagination-loader" marginTop="$4">
          <TransactionSkeletonItem />
        </View>
      )
    }
    return null
  }, [isLoading, hasTransactions])

  const LargeHeader = (
    <View flexDirection={'row'} alignItems={'flex-start'} paddingTop={'$3'}>
      <LargeHeaderTitle marginRight={5}>{t('pendingTx.pendingTransactions')}</LargeHeaderTitle>
      {isLoading && !refreshing ? (
        <Loader size={24} color="$warning1ContrastTextDark" />
      ) : (
        <Badge content={`${amount}${hasMore ? '+' : ''}`} themeName="badge_warning_variant2" />
      )}
    </View>
  )

  return (
    <>
      {!!refreshing && (
        <View
          position="absolute"
          top={64}
          alignSelf="center"
          zIndex={1000}
          backgroundColor="$background"
          borderRadius={20}
          padding="$2"
          testID="pending-tx-progress-indicator"
        >
          <CircleSnail size={24} color={theme.color.get()} thickness={2} duration={600} spinDuration={1500} />
        </View>
      )}

      <SectionList
        testID={'pending-tx-list'}
        ListHeaderComponent={LargeHeader}
        sections={transactions || []}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor="transparent" // Hide default spinner
            colors={['transparent']} // Hide default spinner on Android
            progressBackgroundColor="transparent"
            style={{ backgroundColor: 'transparent' }}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooterComponent}
        renderSectionHeader={({ section: { title } }) => (
          <SafeListItem.Header
            title={title === 'Next' ? t('pendingTx.next') : title === 'In queue' ? t('pendingTx.inQueue') : title}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: bottom + getTokenValue('$4'),
        }}
      />
    </>
  )
}
