import { ScrollView, View } from '@my/ui'
import { PrivacyPolicyScreen } from 'app/features/legal/privacy-policy-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: '' }} />
      <ScrollView f={1} fb={0}>
        <View mb="$8">
          <PrivacyPolicyScreen />
        </View>
      </ScrollView>
    </>
  )
}
