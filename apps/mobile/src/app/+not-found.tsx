import React from 'react'
import { Link, Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { Text, H1 } from 'tamagui'
import { useTranslation } from 'react-i18next'

export default function NotFoundScreen() {
  const { t } = useTranslation()
  return (
    <>
      <Stack.Screen options={{ title: t('common.oops') }} />
      <View style={styles.container}>
        <H1>{t('common.screenDoesNotExist')}</H1>
        <Link href="/" style={styles.link}>
          <Text>{t('common.goToHomeScreen')}</Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
