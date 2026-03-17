import Track from '@/components/common/Track'
import { CreateSafeOnNewChain } from '@/features/multichain/components/CreateSafeOnNewChain'
import { OVERVIEW_EVENTS, OVERVIEW_LABELS } from '@/services/analytics'
import { Button } from '@mui/material'
import { useState } from 'react'
import PlusIcon from '@/public/images/common/plus.svg'
import { useTranslation } from 'react-i18next'

export const AddNetworkButton = ({
  safeAddress,
  currentName,
  deployedChains,
}: {
  safeAddress: string
  currentName: string | undefined
  deployedChains: string[]
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Track {...OVERVIEW_EVENTS.ADD_NEW_NETWORK} label={OVERVIEW_LABELS.sidebar}>
        <Button data-testid="add-network-btn" variant="text" fullWidth onClick={() => setOpen(true)}>
          <PlusIcon /> {t('myAccounts.addAnotherNetwork')}
        </Button>
      </Track>

      {open && (
        <CreateSafeOnNewChain
          open={open}
          onClose={() => setOpen(false)}
          currentName={currentName}
          safeAddress={safeAddress}
          deployedChainIds={deployedChains}
        />
      )}
    </>
  )
}
