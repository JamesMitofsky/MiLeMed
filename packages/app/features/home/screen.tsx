import { ScrollView, YStack, XStack, FullscreenSpinner } from '@my/ui'

import { FinishRegistrationForm } from './components/FinishRegistrationForm'
import { ChaptersPreviewList } from './components/achievements-section'
import { StatisticsPreviewList } from './components/overview-section'
import { useUser } from '../../utils/useUser'

export function HomeScreen() {
  const { profile } = useUser()

  return (
    <XStack als="center" ai="flex-start" f={1}>
      <ScrollView f={1} fb={0}>
        <YStack gap="$7" pb="$10" pt="$5">
          {!profile ? (
            <FullscreenSpinner />
          ) : !profile.role ? (
            <FinishRegistrationForm />
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
