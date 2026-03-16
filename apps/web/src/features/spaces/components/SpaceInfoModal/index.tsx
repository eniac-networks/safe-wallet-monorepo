import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material'
import CheckIcon from '@/public/images/common/check.svg'
import CloseIcon from '@mui/icons-material/Close'
import CreateSpaceInfo from '@/public/images/spaces/create_space_info.png'
import Image from 'next/image'
import { AppRoutes } from '@/config/routes'
import Link from 'next/link'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS, SPACE_LABELS } from '@/services/analytics/events/spaces'
import ExternalLink from '@/components/common/ExternalLink'
import { useTranslation } from 'react-i18next'

const ListIcon = () => (
  <ListItemIcon
    sx={{
      alignSelf: 'flex-start',
      minWidth: '20px',
      marginRight: '16px',
      marginTop: '0',
      color: 'success.main',
      '& path:last-child': {
        fill: 'var(--color-success-main)',
      },
      backgroundColor: 'success.light',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <SvgIcon component={CheckIcon} inheritViewBox fontSize="small" sx={{ width: '12px', height: '12px' }} />
  </ListItemIcon>
)

const SPACE_HELP_ARTICLE_LINK = 'https://help.safe.global/en/articles/285386-spaces'

const SpaceInfoModal = ({
  showButtons = true,
  onClose,
  onCreateSpace,
}: {
  showButtons?: boolean
  onClose: () => void
  onCreateSpace?: () => void
}) => {
  const { t } = useTranslation()
  return (
    <Dialog open PaperProps={{ style: { width: '870px', maxWidth: '98%', borderRadius: '16px' } }} onClose={onClose}>
      <DialogContent dividers sx={{ p: 0, border: 0 }}>
        <Grid2 container>
          <Grid2 size={{ xs: 12, md: 6 }} p={5} display="flex" flexDirection="column">
            <Typography component="div" variant="h1" mb={1} position="relative">
              {t('spaces.introducingSpaces')}
              <Chip
                label={t('spaces.beta')}
                size="small"
                sx={{ ml: 1, fontWeight: 'normal', position: 'absolute', top: '0', right: '0' }}
              />
            </Typography>

            <Typography mt={2} mb={3}>
              {t('spaces.spaceCollabDescription')}
            </Typography>

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ListItem disablePadding>
                <ListIcon />
                {t('spaces.safeAccountsFeature')}
              </ListItem>

              <ListItem disablePadding>
                <ListIcon />
                {t('spaces.inviteMembersFeature')}
              </ListItem>

              <ListItem disablePadding>
                <ListIcon />
                {t('spaces.sharedDataFeature')}
              </ListItem>

              <ListItem disablePadding>
                <ListIcon />
                {t('spaces.comingSoonFeature')}
              </ListItem>
            </List>

            <Typography mt={1}>
              {t('spaces.readHelpArticlePrefix')}
              <ExternalLink href={SPACE_HELP_ARTICLE_LINK}>{t('spaces.spacesHelpArticle')}</ExternalLink>
            </Typography>

            {showButtons && (
              <Stack gap={2} mt={{ xs: 3, md: 'auto' }}>
                {onCreateSpace ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      trackEvent({ ...SPACE_EVENTS.CREATE_SPACE_MODAL, label: SPACE_LABELS.info_modal })
                      onClose()
                      onCreateSpace()
                    }}
                  >
                    {t('spaces.createASpace')}
                  </Button>
                ) : (
                  <Link href={AppRoutes.welcome.spaces} passHref legacyBehavior>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        trackEvent({ ...SPACE_EVENTS.OPEN_SPACE_LIST_PAGE, label: SPACE_LABELS.info_modal })
                      }
                    >
                      {t('spaces.createASpace')}
                    </Button>
                  </Link>
                )}

                <Button variant="text" color="primary" onClick={onClose}>
                  {t('spaces.maybeLater')}
                </Button>
              </Stack>
            )}
          </Grid2>

          <Grid2 size={6} display={{ xs: 'none', md: 'flex' }} justifyContent="center" flex={1} bgcolor="#121312">
            <Image src={CreateSpaceInfo} style={{ width: '100%' }} alt="An illustration of multiple safe accounts" />
          </Grid2>
        </Grid2>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 1,
            m: 1,
            color: '#ffffff',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogContent>
    </Dialog>
  )
}

export default SpaceInfoModal
