import { SidebarDrawer } from '@my/app/features/profile/screen'
import { Image } from '@my/ui'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'

// @ts-ignore
import logoText from '../../assets/logoText.png'

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        title: '', // Set an empty title if you still want to show the header but without text
        headerLeft: () => <DrawerToggleButton tintColor="black" pressColor="rgba(0,0,0,0.1)" />,
        headerRight: () => <Image mr="$2" height="$1" width="$9" marginRight="$3" src={logoText} />,
        sceneContainerStyle: { backgroundColor: 'white' },
        drawerStyle: {
          backgroundColor: 'white',
          width: '80%',
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
      drawerContent={(props) => <SidebarDrawer {...props} />}
    />
  )
}
