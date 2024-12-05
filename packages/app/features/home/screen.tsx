import { ScrollView, YStack, XStack, FullscreenSpinner, useToastController } from '@my/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti'

import { FinishRegistrationForm } from './components/FinishRegistrationForm'
import { StatisticsPreviewList } from './components/StatisticsPreviewList'
import { ChaptersPreviewList } from './components/achievements-section'
import { FeedbackSection } from './components/feedback-section'
import { useUser } from '../../utils/useUser'

export function HomeScreen() {
  const { profile } = useUser()
  const confettiRef = useRef<ConfettiMethods>(null)
  const toast = useToastController()
  const [isMainPageVisible, setIsMainPageVisible] = useState(false)

  const handleRegistrationSuccess = useCallback(() => {
    confettiRef.current?.restart()
    toast.show('Profil erfolgreich eingerichtet.')
    setIsMainPageVisible(true)
  }, [confettiRef])

  useEffect(() => {
    if (profile?.role) {
      setIsMainPageVisible(true)
    } else {
      setIsMainPageVisible(false)
    }
  }, [profile?.role, setIsMainPageVisible])

  return (
    <XStack als="center" ai="flex-start" f={1}>
      <Confetti autoplay={false} fadeOutOnEnd ref={confettiRef} />
      <ScrollView f={1} fb={0}>
        <YStack gap="$7" pb="$10" pt="$5" f={1}>
          {!profile ? (
            <FullscreenSpinner />
          ) : isMainPageVisible ? (
            <>
              <ChaptersPreviewList />
              <StatisticsPreviewList />
            </>
          ) : (
            <FinishRegistrationForm onSuccess={handleRegistrationSuccess} />
          )}
          <FeedbackSection />
        </YStack>
      </ScrollView>
    </XStack>
  )
}
