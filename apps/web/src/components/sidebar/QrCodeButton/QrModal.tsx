import { type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Switch, DialogContent, FormControlLabel, Typography } from '@mui/material'
import ModalDialog from '@/components/common/ModalDialog'
import useSafeAddress from '@/hooks/useSafeAddress'
import { useCurrentChain } from '@/hooks/useChains'
import QRCode from '@/components/common/QRCode'
import EthHashInfo from '@/components/common/EthHashInfo'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectSettings, setQrShortName } from '@/store/settingsSlice'

const QrModal = ({ onClose }: { onClose: () => void }): ReactElement => {
  const { t } = useTranslation()
  const safeAddress = useSafeAddress()
  const chain = useCurrentChain()
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()
  const qrPrefix = settings.shortName.qr ? `${chain?.shortName}:` : ''
  const qrCode = `${qrPrefix}${safeAddress}`
  const chainName = chain?.chainName || ''
  const nativeToken = chain?.nativeCurrency.symbol || ''

  return (
    <ModalDialog open dialogTitle={t('qrModal.receiveAssets')} onClose={onClose} hideChainIndicator>
      <DialogContent>
        <Box bgcolor={chain?.theme.backgroundColor} color={chain?.theme.textColor} px={3} py={2} mx={-3}>
          {t('qrModal.networkWarning', { chainName })}
        </Box>

        <Typography my={2}>{t('qrModal.depositInstruction', { nativeToken })}</Typography>

        <Box display="flex" flexDirection="column" flexWrap="wrap" justifyContent="center" alignItems="center" my={2}>
          <Box mt={1} mb={1} p={1} border="1px solid" borderColor="border.main" borderRadius={1}>
            <QRCode value={qrCode} size={164} />
          </Box>

          <FormControlLabel
            control={
              <Switch checked={settings.shortName.qr} onChange={(e) => dispatch(setQrShortName(e.target.checked))} />
            }
            label={t('qrModal.chainPrefix', { shortName: chain?.shortName })}
          />

          <Box mt={2}>
            <EthHashInfo
              address={safeAddress}
              shortAddress={false}
              showPrefix={qrPrefix.length > 0}
              hasExplorer
              showCopyButton
            />
          </Box>
        </Box>
      </DialogContent>
    </ModalDialog>
  )
}

export default QrModal
