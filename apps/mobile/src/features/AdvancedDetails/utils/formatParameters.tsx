import { TransactionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { ListTableItem } from '@/src/features/ConfirmTx/components/ListTable'
import { isArrayParameter } from '@/src/utils/transaction-guards'
import { CircleProps } from 'tamagui'
import { formatValueTemplate } from '../formatters/singleValue'
import { formatArrayValue } from '../formatters/arrayValue'
import { Badge } from '@/src/components/Badge'
import { HexDataDisplay } from '@/src/components/HexDataDisplay'
import React from 'react'
import { TFunction } from 'i18next'

interface formatParametersProps {
  txData?: TransactionDetails['txData']
  t: TFunction
}
const badgeProps: CircleProps = { borderRadius: '$2', paddingHorizontal: '$2', paddingVertical: '$1' }

const formatParameters = ({ txData, t }: formatParametersProps): ListTableItem[] => {
  if (!txData) {
    return []
  }

  const items: ListTableItem[] = [
    {
      label: txData?.dataDecoded?.method ? t('transactions.call') : t('advancedDetails.interactedWith'),
      render: () => (
        <Badge
          circleProps={badgeProps}
          themeName="badge_background"
          fontSize={13}
          textContentProps={{ fontFamily: 'DM Mono' }}
          circular={false}
          content={String(txData?.dataDecoded?.method || txData?.to.value)}
        />
      ),
    },
  ]

  const parameters = txData?.dataDecoded?.parameters

  if (parameters && parameters.length) {
    const formatedParameters = parameters.reduce<ListTableItem[]>((acc, param) => {
      const isArrayValueParam = isArrayParameter(param.type) || Array.isArray(param.value)

      if (isArrayValueParam) {
        acc.push(formatArrayValue(param, t))
        return acc
      }

      acc.push(formatValueTemplate(param))

      return acc
    }, [])

    items.push(...formatedParameters)
  }

  if (txData?.hexData) {
    items.push({
      label: t('transactions.hexData'),
      render: () => <HexDataDisplay data={txData?.hexData} title={t('transactions.hexData')} copyMessage={t('advancedDetails.dataCopied')} />,
    })
  }

  return items
}

export { formatParameters }
