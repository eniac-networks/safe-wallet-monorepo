import { Dimensions, StyleSheet } from 'react-native'
import { getTokenValue, H1, Image, View } from 'tamagui'
import Signing from '@/assets/images/select-signer.png'
import PersonalisedUpdates from '@/assets/images/personalised-updates.png'

import TrackAnywhere from '@/assets/images/anywhere.png'
import { CarouselItem } from './CarouselItem'
import React from 'react'
import { TFunction } from 'i18next'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const maxGoodWidth = 375
const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
  anywhere: {
    height: Math.abs(windowHeight * 0.32),
  },
  signing: {
    height: Math.abs(windowHeight * 0.3),
  },
  notifications: {
    height: Math.abs(windowHeight * 0.32),
  },
  textContainer: {
    textAlign: 'center',
    flexDirection: 'column',
    letterSpacing: -0.1,
    color: getTokenValue('$color.textContrastDark'),
  },
})

export const getCarouselItems = (t: TFunction): CarouselItem[] => [
  {
    name: 'tracking',
    image: (
      <View height={300} width={'100%'}>
        <Image style={[styles.image, styles.anywhere]} source={TrackAnywhere} />
      </View>
    ),
    title: (
      <>
        <H1 style={styles.textContainer} fontWeight={600}>
          {t('onboarding.tracking.titleLine1')}
        </H1>
        <H1 style={styles.textContainer} fontWeight={600}>
          {t('onboarding.tracking.titleLine2')}
        </H1>
        <H1 style={styles.textContainer} fontWeight={600} color="$primary">
          {t('onboarding.tracking.titleLine3')}
        </H1>
      </>
    ),
    description: t('onboarding.tracking.description'),
  },
  {
    name: 'signing',
    image: (
      <View height={300} width={'100%'}>
        <Image style={[styles.image, styles.signing]} source={Signing} />
      </View>
    ),
    title: (
      <>
        <H1 style={styles.textContainer} fontWeight={600} marginHorizontal={windowWidth <= maxGoodWidth ? -10 : 0}>
          {t('onboarding.signing.titleLine1')}
        </H1>

        <H1 style={styles.textContainer} fontWeight={600}>
          {t('onboarding.signing.titleLine2')}
        </H1>
      </>
    ),
    description: t('onboarding.signing.description'),
  },
  {
    name: 'update-to-date',
    image: (
      <View height={300} width={'100%'}>
        <Image style={[styles.image, styles.signing]} source={PersonalisedUpdates} />
      </View>
    ),
    title: (
      <>
        <H1 style={styles.textContainer} fontWeight={600}>
          {t('onboarding.updates.titleLine1')}
        </H1>
        <H1 style={styles.textContainer} fontWeight={600}>
          {t('onboarding.updates.titleLine2')}
        </H1>
        <H1 style={styles.textContainer} fontWeight={600}>
          {t('onboarding.updates.titleLine3')}
        </H1>
      </>
    ),
    description: t('onboarding.updates.description'),
  },
]
