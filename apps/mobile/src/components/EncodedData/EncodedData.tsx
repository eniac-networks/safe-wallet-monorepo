import React, { useReducer } from 'react'
import { Text } from 'tamagui'
import { TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

interface EncodedDataProps {
  data: string
}

export function EncodedData({ data }: EncodedDataProps) {
  const { t } = useTranslation()
  const [truncated, toggleTruncate] = useReducer((state: boolean) => !state, true)

  return (
    <>
      <Text numberOfLines={truncated ? 5 : undefined} ellipsizeMode="tail">
        {data}
      </Text>

      <TouchableOpacity onPress={toggleTruncate}>
        <Text fontWeight={600}>{truncated ? t('common.showMore') : t('common.showLess')}</Text>
      </TouchableOpacity>
    </>
  )
}
