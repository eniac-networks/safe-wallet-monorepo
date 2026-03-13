import { useMemo } from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'tamagui'
import { useTranslation } from 'react-i18next'

export const useSignersActions = (disableImport: boolean) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const color = theme.color?.get()
  const actions = useMemo(
    () => [
      {
        id: 'rename',
        title: t('settings.rename'),
        image: Platform.select({
          ios: 'pencil',
          android: 'baseline_create_24',
        }),
        imageColor: Platform.select({ ios: color, android: color }),
      },
      {
        id: 'copy',
        title: t('settings.copyAddress'),
        image: Platform.select({
          ios: 'doc.on.doc',
          android: 'baseline_content_copy_24',
        }),
        imageColor: Platform.select({ ios: color, android: color }),
      },
      !disableImport && {
        id: 'import',
        title: t('signers.importSigner'),
        image: Platform.select({
          ios: 'square.and.arrow.up.on.square',
          android: 'baseline_arrow_outward_24',
        }),
        imageColor: Platform.select({ ios: color, android: color }),
      },
    ],
    [color, disableImport, t],
  )

  return actions
}
