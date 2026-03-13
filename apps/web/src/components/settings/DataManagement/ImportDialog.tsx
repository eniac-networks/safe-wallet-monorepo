import { undeployedSafesSlice } from '@/features/counterfactual/store/undeployedSafesSlice'
import { DialogContent, Alert, AlertTitle, DialogActions, Button, Box, SvgIcon } from '@mui/material'
import type { ReactElement, Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import ModalDialog from '@/components/common/ModalDialog'
import { useAppDispatch } from '@/store'
import { trackEvent, SETTINGS_EVENTS, OVERVIEW_EVENTS, OVERVIEW_LABELS } from '@/services/analytics'
import { addedSafesSlice } from '@/store/addedSafesSlice'
import { addressBookSlice } from '@/store/addressBookSlice'
import { safeAppsSlice } from '@/store/safeAppsSlice'
import { settingsSlice } from '@/store/settingsSlice'
import { FileListCard } from '@/components/settings/DataManagement/FileListCard'
import { useGlobalImportJsonParser } from '@/components/settings/DataManagement/useGlobalImportFileParser'
import FileIcon from '@/public/images/settings/data/file.svg'
import { ImportFileUpload } from '@/components/settings/DataManagement/ImportFileUpload'
import { showNotification } from '@/store/notificationsSlice'
import { visitedSafesSlice } from '@/store/visitedSafesSlice'

import css from './styles.module.css'

export const ImportDialog = ({
  onClose,
  fileName = '',
  setFileName,
  jsonData = '',
  setJsonData,
}: {
  onClose?: () => void
  fileName: string | undefined
  setFileName: Dispatch<SetStateAction<string | undefined>>
  jsonData: string | undefined
  setJsonData: Dispatch<SetStateAction<string | undefined>>
}): ReactElement => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { addedSafes, addressBook, addressBookEntriesCount, settings, safeApps, undeployedSafes, visitedSafes, error } =
    useGlobalImportJsonParser(jsonData)

  const isDisabled =
    (!addedSafes && !addressBook && !settings && !safeApps && !undeployedSafes && !visitedSafes) || !!error

  const handleClose = () => {
    setFileName(undefined)
    setJsonData(undefined)
    onClose?.()
  }

  const handleImport = () => {
    if (addressBook) {
      dispatch(addressBookSlice.actions.setAddressBook(addressBook))
      trackEvent({
        ...SETTINGS_EVENTS.DATA.IMPORT_ADDRESS_BOOK,
        label: addressBookEntriesCount,
      })
    }
    if (addedSafes) {
      dispatch(addedSafesSlice.actions.setAddedSafes(addedSafes))
      trackEvent({
        ...OVERVIEW_EVENTS.IMPORT_DATA,
        label: OVERVIEW_LABELS.settings,
      })
    }

    if (settings) {
      dispatch(settingsSlice.actions.setSettings(settings))
      trackEvent(SETTINGS_EVENTS.DATA.IMPORT_SETTINGS)
    }

    if (safeApps) {
      dispatch(safeAppsSlice.actions.setSafeApps(safeApps))
      trackEvent(SETTINGS_EVENTS.DATA.IMPORT_SAFE_APPS)
    }

    if (undeployedSafes) {
      dispatch(undeployedSafesSlice.actions.addUndeployedSafes(undeployedSafes))
      trackEvent(SETTINGS_EVENTS.DATA.IMPORT_UNDEPLOYED_SAFES)
    }

    if (visitedSafes) {
      dispatch(visitedSafesSlice.actions.setVisitedSafes(visitedSafes))
      trackEvent(SETTINGS_EVENTS.DATA.IMPORT_VISITED_SAFES)
    }

    dispatch(
      showNotification({
        variant: 'success',
        groupKey: 'global-import-success',
        message: t('settings.successfullyImported'),
      }),
    )

    handleClose()
  }

  return (
    <ModalDialog open onClose={handleClose} dialogTitle={t('settings.dataImport')} hideChainIndicator>
      <DialogContent>
        {!jsonData || !fileName ? (
          <Box mt={2}>
            <ImportFileUpload setFileName={setFileName} setJsonData={setJsonData} />
          </Box>
        ) : (
          <>
            <FileListCard
              avatar={
                <Box sx={{ borderRadius: ({ shape }) => `${shape.borderRadius}px` }}>
                  <SvgIcon
                    component={FileIcon}
                    inheritViewBox
                    fontSize="small"
                    sx={{ fill: 'none', display: 'block' }}
                  />
                </Box>
              }
              title={<b>{fileName}</b>}
              className={css.header}
              addedSafes={addedSafes}
              addressBook={addressBook}
              settings={settings}
              safeApps={safeApps}
              visitedSafes={visitedSafes}
              undeployedSafes={undeployedSafes}
              error={error}
              showPreview
            />
            {!isDisabled && (
              <Alert severity="warning">
                <AlertTitle sx={{ fontWeight: 700 }}>{t('settings.overwriteDataTitle')}</AlertTitle>
                {t('settings.overwriteDataDescription')}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button data-testid="dialog-cancel-btn" onClick={handleClose}>
          {t('common.cancel')}
        </Button>
        <Button
          data-testid="dialog-import-btn"
          onClick={handleImport}
          variant="contained"
          disableElevation
          disabled={isDisabled}
        >
          {t('settings.import')}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}
