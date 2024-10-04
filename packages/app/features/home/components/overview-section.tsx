import { Button, H4, OverviewCard, Theme, XStack, YStack } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'

import { ScrollAdapt } from './scroll-adapt'

export const OverviewSection = () => {
  return (
    <YStack>
      <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
        <H4 theme="alt1" fow="400">
          Stats
        </H4>
        <Theme name="alt2">
          <Button size="$2" chromeless iconAfter={ArrowRight}>
            View All
          </Button>
        </Theme>
      </XStack>

      <ScrollAdapt itemWidth={180} withSnap>
        <XStack fw="wrap" ai="flex-start" jc="flex-start" px="$4" gap="$8" mb="$4">
          <OverviewCard
            title="Modules Completed"
            value="75 Modules"
            badgeText="+5 Modules"
            badgeState="success"
          />

          <OverviewCard
            title="Average Course Score"
            value="92%"
            badgeText="+2%"
            badgeState="success"
          />

          <OverviewCard
            title="New Students This Month"
            value="120 Students"
            badgeText="+15%"
            badgeState="success"
          />

          <OverviewCard
            title="Weekly Assignments Submitted"
            value="1,200 Assignments"
            badgeText="+10%"
            badgeState="success"
          />
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}
