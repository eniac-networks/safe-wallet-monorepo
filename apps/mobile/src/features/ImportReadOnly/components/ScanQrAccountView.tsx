import React from 'react'
import { Text, View } from 'tamagui'
import { SafeButton } from '@/src/components/SafeButton'
import { SafeFontIcon } from '@/src/components/SafeFontIcon'
import { QrCamera } from '@/src/components/Camera'
import { ToastViewport } from '@tamagui/toast'
import { CameraPermissionStatus, Code } from 'react-native-vision-camera'
import { useTranslation } from 'react-i18next'

type QrCameraViewProps = {
  permission: CameraPermissionStatus
  isCameraActive: boolean
  onScan: (codes: Code[]) => void
  onEnterManuallyPress: () => void
  hasPermission: boolean
  onActivateCamera: () => void
}

export const QrCameraView = ({
  permission,
  isCameraActive,
  onScan,
  onEnterManuallyPress,
  hasPermission,
  onActivateCamera,
}: QrCameraViewProps) => {
  const { t } = useTranslation()
  return (
    <>
      <QrCamera
        permission={permission}
        hasPermission={hasPermission}
        isCameraActive={isCameraActive}
        onScan={onScan}
        onActivateCamera={onActivateCamera}
        heading={permission === 'denied' ? t('importReadOnly.cameraDisabled') : t('importReadOnly.scanQrCode')}
        footer={
          <>
            <Text textAlign={'center'}>
              {permission === 'denied' ? t('importReadOnly.cameraDisabledDesc') : t('importReadOnly.scanQrCodeDesc')}
            </Text>
            <View alignItems="center" marginTop="$5">
              <SafeButton
                secondary
                icon={<SafeFontIcon name="copy" size={18} />}
                onPress={onEnterManuallyPress}
                testID={'enter-manually'}
                size="$sm"
              >
                {t('importReadOnly.enterManually')}
              </SafeButton>
            </View>
          </>
        }
      />
      <ToastViewport multipleToasts={false} left={0} right={0} />
    </>
  )
}
