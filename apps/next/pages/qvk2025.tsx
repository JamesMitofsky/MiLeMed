import Image from 'next/image'
import { Stack, SizableText, Spinner, XStack } from 'tamagui'

const VideoProcessingPage = () => {
  return (
    <Stack flex={1} alignItems="center" justifyContent="center" gap="$6">
      <XStack ai="center" gap="$4">
        <SizableText size="$9">Videoverarbeitung</SizableText>
        <Spinner size="large" color="black" />
      </XStack>
      <Image
        src="/logo.png"
        alt="Logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', maxWidth: '10rem', height: 'auto' }}
      />
      <SizableText size="$5">
        Bitte kommen Sie später noch einmal zurück, um das gerenderte Video anzusehen.
      </SizableText>
    </Stack>
  )
}

export default VideoProcessingPage
