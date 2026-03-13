import React from 'react'
import { SafeButton } from '@/src/components/SafeButton'
import { useTranslation } from 'react-i18next'

interface ContactActionButtonProps {
  isEditing: boolean
  isValid: boolean
  onEdit?: () => void
  onSave: () => void
}

export const ContactActionButton = ({ isEditing, isValid, onEdit, onSave }: ContactActionButtonProps) => {
  const { t } = useTranslation()
  if (isEditing) {
    return (
      <SafeButton primary onPress={onSave} disabled={!isValid}>
        {t('addressBook.saveContact')}
      </SafeButton>
    )
  }

  return (
    <SafeButton secondary onPress={onEdit}>
      {t('addressBook.editContact')}
    </SafeButton>
  )
}
