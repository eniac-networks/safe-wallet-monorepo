import { useState, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LanguageIcon from '@mui/icons-material/Language'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n'
import { useAppDispatch } from '@/store'
import { setLocale } from '@/store/settingsSlice'

const LanguageSwitcher = (): ReactElement => {
  const { i18n, t } = useTranslation()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang)
    dispatch(setLocale(lang))
    handleClose()
  }

  return (
    <>
      <Tooltip title={t('language.switchLanguage')}>
        <IconButton onClick={handleOpen} size="small" color="default" aria-label={t('language.label')}>
          <LanguageIcon fontSize="medium" sx={{ color: isDarkMode ? '#fff' : '#000' }} />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <MenuItem
            key={code}
            selected={i18n.language === code || i18n.language.startsWith(code)}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
          >
            <Typography variant="body2">{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default LanguageSwitcher
