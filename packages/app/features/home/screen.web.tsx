import { ScrollView, YStack, FullscreenSpinner, XStack, SizableText, useMedia, Link } from '@my/ui'
import { useCallback, useRef } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types'

import { FinishRegistrationForm } from './components/FinishRegistrationForm'
import { useUser } from '../../utils/useUser'

export function HomeScreen() {
  const { profile } = useUser()
  const { md } = useMedia()

  const confettiRef = useRef<TCanvasConfettiInstance>()

  const onInitConfetti = useCallback(({ confetti }: { confetti: TCanvasConfettiInstance }) => {
    confettiRef.current = confetti
  }, [])

  const shootConfetti = useCallback(() => {
    confettiRef.current?.({
      particleCount: md ? 70 : 170,
      spread: md ? 60 : 120,
      origin: { x: 0.5, y: md ? 0.64 : 0.4 },
      ticks: 250,
    })
  }, [md])

  const handleRegistrationSuccess = useCallback(() => {
    shootConfetti()
  }, [shootConfetti])

  return (
    <XStack maw={1480} als="center" ai="center" f={1}>
      <ReactCanvasConfetti onInit={onInitConfetti} />

      <ScrollView f={1} fb={0}>
        <YStack gap="$6" p="$10" f={1}>
          {!profile?.id ? (
            <FullscreenSpinner />
          ) : profile?.role ? (
            <YStack pb="$10" gap="$6" justifyContent="center" alignItems="center" pt="$0">
              <SizableText size="$6" textAlign="center">
                Ihr Profil ist vollständig eingerichtet, gute Arbeit!
              </SizableText>
              <XStack>
                <SizableText>Weiter in </SizableText>
                <Link
                  style={{ textDecoration: 'underline', color: '#408bab' }}
                  href="de.milemed.app://sign-in"
                >
                  Gehe zu den Kapiteln
                </Link>
                <SizableText> 🙌</SizableText>
              </XStack>
            </YStack>
          ) : (
            <FinishRegistrationForm onSuccess={handleRegistrationSuccess} />
          )}
        </YStack>
      </ScrollView>
    </XStack>
  )
}
