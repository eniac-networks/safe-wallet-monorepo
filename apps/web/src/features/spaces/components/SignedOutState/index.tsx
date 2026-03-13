import { Box, Typography } from '@mui/material'
import css from '@/features/spaces/components/Dashboard/styles.module.css'
import SignInButton from '@/features/spaces/components/SignInButton'
import { useTranslation } from 'react-i18next'

const SignedOutState = () => {
  const { t } = useTranslation()
  return (
    <Box className={css.content}>
      <Box textAlign="center" className={css.contentWrapper}>
        <Box className={css.contentInner}>
          <Typography fontWeight={700} mb={2}>
            {t('spaces.signInToSeeContent')}
          </Typography>

          <Typography color="text.secondary" mb={2}>
            {t('spaces.signInDescription')}
          </Typography>

          <SignInButton />
        </Box>
      </Box>
    </Box>
  )
}

export default SignedOutState
