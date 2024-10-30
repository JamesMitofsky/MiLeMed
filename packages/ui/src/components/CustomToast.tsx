import { Toast, useToastState } from '@tamagui/toast'
import { XStack, YStack } from 'tamagui'

export const CustomToast = () => {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) {
    return null
  }

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ o: 0, scale: 0.5, y: -25 }}
      exitStyle={{ o: 0, scale: 1, y: -20 }}
      y={10}
      o={1}
      scale={1}
      animation="100ms"
      backgroundColor="#F8F8F8"
    >
      <YStack p="$2">
        <XStack gap="$3">
          <Toast.Title color="black">{currentToast.title}</Toast.Title>

          {/* <Toast.Close asChild>
            <Button
              chromeless
              icon={X}
              size="$1"
              circular
              style={{ alignItems: 'center', justifyContent: 'center' }}
            ></Button>
          </Toast.Close> */}
        </XStack>
        {!!currentToast.message && <Toast.Description>{currentToast.message}</Toast.Description>}
      </YStack>
    </Toast>
  )
}
