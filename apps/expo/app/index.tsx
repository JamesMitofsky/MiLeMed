import { HomeScreen } from '@my/app/features/home/screen'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

      <HomeScreen />

      <Stack.Screen
        name="(learning)"
        options={{
          headerShown: false,
        }}
      />
    </>
  )
}
