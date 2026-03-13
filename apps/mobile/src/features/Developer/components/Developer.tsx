import { View, Text, ScrollView, H2 } from 'tamagui'
import { CopyButton } from '@/src/components/CopyButton'
import { type Info } from '@/src/features/Developer/types'
import { getCrashlytics } from '@react-native-firebase/crashlytics'
import { SafeButton } from '@/src/components/SafeButton'
import { useTranslation } from 'react-i18next'

type DeveloperProps = {
  info: Info
}

type InfoProps = {
  info: Record<string, string>
}
const Info = ({ info }: InfoProps) => {
  return (
    <View>
      {Object.keys(info).map((key) => {
        const value = info[key]
        return (
          <View key={key} marginBottom={'$2'}>
            <Text fontWeight={600}>{key}: </Text>
            <View padding={'$2'} borderRadius={'$6'} flex={1} flexDirection={'row'} justifyContent={'space-between'}>
              <Text flex={1}>{value}</Text>
              <View>
                <CopyButton value={value} color={'$primary'} />
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}
export const Developer = ({ info }: DeveloperProps) => {
  const { t } = useTranslation()
  return (
    <View flex={1}>
      <ScrollView paddingHorizontal={'$4'}>
        <View>
          <H2>{t('developer.appInfo')}</H2>
          <Info info={info.application} />
        </View>
        <View marginTop={'$2'}>
          <H2>{t('developer.deviceInfo')}</H2>
          <Info info={info.device} />
        </View>
        <View marginTop={'$4'}>
          <Text>{t('developer.crashWarning')}</Text>
          <SafeButton onPress={() => getCrashlytics().crash()}>{t('developer.crashApp')}</SafeButton>
        </View>
      </ScrollView>
    </View>
  )
}
