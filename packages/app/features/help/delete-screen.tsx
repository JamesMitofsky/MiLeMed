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

// Main Information Sheet Component
const DeleteScreen = () => (
  <ScrollView>
    <YStack gap="$4" p="$4">
      <Title>Konto löschen</Title>

      <Paragraph>1. Melden Sie sich in Ihrem Konto an.</Paragraph>
      <Paragraph>2. Gehen Sie zur Einstellungsseite.</Paragraph>
      <Paragraph>3. Wählen Sie „Konto löschen“ und bestätigen Sie die Löschung.</Paragraph>
      <Paragraph mt="$5">
        Wenn Sie Fragen haben, zögern Sie bitte nicht, uns unter folgender Adresse zu kontaktieren:
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

export { DeleteScreen }
