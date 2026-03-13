import React, { ReactElement } from 'react'
import { View, Text } from 'tamagui'
import { Badge } from '@/src/components/Badge'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { type BadgeThemeTypes } from '@/src/components/Badge/Badge'
import { OrderTransactionInfo as Order } from '@safe-global/store/gateway/types'
import { useTranslation } from 'react-i18next'

type CustomOrderStatuses = Order['status'] | 'partiallyFilled'
type Props = {
  status: CustomOrderStatuses
}

type StatusProps = {
  label: string
  themeName: BadgeThemeTypes
  icon: React.ReactElement | null
}

export const StatusLabel = (props: Props): ReactElement => {
  const { status } = props
  const { t } = useTranslation()

  const statusMap: Record<CustomOrderStatuses, StatusProps> = {
    presignaturePending: {
      label: t('swapOrder.executionNeeded'),
      themeName: 'badge_warning',
      icon: <SafeFontIcon name="sign" size={14} color="$color" />,
    },
    fulfilled: {
      label: t('swapOrder.filled'),
      themeName: 'badge_success_variant1',
      icon: <SafeFontIcon name="check" size={14} color="$color" />,
    },
    open: {
      label: t('swapOrder.open'),
      themeName: 'badge_warning',
      icon: <SafeFontIcon name="clock" size={14} color="$color" />,
    },
    cancelled: {
      label: t('swapOrder.cancelled'),
      themeName: 'badge_error',
      icon: <SafeFontIcon name="block" size={14} color="$color" />,
    },
    expired: {
      label: t('swapOrder.expired'),
      themeName: 'badge_background',
      icon: <SafeFontIcon name="clock" size={14} color="$color" />,
    },
    partiallyFilled: {
      label: t('swapOrder.partiallyFilled'),
      themeName: 'badge_success_variant1',
      icon: null,
    },
    unknown: {
      label: t('swapOrder.unknown'),
      themeName: 'badge_background',
      icon: null,
    },
  }

  const { label, themeName, icon } = statusMap[status]

  return (
    <View flexDirection="row" alignItems="center" gap="$2">
      <Badge
        circular={false}
        themeName={themeName}
        textContentProps={{ fontWeight: 500 }}
        content={
          <View flexDirection="row" alignItems="center" gap="$2">
            {icon}
            <Text color="$color">{label}</Text>
          </View>
        }
      />
    </View>
  )
}

export default StatusLabel
