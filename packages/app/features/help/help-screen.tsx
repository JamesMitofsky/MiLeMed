import { Paragraph, ScrollView, SizableText, YStack } from '@my/ui'
import { Linking, Alert } from 'react-native'

const openEmail = (email: string) => {
  const emailWithPrefix = `mailto:${email}`
  Linking.canOpenURL(emailWithPrefix)
    .then((supported) => {
      if (!supported) {
        Alert.alert(
          'E-Mail-Client nicht gefunden',
          'Bitte konfigurieren Sie einen E-Mail-Client, um E-Mails zu senden.'
        )
      } else {
        return Linking.openURL(emailWithPrefix)
      }
    })
    .catch((err) => console.error('Error opening email link:', err))
}

const Title = ({ children }) => (
  <SizableText mb="$-4" mt="$4" size="$7">
    {children}
  </SizableText>
)

const Subtitle = ({ children }) => (
  <SizableText mb="$-3" mt="$5" size="$6">
    {children}
  </SizableText>
)
const BoldParagraph = ({ children }) => <Paragraph fontWeight="bold">{children}</Paragraph>

// Main Information Sheet Component
const HelpScreen = () => (
  <ScrollView>
    <YStack gap="$4" p="$4">
      <Title>Hilfe</Title>

      <Paragraph>
        Haben Sie ein Problem festgestellt oder haben Sie eine Frage? Wir helfen Ihnen gerne. Bitte
        setzen Sie sich mit uns in Verbindung unter{' '}
      </Paragraph>
      <SizableText
        onPress={() => openEmail('hilfe@milemed.de')}
        color="$blue10Light"
        textDecorationLine="underline"
      >
        hilfe@milemed.de
      </SizableText>
    </YStack>
  </ScrollView>
)

export { HelpScreen }
