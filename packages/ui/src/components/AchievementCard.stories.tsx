import { Meta, StoryObj } from '@storybook/react'
import { User } from '@tamagui/lucide-icons'

import { ChapterLectureCard } from './ChapterLectureCard'

const meta: Meta<typeof ChapterLectureCard> = {
  title: 'ui/AchievementCard',
  parameters: { layout: 'centered' },
  component: ChapterLectureCard,
}

type Story = StoryObj<typeof ChapterLectureCard>

export const Basic: Story = {
  args: {
    w: 320,
    icon: User,
    title: 'Get New Users',
    progress: {
      current: 10,
      full: 100,
      label: 'Things',
    },
    action: {
      text: 'Boost your community',
      props: { href: '#', accessibilityRole: 'link', onPress: () => {} }, // comes from solito's useLink
    },
  },
}

export default meta
