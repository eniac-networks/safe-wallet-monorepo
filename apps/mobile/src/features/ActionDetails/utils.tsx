import { TransactionDetails } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { ActionValueDecoded, AddressInfoIndex } from '@safe-global/store/gateway/types'
import { getActionName } from '../TransactionActions/components/TxActionsList'
import { Badge } from '@/src/components/Badge'
import { CircleProps, View, Text } from 'tamagui'
import { ListTableItem } from '../ConfirmTx/components/ListTable'
import { Logo } from '@/src/components/Logo'
import { ellipsis } from '@/src/utils/formatters'
import { CopyButton } from '@/src/components/CopyButton'
import { Identicon } from '@/src/components/Identicon'
import { Address } from '@/src/types/address'
import { EthAddress } from '@/src/components/EthAddress'
import { EncodedData } from '@/src/components/EncodedData/EncodedData'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { TFunction } from 'i18next'

const badgeProps: CircleProps = { borderRadius: '$2', paddingHorizontal: '$2', paddingVertical: '$1' }

type formatActionDetailsReturn = {
  txData: TransactionDetails['txData']
  action: ActionValueDecoded
  t: TFunction
}

const getContractCall = (action: ActionValueDecoded, addressInfoIndex?: AddressInfoIndex) => {
  return addressInfoIndex?.[action.to]
}

const TxOptions = ({ value }: { value: string }) => {
  return (
    <View flexDirection="row" alignItems="center">
      <CopyButton value={value} color={'$textSecondaryLight'} />
      <SafeFontIcon name="external-link" size={14} color="$textSecondaryLight" />
    </View>
  )
}

const getContractItemLayout = (
  {
    logoUri,
    value,
    name,
  }: {
    logoUri?: string | null
    value: string
    name?: string | null
  },
  contractLabel: string,
) => ({
  label: contractLabel,
  render: () => (
    <View flexDirection="row" alignItems="center" gap="$2">
      {logoUri ? <Logo logoUri={logoUri} size="$6" /> : <Identicon address={value as Address} size={24} />}
      <Text fontSize="$4">{ellipsis(name || value, 16)}</Text>
      <TxOptions value={value} />
    </View>
  ),
})

export const formatActionDetails = ({ txData, action, t }: formatActionDetailsReturn): ListTableItem[] => {
  if (!txData) {
    return []
  }

  let columns: ListTableItem[] = []

  if (action.dataDecoded?.method) {
    columns.push({
      label: t('transactions.call'),
      render: () => (
        <Badge
          circleProps={badgeProps}
          themeName="badge_background"
          fontSize={13}
          textContentProps={{ fontFamily: 'DM Mono' }}
          circular={false}
          content={getActionName(action)}
        />
      ),
    })
  } else {
    columns.push({
      label: t('advancedDetails.interactedWith'),
      render: () => (
        <View flexDirection="row" alignItems="center" gap="$2">
          <Identicon address={action.to as Address} size={24} />
          <EthAddress copy copyProps={{ color: '$textSecondaryLight' }} address={action.to as Address} />
          <SafeFontIcon name="external-link" size={14} color="$textSecondaryLight" />
        </View>
      ),
    })
  }

  const contractCall = getContractCall(action, txData.addressInfoIndex as AddressInfoIndex)

  if (contractCall) {
    columns.push(getContractItemLayout(contractCall, t('transactions.contract')))
  } else if (action.to) {
    columns.push(getContractItemLayout({ value: action.to }, t('transactions.contract')))
  }

  if (action.dataDecoded) {
    columns = [
      ...columns,
      ...action.dataDecoded.parameters.map((param) => ({
        label: param.name,
        render: () => {
          if (param.type === 'address') {
            return <EthAddress copy copyProps={{ color: '$textSecondaryLight' }} address={param.value as Address} />
          }

          return <Text>{param.value}</Text>
        },
      })),
    ]
  } else if (action.data) {
    columns = [
      ...columns,
      {
        label: t('transactions.data'),
        render: () => <EncodedData data={action.data} />,
      },
    ]
  }

  return columns
}
