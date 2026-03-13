import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { OnboardingCarousel } from './OnboardingCarousel'
import { getCarouselItems } from './items'
import { useTranslation } from 'react-i18next'

const meta: Meta<typeof OnboardingCarousel> = {
  title: 'Carousel',
  component: OnboardingCarousel,
}

export default meta

type Story = StoryObj<typeof OnboardingCarousel>

export const Default: Story = {
  render: function Render(args) {
    const { t } = useTranslation()
    return <OnboardingCarousel {...args} items={getCarouselItems(t)} />
  },
}
