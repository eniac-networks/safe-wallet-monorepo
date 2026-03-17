import ModalDialog from '@/components/common/ModalDialog'
import { AppRoutes } from '@/config/routes'
import CSVAirdropLogo from '@/public/images/apps/csv-airdrop-app-logo.svg'
import { Button, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const CSVAirdropAppModal = ({ onClose, appUrl }: { onClose: () => void; appUrl?: string }): ReactElement => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <ModalDialog
      data-testid="csvairdrop-dialog"
      open
      onClose={onClose}
      dialogTitle={t('tokenTransfer.limitReached')}
      hideChainIndicator
      maxWidth="xs"
    >
      <DialogContent sx={{ mt: 3, textAlign: 'center' }}>
        <Grid>
          <CSVAirdropLogo />
          <Typography fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
            {t('tokenTransfer.useCsvAirdrop')}
          </Typography>
          <Typography variant="body2">{t('tokenTransfer.csvAirdropMsg')}</Typography>
        </Grid>
      </DialogContent>
      {appUrl && (
        <DialogActions style={{ textAlign: 'center', display: 'block' }}>
          <Link
            href={{
              pathname: AppRoutes.apps.open,
              query: {
                safe: router.query.safe,
                appUrl,
              },
            }}
            passHref
          >
            <Button variant="contained" data-testid="open-app-btn">
              {t('tokenTransfer.openCsvAirdrop')}
            </Button>
          </Link>
        </DialogActions>
      )}
    </ModalDialog>
  )
}

export default CSVAirdropAppModal
