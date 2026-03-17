import { SvgIcon, Typography } from '@mui/material'
import EditIcon from '@/public/images/common/edit.svg'
import css from './styles.module.css'
import { useTranslation } from 'react-i18next'

export enum ConfirmationTitleTypes {
  sign = 'confirm',
  execute = 'execute',
  propose = 'propose',
}

const ConfirmationTitle = ({ isCreation, variant }: { isCreation?: boolean; variant: ConfirmationTitleTypes }) => {
  const { t } = useTranslation()

  const variantLabelMap: Record<ConfirmationTitleTypes, string> = {
    [ConfirmationTitleTypes.sign]: t('common.confirm'),
    [ConfirmationTitleTypes.execute]: t('transactions.execute'),
    [ConfirmationTitleTypes.propose]: t('transactions.propose'),
  }
  const variantLabel = variantLabelMap[variant]

  return (
    <div className={css.wrapper}>
      <div className={`${css.icon} ${variant === ConfirmationTitleTypes.sign ? css.sign : css.execute}`}>
        <SvgIcon component={EditIcon} inheritViewBox fontSize="small" />
      </div>
      <div>
        <Typography variant="h5">{variantLabel}</Typography>
        <Typography variant="body2">
          {isCreation
            ? t('transactions.youreAboutToCreate', { variant: variantLabel })
            : t('transactions.youreAboutTo', { variant: variantLabel })}
        </Typography>
      </div>
    </div>
  )
}

export default ConfirmationTitle
