import { ProfileScreen } from '@my/app/features/profile/screen'
import { Drawer } from 'expo-router/drawer'

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        title: '', // Set an empty title if you still want to show the header but without text
      }}
      drawerContent={ProfileScreen}
    />
  )
}
