import React from 'react'
import { OnboardingCarousel } from './components/OnboardingCarousel'
import { getCarouselItems } from './components/OnboardingCarousel/items'
import { useTranslation } from 'react-i18next'

export function Onboarding() {
  const { t } = useTranslation()
  return <OnboardingCarousel items={getCarouselItems(t)} />
}
