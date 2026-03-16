import React from 'react'
import { Grid, SvgIcon, Typography } from '@mui/material'
import css from './styles.module.css'
import CheckFilled from '@/public/images/common/check-filled.svg'

import WelcomeLogin from './WelcomeLogin'
import { useTranslation } from 'react-i18next'

const BulletListItem = ({ text }: { text: string }) => (
  <li>
    <SvgIcon className={css.checkIcon} component={CheckFilled} inheritViewBox />
    <Typography
      sx={{
        color: 'static.main',
        fontWeight: 700,
      }}
    >
      {text}
    </Typography>
  </li>
)

const NewSafe = () => {
  const { t } = useTranslation()
  return (
    <>
      <Grid
        container
        spacing={3}
        direction="row-reverse"
        sx={{
          p: 3,
          pb: 0,
          flex: 1,
        }}
      >
        <Grid item xs={12} lg={6}>
          <WelcomeLogin />
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            flex: 1,
          }}
        >
          <div className={css.content}>
            <Typography
              variant="h1"
              sx={{
                fontSize: [44, null, 52],
                lineHeight: 1,
                letterSpacing: -1.5,
                color: 'static.main',
              }}
            >
              {t('welcome.unlockOwnership')}
            </Typography>

            <Typography
              sx={{
                mb: 1,
                color: 'static.main',
              }}
            >
              {t('welcome.platformDesc')}
            </Typography>

            <ul className={css.bulletList}>
              <BulletListItem text={t('welcome.securityBullet')} />
              <BulletListItem text={t('welcome.modulesBullet')} />
              <BulletListItem text={t('welcome.appsBullet')} />
            </ul>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default NewSafe
