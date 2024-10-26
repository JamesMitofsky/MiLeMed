import { ScrollView, YStack, XStack } from '@my/ui'

import { ChaptersPreviewList } from './components/achievements-section'
import { OverviewSection } from './components/overview-section'
import { PostsSection } from './components/posts-section'

export function HomeScreen() {
  return (
    <XStack maw={1480} als="center" ai="center" f={1}>
      <ScrollView f={1} fb={0}>
        <YStack gap="$7" pb="$10" pt="$5">
          <ChaptersPreviewList />
          <OverviewSection />
          <PostsSection />
        </YStack>
      </ScrollView>
    </XStack>
  )
}
