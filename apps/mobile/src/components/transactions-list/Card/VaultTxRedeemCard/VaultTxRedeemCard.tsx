import { VaultRedeemTransactionInfo } from '@safe-global/store/gateway/AUTO_GENERATED/transactions'
import { TokenAmount } from '@/src/components/TokenAmount'
import { SafeListItem } from '@/src/components/SafeListItem'
import { TokenIcon } from '@/src/components/TokenIcon'
import { SafeListItemProps } from '@/src/components/SafeListItem/SafeListItem'
import { useTranslation } from 'react-i18next'

type VaultTxRedeemCardProps = {
  info: VaultRedeemTransactionInfo
} & Partial<SafeListItemProps>

export const VaultTxRedeemCard = ({ info, ...rest }: VaultTxRedeemCardProps) => {
  const { t } = useTranslation()
  return (
    <SafeListItem
      label={t('vault.withdraw')}
      icon="transaction-earn"
      type={'Earn'}
      rightNode={
        <TokenAmount value={info.value} tokenSymbol={info.tokenInfo.symbol} decimals={info.tokenInfo.decimals} />
      }
      leftNode={<TokenIcon logoUri={info.tokenInfo.logoUri} accessibilityLabel={info.tokenInfo.symbol} size="$8" />}
      {...rest}
    />
  )
}
