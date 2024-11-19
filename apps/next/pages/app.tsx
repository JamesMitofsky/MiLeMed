import { NextPage } from 'next'
import NextImage from 'next/image'
import { YStack, Text, useMedia, XStack } from 'tamagui'

const AppAnnouncement: NextPage = () => {
  const { sm } = useMedia()

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      gap={sm ? '$9' : '$6'}
    >
      <NextImage
        src="/logo.png"
        alt="Logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', maxWidth: '10rem', height: 'auto' }}
      />

      <NextImage
        src="/milemed-trifold.webp"
        alt="MiLeMed Preview"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', maxWidth: '40rem', height: 'auto' }}
      />

      <Text fontSize="$6" textAlign="center">
        Ändere deine Lernweise. Mikro-Lernen für makro Lernen.
      </Text>

      {sm ? (
        <YStack gap="$6" alignItems="center">
          <DownloadButtons sm={sm} />
        </YStack>
      ) : (
        <XStack gap="$6" alignItems="center">
          <DownloadButtons sm={sm} />
        </XStack>
      )}
    </YStack>
  )
}

export default AppAnnouncement

const DownloadButtons = ({ sm }: { sm: boolean }) => (
  <>
    <a href="https://apps.apple.com/app/id6737435431" target="_blank" rel="noopener noreferrer">
      <NextImage
        src="/download-on-app-store.svg"
        alt="Apple App Store"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '20%', minWidth: sm ? '12rem' : '11rem', height: 'auto' }}
      />
    </a>

    <a
      style={{
        width: 'min-content',
      }}
      href="/android"
      target="_blank"
      rel="noopener noreferrer"
    >
      <NextImage
        src="/download-on-google-play.webp"
        alt="Google Play Store"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '20%', minWidth: '12rem', height: 'auto' }}
      />
    </a>
  </>
)
