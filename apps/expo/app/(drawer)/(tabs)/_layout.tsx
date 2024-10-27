import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all screens in this folder
        title: '', // Set an empty title if you still want to show the header but without text
      }}
    />
  )
}
