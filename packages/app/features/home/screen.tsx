import { ScrollView, YStack, XStack, FullscreenSpinner } from '@my/ui'

import { CompleteRegistration } from './components/CompleteRegistration'
import { ChaptersPreviewList } from './components/achievements-section'
import { StatisticsPreviewList } from './components/overview-section'
import { useUser } from '../../utils/useUser'

export function HomeScreen() {
  const { profile } = useUser()
  return (
    <XStack maw={1480} als="center" ai="flex-start" f={1}>
      <ScrollView f={1} fb={0}>
        <YStack gap="$7" pb="$10" pt="$5">
          {!profile ? (
            <FullscreenSpinner />
          ) : !profile.role ? (
            <CompleteRegistration />
          ) : (
            <>
              <ChaptersPreviewList />
              <StatisticsPreviewList />
            </>
          )}
          {/* <FeedbackPreview /> */}
        </YStack>
      </ScrollView>
    </XStack>
  )
}
