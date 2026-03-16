import Typography from '@mui/material/Typography'
import PagePlaceholder from '@/components/common/PagePlaceholder'
import AddCustomAppIcon from '@/public/images/apps/add-custom-app.svg'
import { BRAND_NAME } from '@/config/constants'
import { useTranslation } from 'react-i18next'

const SafeAppsZeroResultsPlaceholder = ({ searchQuery }: { searchQuery: string }) => {
  const { t } = useTranslation()
  return (
    <PagePlaceholder
      img={<AddCustomAppIcon />}
      text={
        <Typography variant="body1" color="primary.light" m={2} maxWidth="600px">
          {t('safeApps.noAppsFound', { query: searchQuery, brandName: BRAND_NAME })}
        </Typography>
      }
    />
  )
}

export default SafeAppsZeroResultsPlaceholder
