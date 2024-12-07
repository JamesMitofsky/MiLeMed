import { ScrollView, YStack, XStack, FullscreenSpinner, useToastController } from '@my/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

  const triggerConfetti = useCallback(() => {
    confettiRef.current?.restart()
  }, [confettiRef])

  const handleRegistrationSuccess = useCallback(() => {
    triggerConfetti()
    toast.show('Profil erfolgreich eingerichtet.')
    setIsMainPageVisible(true)
  }, [confettiRef, triggerConfetti, toast, setIsMainPageVisible])

  useEffect(() => {
    if (profile?.role) {
      setIsMainPageVisible(true)
    } else {
      setIsMainPageVisible(false)
    }
  }, [profile?.role, setIsMainPageVisible])

  const onFeedbackSubmitSucccess = useCallback(() => {
    triggerConfetti()
  }, [triggerConfetti])

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardOpeningTime={0}
      resetScrollToCoords={{ x: 0, y: 0 }}
      keyboardShouldPersistTaps="handled"
    >
      <XStack als="center" ai="flex-start" f={1}>
        <Confetti autoplay={false} fadeOutOnEnd fallDuration={5500} ref={confettiRef} />
        <ScrollView keyboardShouldPersistTaps="handled" f={1} fb={0}>
          <YStack gap="$9" pb="$10" pt="$5" f={1}>
            {!profile ? (
              <FullscreenSpinner />
            ) : isMainPageVisible ? (
              <>
                <ChaptersPreviewList />
                <StatisticsPreviewList />
                <FeedbackSection onSubmitSuccess={onFeedbackSubmitSucccess} />
              </>
            ) : (
              <FinishRegistrationForm onSuccess={handleRegistrationSuccess} />
            )}
          </YStack>
        </ScrollView>
      </XStack>
    </KeyboardAwareScrollView>
  )
}
