import { NextPage } from 'next'
import NextImage from 'next/image'
import { YStack, Text, Input, Button } from 'tamagui'

const AndroidAnnouncement: NextPage = () => {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      gap="$6"
      style={{ maxWidth: 500, margin: 'auto' }}
    >
      {/* Logo */}
      <NextImage
        src="/logo.png"
        alt="Logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', maxWidth: '10rem', height: 'auto' }}
      />

      {/* Title */}
      <Text fontSize="$8" fontWeight="bold" textAlign="center">
        MiLeMed für Android kommt bald!
      </Text>

      {/* Subtitle */}
      <Text fontSize="$6" textAlign="center">
        Die Android-Version wird in den nächsten Tagen verfügbar sein. Melde dich unten an, um
        benachrichtigt zu werden, und sei einer der Ersten, die MiLeMed für Android ausprobieren!
      </Text>

      {/* Notification Input */}
      <YStack
        width="100%"
        alignItems="center"
        padding="$4"
        borderWidth="$2"
        borderColor="$borderColor"
        borderRadius="$4"
      >
        <Input
          placeholder="Deine E-Mail-Adresse eingeben"
          width="100%"
          borderColor="transparent"
          fontSize="$5"
        />
        <Button theme="green" marginTop="$4">
          Benachrichtigt werden!
        </Button>
      </YStack>

      {/* Image Preview */}
      <NextImage
        src="/milemed-trifold.webp"
        alt="MiLeMed Vorschau"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', maxWidth: '40rem', height: 'auto' }}
      />
    </YStack>
  )
}

export default AndroidAnnouncement
