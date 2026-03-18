import { getOrderClass } from '@/features/swap/helpers/utils'
import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import {
  type AddressEx,
  SettingsInfoType,
  TransactionInfoType,
  type TransactionSummary,
} from '@safe-global/safe-gateway-typescript-sdk'
import SwapIcon from '@/public/images/common/swap.svg'
import BridgeIcon from '@/public/images/common/bridge.svg'
import StakeIcon from '@/public/images/common/stake.svg'
import EarnIcon from '@/public/images/common/earn.svg'
import NestedSafeIcon from '@/public/images/transactions/nestedTx.svg'
import BatchIcon from '@/public/images/common/multisend.svg'

import {
  isCancellationTxInfo,
  isModuleExecutionInfo,
  isMultiSendTxInfo,
  isNestedConfirmationTxInfo,
  isOutgoingTransfer,
  isTxQueued,
} from '@/utils/transaction-guards'
import useAddressBook from './useAddressBook'
import type { AddressBook } from '@/store/addressBookSlice'

import { SvgIcon } from '@mui/material'

const getTxTo = ({ txInfo }: Pick<TransactionSummary, 'txInfo'>): AddressEx | undefined => {
  switch (txInfo.type) {
    case TransactionInfoType.CREATION: {
      return txInfo.factory
    }
    case TransactionInfoType.TRANSFER: {
      return txInfo.recipient
    }
    case TransactionInfoType.SETTINGS_CHANGE: {
      return undefined
    }
    case TransactionInfoType.CUSTOM: {
      return txInfo.to
    }
  }
}

type TxType = {
  icon: string | ReactElement
  text: string
}

export const getTransactionType = (tx: TransactionSummary, addressBook: AddressBook, t: TFunction): TxType => {
  const toAddress = getTxTo(tx)
  const addressBookName = toAddress?.value ? addressBook[toAddress.value] : undefined

  switch (tx.txInfo.type) {
    case TransactionInfoType.CREATION: {
      return {
        icon: toAddress?.logoUri || '/images/transactions/settings.svg',
        text: t('transactions.safeAccountCreated'),
      }
    }
    case TransactionInfoType.SWAP_TRANSFER:
    case TransactionInfoType.TRANSFER: {
      const isSendTx = isOutgoingTransfer(tx.txInfo)

      return {
        icon: isSendTx ? '/images/transactions/outgoing.svg' : '/images/transactions/incoming.svg',
        text: isSendTx
          ? isTxQueued(tx.txStatus)
            ? t('transactions.send')
            : t('transactions.sent')
          : t('transactions.received'),
      }
    }
    case TransactionInfoType.SETTINGS_CHANGE: {
      // deleteGuard doesn't exist in Solidity
      // It is decoded as 'setGuard' with a settingsInfo.type of 'DELETE_GUARD'
      const isDeleteGuard = tx.txInfo.settingsInfo?.type === SettingsInfoType.DELETE_GUARD

      return {
        icon: '/images/transactions/settings.svg',
        text: isDeleteGuard ? t('transactions.deleteGuardLabel') : tx.txInfo.dataDecoded.method,
      }
    }
    case TransactionInfoType.SWAP_ORDER: {
      const orderClass = getOrderClass(tx.txInfo)
      const altText = orderClass === 'limit' ? t('transactions.limitOrder') : t('transactions.swapOrder')

      return {
        icon: <SvgIcon component={SwapIcon} inheritViewBox fontSize="small" alt={altText} />,
        text: altText,
      }
    }
    case TransactionInfoType.TWAP_ORDER: {
      const twapText = t('transactions.twapOrder')
      return {
        icon: <SvgIcon component={SwapIcon} inheritViewBox fontSize="small" alt={twapText} />,
        text: twapText,
      }
    }
    case TransactionInfoType.NATIVE_STAKING_DEPOSIT: {
      const stakeText = t('transactions.stakeAction')
      return {
        icon: <SvgIcon component={StakeIcon} inheritViewBox fontSize="small" alt={stakeText} />,
        text: stakeText,
      }
    }
    case TransactionInfoType.NATIVE_STAKING_VALIDATORS_EXIT: {
      const withdrawRequestText = t('transactions.withdrawRequest')
      return {
        icon: <SvgIcon component={StakeIcon} inheritViewBox fontSize="small" alt={withdrawRequestText} />,
        text: withdrawRequestText,
      }
    }
    case TransactionInfoType.NATIVE_STAKING_WITHDRAW: {
      const claimText = t('transactions.claimAction')
      return {
        icon: <SvgIcon component={StakeIcon} inheritViewBox fontSize="small" alt={claimText} />,
        text: claimText,
      }
    }
    // @ts-ignore TODO: Add types to old SDK or switch to auto-generated
    case 'VaultDeposit': {
      const depositText = t('transactions.depositAction')
      return {
        icon: <SvgIcon component={EarnIcon} inheritViewBox fontSize="small" alt={depositText} />,
        text: depositText,
      }
    }
    // @ts-ignore TODO: Add types to old SDK or switch to auto-generated
    case 'VaultRedeem': {
      const withdrawText = t('transactions.withdrawAction')
      return {
        icon: <SvgIcon component={EarnIcon} inheritViewBox fontSize="small" alt={withdrawText} />,
        text: withdrawText,
      }
    }

    // @ts-ignore TODO: Add types to old SDK or switch to auto-generated
    case 'SwapAndBridge': {
      const bridgeText = t('transactions.bridgeAction')
      return {
        icon: <SvgIcon component={BridgeIcon} inheritViewBox fontSize="small" alt={bridgeText} />,
        text: bridgeText,
      }
    }

    // @ts-ignore TODO: Add types to old SDK or switch to auto-generated
    case 'Swap': {
      const swapText = t('transactions.swapAction')
      return {
        icon: <SvgIcon component={SwapIcon} inheritViewBox fontSize="small" alt={swapText} />,
        text: swapText,
      }
    }

    case TransactionInfoType.CUSTOM: {
      if (tx.safeAppInfo) {
        return {
          icon: tx.safeAppInfo.logoUri,
          text: tx.safeAppInfo.name,
        }
      }

      if (isMultiSendTxInfo(tx.txInfo)) {
        const batchText = t('transactions.batchAction')
        return {
          icon: <SvgIcon component={BatchIcon} inheritViewBox fontSize="small" alt={batchText} />,
          text: batchText,
        }
      }

      if (isModuleExecutionInfo(tx.executionInfo)) {
        return {
          icon: toAddress?.logoUri || '/images/transactions/custom.svg',
          text: toAddress?.name || t('transactions.contractInteractionLabel'),
        }
      }

      if (isCancellationTxInfo(tx.txInfo)) {
        return {
          icon: '/images/transactions/circle-cross-red.svg',
          text: t('transactions.onChainRejection'),
        }
      }

      if (isNestedConfirmationTxInfo(tx.txInfo)) {
        return {
          icon: (
            <SvgIcon
              component={NestedSafeIcon}
              inheritViewBox
              fontSize="small"
              alt={t('transactions.nestedSafeAction')}
            />
          ),
          text: addressBookName
            ? t('transactions.nestedSafeWithName', { name: addressBookName })
            : t('transactions.nestedSafeAction'),
        }
      }

      return {
        icon: toAddress?.logoUri || '/images/transactions/custom.svg',
        text: addressBookName || toAddress?.name || t('transactions.contractInteractionLabel'),
      }
    }
    default: {
      return {
        icon: '/images/transactions/custom.svg',
        text: addressBookName || t('transactions.contractInteractionLabel'),
      }
    }
  }
}

export const useTransactionType = (tx: TransactionSummary): TxType => {
  const addressBook = useAddressBook()
  const { t } = useTranslation()

  return useMemo(() => {
    return getTransactionType(tx, addressBook, t)
  }, [tx, addressBook, t])
}
