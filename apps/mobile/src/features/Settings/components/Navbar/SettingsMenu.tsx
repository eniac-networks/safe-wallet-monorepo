import { getTokenValue, Theme, useTheme, View } from 'tamagui'
import { Linking, Platform, Pressable, Alert } from 'react-native'
import { SafeFontIcon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import React from 'react'
import { getExplorerLink } from '@safe-global/utils/utils/gateway'
import { useCopyAndDispatchToast } from '@/src/hooks/useCopyAndDispatchToast'
import { useToastController } from '@tamagui/toast'
import { selectChainById } from '@/src/store/chains'
import { RootState } from '@/src/store'
import { useAppSelector } from '@/src/store/hooks'
import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { useEditAccountItem } from '@/src/features/AccountsSheet/AccountItem/hooks/useEditAccountItem'
import { type Address } from '@/src/types/address'
import { router } from 'expo-router'
import { FloatingMenu } from '../FloatingMenu'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { trackEvent } from '@/src/services/analytics/firebaseAnalytics'
import { createAppSettingsOpenEvent, createSettingsMenuActionEvent } from '@/src/services/analytics/events/settings'
import { useTranslation } from 'react-i18next'
type Props = {
  safeAddress: string | undefined
}
export const SettingsMenu = ({ safeAddress }: Props) => {
  const toast = useToastController()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const activeSafe = useDefinedActiveSafe()
  const { deleteSafe } = useEditAccountItem()
  const activeChain = useAppSelector((state: RootState) => selectChainById(state, activeSafe.chainId))
  const copyAndDispatchToast = useCopyAndDispatchToast()
  const theme = useTheme()
  const color = theme.color?.get()
  const colorError = 'red'

  if (!safeAddress) {
    return null
  }

  return (
    <Theme name="navbar">
      <View
        style={{
          flexDirection: 'row',
          paddingTop: getTokenValue('$3') + insets.top,
          paddingHorizontal: 16,
          paddingBottom: getTokenValue('$2'),
          backgroundColor: '$background',
          marginRight: 4,
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
          zIndex: 1,
        }}
      >
        <Pressable
          testID={'settings-screen-header-app-settings-button'}
          hitSlop={6}
          onPressIn={() => {
            try {
              const event = createAppSettingsOpenEvent()
              trackEvent(event)
            } catch (error) {
              console.error('Error tracking app settings open event:', error)
            }
            router.push('/app-settings')
          }}
        >
          <View
            backgroundColor={'$backgroundSkeleton'}
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius={16}
            height={32}
            width={32}
          >
            <SafeFontIcon name={'settings'} size={20} color={'$color'} />
          </View>
        </Pressable>

        <FloatingMenu
          onPressAction={({ nativeEvent }) => {
            const action = nativeEvent.event as 'rename' | 'explorer' | 'copy' | 'share' | 'remove'

            // Track analytics for supported actions (copy is already tracked via useCopyAndDispatchToast)
            if (action !== 'copy') {
              try {
                const event = createSettingsMenuActionEvent(action)
                trackEvent(event)
              } catch (error) {
                console.error('Error tracking settings menu action:', error)
              }
            }

            if (nativeEvent.event === 'rename') {
              router.push({
                pathname: '/signers/[address]',
                params: { address: safeAddress, editMode: 'true', title: t('settings.renameSafe') },
              })
            }

            if (nativeEvent.event === 'explorer') {
              const link = getExplorerLink(safeAddress, activeChain.blockExplorerUriTemplate)
              Linking.openURL(link.href)
            }

            if (nativeEvent.event === 'copy') {
              copyAndDispatchToast(safeAddress)
            }

            if (nativeEvent.event === 'remove') {
              Alert.alert(t('settings.removeAccount'), t('settings.removeAccountConfirm'), [
                {
                  text: t('common.cancel'),
                  style: 'cancel',
                },
                {
                  text: t('common.remove'),
                  onPress: async () => {
                    try {
                      await deleteSafe(safeAddress as Address)
                      toast.show(t('settings.safeDeleted', { address: safeAddress }), {
                        native: true,
                        duration: 2000,
                      })
                    } catch (error) {
                      if (error instanceof Error && error.message === 'User cancelled deletion') {
                        return
                      }
                      console.error('Error deleting safe:', error)
                      toast.show(t('settings.failedToDelete'), {
                        native: true,
                        duration: 3000,
                      })
                    }
                  },
                  style: 'destructive',
                },
              ])
            }

            if (nativeEvent.event === 'share') {
              router.push('/share')
            }
          }}
          actions={[
            {
              id: 'rename',
              title: t('settings.rename'),
              image: Platform.select({
                ios: 'pencil',
                android: 'baseline_create_24',
              }),
              imageColor: Platform.select({ ios: color, android: '#000' }),
            },
            {
              id: 'explorer',
              title: t('settings.viewOnExplorer'),
              image: Platform.select({
                ios: 'link',
                android: 'baseline_explore_24',
              }),
              imageColor: Platform.select({ ios: color, android: '#000' }),
            },
            {
              id: 'copy',
              title: t('settings.copyAddress'),
              image: Platform.select({
                ios: 'doc.on.doc',
                android: 'baseline_auto_awesome_motion_24',
              }),
              imageColor: Platform.select({ ios: color, android: '#000' }),
            },
            {
              id: 'share',
              title: t('settings.shareAccount'),
              image: Platform.select({
                ios: 'square.and.arrow.up.on.square',
                android: 'baseline_arrow_outward_24',
              }),
              imageColor: Platform.select({ ios: color, android: '#000' }),
            },
            {
              id: 'remove',
              title: t('settings.removeAccount'),
              attributes: {
                destructive: true,
              },
              image: Platform.select({
                ios: 'trash',
                android: 'baseline_delete_24',
              }),
              imageColor: colorError,
            },
          ]}
        >
          <Pressable hitSlop={6} testID={'settings-screen-header-more-settings-button'}>
            <View
              backgroundColor={'$backgroundSkeleton'}
              alignItems={'center'}
              justifyContent={'center'}
              borderRadius={16}
              height={32}
              width={32}
            >
              <SafeFontIcon name={'options-horizontal'} size={20} color={'$color'} />
            </View>
          </Pressable>
        </FloatingMenu>
      </View>
    </Theme>
  )
}
