import { Stack, SizableText, Spinner } from 'tamagui'

const VideoProcessingPage = () => {
  return (
    <Stack flex={1} alignItems="center" justifyContent="center" space>
      <SizableText size="$9">Videoverarbeitung</SizableText>
      <SizableText size="$5">
        Bitte kommen Sie später noch einmal zurück, um das gerenderte Video anzusehen.
      </SizableText>
      <Spinner size="large" color="black" />
    </Stack>
  )
}

export default VideoProcessingPage
