import React from 'react'
import { Text, View } from 'tamagui'
import { useTranslation } from 'react-i18next'
import { SafeInputWithLabel } from '@/src/components/SafeInput/SafeInputWithLabel'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { ContactFormData } from '../schemas'
import { type Contact } from '@/src/store/addressBookSlice'

interface ContactAddressFieldProps {
  isEditing: boolean
  contact?: Contact | null
  control?: Control<ContactFormData>
  errors?: FieldErrors<ContactFormData>
  dirtyFields?: Partial<Record<keyof ContactFormData, boolean>>
}

export const ContactAddressField = ({ isEditing, contact, control, errors, dirtyFields }: ContactAddressFieldProps) => {
  const { t } = useTranslation()
  if (isEditing && control) {
    return (
      <View>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <SafeInputWithLabel
              label={t('addressBook.address')}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t('addressBook.enterAddress')}
              autoCapitalize="none"
              autoCorrect={false}
              error={dirtyFields?.address && !!errors?.address}
              success={dirtyFields?.address && !errors?.address && value.trim().length > 0}
              multiline
              numberOfLines={3}
            />
          )}
        />
        {errors?.address && <Text color="$error">{errors.address.message}</Text>}
      </View>
    )
  }

  return (
    <SafeInputWithLabel
      label={t('addressBook.address')}
      value={contact?.value || ''}
      disabled
      editable={false}
      multiline
      numberOfLines={3}
    />
  )
}
