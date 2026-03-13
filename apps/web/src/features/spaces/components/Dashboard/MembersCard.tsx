import classnames from 'classnames'
import css from '@/features/spaces/components/Dashboard/styles.module.css'
import MemberIcon from '@/public/images/spaces/member.svg'
import { Typography, Paper, Box, Button, SvgIcon, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useIsAdmin } from '@/features/spaces/hooks/useSpaceMembers'
import AddMemberModal from '../AddMemberModal'
import { SPACE_LABELS } from '@/services/analytics/events/spaces'
import Track from '@/components/common/Track'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { useTranslation } from 'react-i18next'

const MembersCard = () => {
  const { t } = useTranslation()
  const [openAddMembersModal, setOpenAddMembersModal] = useState(false)
  const isAdmin = useIsAdmin()
  const isButtonDisabled = !isAdmin

  const handleInviteClick = () => {
    setOpenAddMembersModal(true)
  }

  return (
    <>
      <Paper sx={{ p: 3, borderRadius: '12px' }}>
        <Box position="relative" width={1}>
          <Box className={classnames(css.iconBG, css.iconBGBlue)}>
            <SvgIcon component={MemberIcon} inheritViewBox color="info" />
          </Box>
          <Tooltip title={isButtonDisabled ? t('spaces.adminRequiredToAddMembers') : ''} placement="top">
            <Box component="span" sx={{ position: 'absolute', top: 0, right: 0 }}>
              <Track {...SPACE_EVENTS.ADD_MEMBER_MODAL} label={SPACE_LABELS.space_dashboard_card}>
                <Button
                  data-testid="add-member-button"
                  onClick={handleInviteClick}
                  variant={isButtonDisabled ? 'contained' : 'outlined'}
                  size="compact"
                  aria-label="Invite team members"
                  disabled={isButtonDisabled}
                >
                  {t('spaces.addMembers')}
                </Button>
              </Track>
            </Box>
          </Tooltip>
        </Box>
        <Box>
          <Typography variant="body1" color="text.primary" fontWeight={700} mb={1}>
            {t('spaces.addMembers')}
          </Typography>
          <Typography variant="body2" color="primary.light">
            {t('spaces.inviteMembersDescription')}
          </Typography>
        </Box>
      </Paper>
      {openAddMembersModal && <AddMemberModal onClose={() => setOpenAddMembersModal(false)} />}
    </>
  )
}

export default MembersCard
