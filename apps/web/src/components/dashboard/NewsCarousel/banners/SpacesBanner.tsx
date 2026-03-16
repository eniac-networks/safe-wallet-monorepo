import { Box, Button, Card, IconButton, Stack, Typography } from '@mui/material'
import SpacesIllustration from '@/public/images/common/spaces-illustration.png'
import Image from 'next/image'
import { SPACE_EVENTS, SPACE_LABELS } from '@/services/analytics/events/spaces'
import CloseIcon from '@mui/icons-material/Close'
import Track from '@/components/common/Track'
import css from './styles.module.css'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { AppRoutes } from '@/config/routes'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export const spacesBannerID = 'spacesBanner'

const SpacesBanner = ({ onDismiss }: { onDismiss: () => void }) => {
  const { t } = useTranslation()

  return (
    <Card className={css.banner}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Image
          className={css.bannerImage}
          src={SpacesIllustration}
          alt={t('dashboard.spacesIllustrationAlt')}
          width={95}
          height={95}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold" color="static.main" className={css.bannerText}>
            {t('dashboard.spacesBannerTitle')}
          </Typography>

          <Typography variant="body2" color="static.light" className={css.bannerText}>
            {t('dashboard.spacesBannerDescription')}
          </Typography>

          <Track {...SPACE_EVENTS.OPEN_SPACE_LIST_PAGE} label={SPACE_LABELS.safe_dashboard_banner}>
            <Link href={AppRoutes.welcome.spaces} passHref>
              <Button
                endIcon={<ChevronRightIcon fontSize="small" />}
                variant="text"
                size="compact"
                sx={{ mt: 1, p: 0.5 }}
                color="static"
              >
                {t('dashboard.tryNow')}
              </Button>
            </Link>
          </Track>
        </Box>
      </Stack>

      <Track {...SPACE_EVENTS.HIDE_DASHBOARD_WIDGET}>
        <IconButton className={css.closeButton} aria-label={t('common.close')} onClick={onDismiss}>
          <CloseIcon fontSize="small" color="border" />
        </IconButton>
      </Track>
    </Card>
  )
}

export default SpacesBanner
