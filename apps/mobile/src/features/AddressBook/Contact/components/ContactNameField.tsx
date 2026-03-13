import React from 'react'
import { Text, View } from 'tamagui'
import { useTranslation } from 'react-i18next'
import { SafeInputWithLabel } from '@/src/components/SafeInput/SafeInputWithLabel'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { ContactFormData } from '../schemas'
import { type Contact } from '@/src/store/addressBookSlice'

interface ContactNameFieldProps {
  isEditing: boolean
  contact?: Contact | null
  control?: Control<ContactFormData>
  errors?: FieldErrors<ContactFormData>
  dirtyFields?: Partial<Record<keyof ContactFormData, boolean>>
}

export const ContactNameField = ({ isEditing, contact, control, errors, dirtyFields }: ContactNameFieldProps) => {
  const { t } = useTranslation()
  const isNew = !contact?.value

  if (isEditing && control) {
    return (
      <View>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <SafeInputWithLabel
              label={t('addressBook.name')}
              value={value}
              autoFocus
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={isNew ? t('addressBook.enterName') : contact?.name || t('addressBook.enterName')}
              error={dirtyFields?.name && !!errors?.name}
              success={dirtyFields?.name && !errors?.name && value.trim().length > 0}
            />
          )}
        />
        {errors?.name && <Text color="$error">{errors.name.message}</Text>}
      </View>
    )
  }

  return <SafeInputWithLabel label={t('addressBook.name')} value={contact?.name || t('addressBook.unnamedContact')} disabled editable={false} />
}
