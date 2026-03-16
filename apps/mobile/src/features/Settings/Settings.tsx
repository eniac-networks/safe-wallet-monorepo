import React, { useCallback } from 'react'
import { H2, ScrollView, Text, Theme, View, XStack, YStack } from 'tamagui'
import { SafeFontIcon } from '@/src/components/SafeFontIcon/SafeFontIcon'
import { SafeListItem } from '@/src/components/SafeListItem'
import { Skeleton } from 'moti/skeleton'
import { Pressable, TouchableOpacity } from 'react-native'
import { useTheme } from '@/src/theme/hooks/useTheme'
import { EthAddress } from '@/src/components/EthAddress'
import { SafeState } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import { Address } from '@/src/types/address'
import { router } from 'expo-router'
import { IdenticonWithBadge } from '@/src/features/Settings/components/IdenticonWithBadge'

import { Navbar } from '@/src/features/Settings/components/Navbar/Navbar'
import { type Contact } from '@/src/store/addressBookSlice'
import { Alert } from '@/src/components/Alert'

import { useDefinedActiveSafe } from '@/src/store/hooks/activeSafe'
import { useCopyAndDispatchToast } from '@/src/hooks/useCopyAndDispatchToast'
import { useTranslation } from 'react-i18next'

interface SettingsProps {
  data: SafeState
  address: `0x${string}`
  displayDevMenu: boolean
  onImplementationTap: () => void
  contact: Contact | null
  isLatestVersion: boolean
  latestSafeVersion: string
  isUnsupportedMasterCopy: boolean
}

export const Settings = ({
  address,
  data,
  onImplementationTap,
  displayDevMenu,
  contact,
  isLatestVersion,
  latestSafeVersion,
  isUnsupportedMasterCopy,
}: SettingsProps) => {
  const { t } = useTranslation()
  const activeSafe = useDefinedActiveSafe()
  const copy = useCopyAndDispatchToast()
  const { owners = [], threshold, implementation } = data
  const { colorScheme } = useTheme()

  const onPressAddressCopy = useCallback(() => {
    copy(activeSafe.address)
  }, [activeSafe.address])

  return (
    <>
      <Theme name={'settings'}>
        <Navbar safeAddress={address} />
        <ScrollView
          style={{
            marginTop: -20,
            paddingTop: 0,
          }}
          contentContainerStyle={{
            marginTop: -15,
          }}
        >
          <YStack flex={1} paddingTop={'$10'}>
            <Skeleton.Group show={!owners.length}>
              <YStack alignItems="center" space="$3" marginBottom="$6">
                <IdenticonWithBadge
                  address={address}
                  badgeContent={owners.length ? `${threshold}/${owners.length}` : ''}
                />
                <H2 color="$foreground" fontWeight={600} numberOfLines={1}>
                  {contact?.name || t('settings.unnamedSafe')}
                </H2>
                <View>
                  <TouchableOpacity onPress={onPressAddressCopy}>
                    <EthAddress
                      address={address as Address}
                      copy
                      textProps={{
                        color: '$colorSecondary',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </YStack>

              <XStack justifyContent="center" marginBottom="$6">
                <YStack
                  alignItems="center"
                  backgroundColor={'$background'}
                  paddingTop={'$3'}
                  paddingBottom={'$2'}
                  borderRadius={'$6'}
                  width={80}
                  marginRight={'$2'}
                >
                  <View width={30}>
                    <Skeleton colorMode={colorScheme}>
                      <Text fontWeight="bold" textAlign="center" fontSize={'$4'}>
                        {owners.length}
                      </Text>
                    </Skeleton>
                  </View>
                  <Text color="$colorHover" fontSize={'$3'}>
                    {t('settings.signers')}
                  </Text>
                </YStack>

                <YStack
                  alignItems="center"
                  backgroundColor={'$background'}
                  paddingTop={'$3'}
                  paddingBottom={'$2'}
                  borderRadius={'$6'}
                  width={80}
                >
                  <View width={30}>
                    <Skeleton colorMode={colorScheme}>
                      <Text fontWeight="bold" textAlign="center" fontSize={'$4'}>
                        {threshold}/{owners.length}
                      </Text>
                    </Skeleton>
                  </View>
                  <Text color="$colorHover" fontSize={'$3'}>
                    {t('settings.threshold')}
                  </Text>
                </YStack>
              </XStack>

              <YStack>
                <View padding="$4" borderRadius="$3" gap={'$2'}>
                  <Text color="$colorSecondary" fontWeight={500}>
                    {t('settings.members')}
                  </Text>
                  <Pressable
                    style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                    onPress={() => {
                      router.push('/signers')
                    }}
                  >
                    <SafeListItem
                      label={t('settings.signers')}
                      leftNode={<SafeFontIcon name={'owners'} color={'$colorSecondary'} />}
                      rightNode={
                        <View flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                          <Skeleton colorMode={colorScheme} height={17}>
                            <Text minWidth={15} marginRight={'$3'} color={'$colorSecondary'}>
                              {owners.length}
                            </Text>
                          </Skeleton>
                          <View>
                            <SafeFontIcon name={'chevron-right'} />
                          </View>
                        </View>
                      }
                    />
                  </Pressable>
                </View>

                <View backgroundColor="$backgroundDark" padding="$4" borderRadius="$3" gap={'$2'}>
                  <Text color="$colorSecondary">{t('settings.general')}</Text>
                  <View backgroundColor={'$background'} borderRadius={'$3'}>
                    <Pressable
                      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                      onPress={() => {
                        router.push('/notifications-settings')
                      }}
                    >
                      <SafeListItem
                        label={t('settings.notifications')}
                        leftNode={<SafeFontIcon name={'bell'} color={'$colorSecondary'} />}
                        rightNode={<SafeFontIcon name={'chevron-right'} />}
                      />
                    </Pressable>
                  </View>
                </View>

                {displayDevMenu && (
                  <View backgroundColor="$backgroundDark" padding="$4" borderRadius="$3" gap={'$2'}>
                    <Text color="$foreground">{t('settings.developer')}</Text>
                    <View backgroundColor={'$background'} borderRadius={'$3'}>
                      <Pressable
                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                        onPress={() => {
                          router.push('/developer')
                        }}
                      >
                        <SafeListItem
                          label={t('settings.developer')}
                          leftNode={<SafeFontIcon name={'alert-triangle'} color={'$colorSecondary'} />}
                          rightNode={<SafeFontIcon name={'chevron-right'} />}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
              </YStack>
            </Skeleton.Group>

            {/* Footer */}
            <Pressable
              onPress={onImplementationTap}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '$2',
                marginTop: 14,
              }}
            >
              {isLatestVersion && <SafeFontIcon testID="check-icon" name={'check-filled'} color={'$success'} />}
              <Text marginLeft={'$2'} textAlign="center" color="$colorSecondary">
                {implementation?.name}{' '}
                {isLatestVersion
                  ? t('settings.latestVersionValue')
                  : t('settings.latestVersionUpgrade', { version: latestSafeVersion })}
              </Text>
            </Pressable>

            {isUnsupportedMasterCopy && (
              <View flex={1} padding="$5">
                <Alert
                  type="warning"
                  info={t('settings.baseContractNotSupportedInfo')}
                  message={t('settings.baseContractNotSupported')}
                />
              </View>
            )}
          </YStack>
        </ScrollView>
      </Theme>
    </>
  )
}
