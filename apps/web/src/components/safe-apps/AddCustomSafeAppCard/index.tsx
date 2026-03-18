import { useState } from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import type { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'
import { useTranslation } from 'react-i18next'

import AddCustomAppIcon from '@/public/images/apps/add-custom-app.svg'
import { AddCustomAppModal } from '@/components/safe-apps/AddCustomAppModal'

type Props = { onSave: (data: SafeAppData) => void; safeAppList: SafeAppData[] }

const AddCustomSafeAppCard = ({ onSave, safeAppList }: Props) => {
  const { t } = useTranslation()
  const [addCustomAppModalOpen, setAddCustomAppModalOpen] = useState<boolean>(false)

  return (
    <>
      <Card>
        <Box p="48px 12px" display="flex" flexDirection="column" alignItems="center">
          {/* Add Custom Safe App Icon */}
          <AddCustomAppIcon alt="Add Custom Safe App card" />

          {/*  Add Custom Safe App Button */}
          <Button
            variant="contained"
            size="small"
            onClick={() => setAddCustomAppModalOpen(true)}
            sx={{
              mt: 3,
            }}
          >
            {t('safeApps.addCustomApp')}
          </Button>
        </Box>
      </Card>

      {/*  Add Custom Safe App Modal */}
      <AddCustomAppModal
        open={addCustomAppModalOpen}
        onClose={() => setAddCustomAppModalOpen(false)}
        onSave={onSave}
        safeAppsList={safeAppList}
      />
    </>
  )
}

export default AddCustomSafeAppCard
