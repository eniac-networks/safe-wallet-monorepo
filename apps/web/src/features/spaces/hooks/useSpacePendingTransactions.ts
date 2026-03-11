import { useSpaceSafesGetPendingTransactionsV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import type { SpacePendingTransactionsPage } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import type { TransactionQueuedItem } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { useCurrentSpaceId } from './useCurrentSpaceId'
import { useAppSelector } from '@/store'
import { isAuthenticated } from '@/store/authSlice'
import { getRtkQueryErrorMessage } from '@/utils/rtkQuery'

const DEFAULT_LIMIT = 20

const isTransactionItem = (
  item: SpacePendingTransactionsPage['results'][number],
): item is TransactionQueuedItem => item.type === 'TRANSACTION'

// TODO: Remove mock data and uncomment real API call
export const useSpacePendingTransactions = (limit = DEFAULT_LIMIT, offset = 0) => {
  const spaceId = useCurrentSpaceId()
  const isUserSignedIn = useAppSelector(isAuthenticated)
  
  const { data, isFetching, error, refetch } = useSpaceSafesGetPendingTransactionsV1Query(
    { spaceId: Number(spaceId), limit, offset },
    { skip: !isUserSignedIn || !spaceId },
  )

  const transactions = data?.results.filter(isTransactionItem) ?? []

  return {
    data,
    transactions,
    count: data?.count ?? 0,
    isLoading: isFetching,
    error: error ? getRtkQueryErrorMessage(error) : undefined,
    refetch,
  }
}
