import { Stack } from 'tamagui'

const VideoProcessingPage = () => {
  return (
    <Stack flex={1} alignItems="center" justifyContent="center" gap="$6">
      <video controls style={{ maxWidth: '100%' }} preload="metadata">
        <source src="/milemed-2024-recap.mp4" type="video/mp4" />
        <p>
          Your browser does not support HTML video. Please{' '}
          <a href="/milemed-2024-recap.mp4">download the video</a> instead.
        </p>
      </video>
    </Stack>
  )
}

export default VideoProcessingPage
