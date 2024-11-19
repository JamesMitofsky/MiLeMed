import { FullscreenSpinner } from '@my/ui'
import { NextPage } from 'next'
import NextImage from 'next/image'
import { useState } from 'react'
import { YStack, Text, Button, Input, SizableText, View } from 'tamagui'

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

      <Contact />

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
function Contact() {
  const [formSubmissionStatus, setFormSubmissionStatus] = useState<
    'sending' | 'success' | 'failure'
  >()
  const [email, setEmail] = useState('')

  const onSubmit = async () => {
    setFormSubmissionStatus('sending')

    const formData = new FormData()
    formData.append('access_key', process.env.NEXT_PUBLIC_WEB_3_FORMS_KEY!)
    formData.append('email', email) // Append email to formData

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      setFormSubmissionStatus('success')
    } else {
      console.log('Error', data)
      setFormSubmissionStatus('failure')
    }
  }

  return (
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
        value={email}
        onChangeText={(v) => setEmail(v)}
      />
      {formSubmissionStatus === undefined && (
        <Button theme="green" marginTop="$4" onPress={onSubmit}>
          Benachrichtigt werden!
        </Button>
      )}
      {formSubmissionStatus !== undefined && (
        <View mt="$5">
          <SizableText>
            {formSubmissionStatus === 'success' && 'Form Submitted Successfully 🎉'}
            {formSubmissionStatus === 'failure' && 'Something went wrong 😢'}
          </SizableText>
          {formSubmissionStatus === 'sending' && <FullscreenSpinner />}
        </View>
      )}
    </YStack>
  )
}
