import { useState } from 'react'
import { Button } from '@mui/material'
import type { GetSpaceResponse } from '@safe-global/store/gateway/AUTO_GENERATED/spaces'
import DeclineInviteDialog from './DeclineInviteDialog'
import css from './styles.module.css'
import { useTranslation } from 'react-i18next'

type DeclineButtonProps = {
  space: GetSpaceResponse
}

const DeclineButton = ({ space }: DeclineButtonProps) => {
  const { t } = useTranslation()
  const [declineOpen, setDeclineOpen] = useState(false)

  const handleDeclineInvite = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDeclineOpen(true)
  }

  const handleCloseDeclineDialog = () => {
    setDeclineOpen(false)
  }

  return (
    <>
      <Button
        className={css.inviteButton}
        variant="outlined"
        onClick={handleDeclineInvite}
        aria-label={t('spaces.decline')}
      >
        {t('spaces.decline')}
      </Button>
      {declineOpen && <DeclineInviteDialog space={space} onClose={handleCloseDeclineDialog} />}
    </>
  )
}

export default DeclineButton
