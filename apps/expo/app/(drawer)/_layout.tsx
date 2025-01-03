import { SidebarDrawer } from '@my/app/features/profile/screen'
import { Button, Image } from '@my/ui'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Menu } from '@tamagui/lucide-icons'
import { Drawer } from 'expo-router/drawer'

// @ts-ignore
import logoText from '../../assets/logoText.png' // Import the image

export default function Layout() {
  const navigation = useNavigation()
  return (
    <Drawer
      screenOptions={{
        title: '', // Set an empty title if you still want to show the header but without text
        headerLeft: () => (
          <Button
            borderStyle="unset"
            borderWidth={0}
            backgroundColor="transparent"
            marginLeft="$-1"
            paddingHorizontal="$4"
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer())
            }}
          >
            <Menu size={24} color="black" />
          </Button>
        ),
        headerRight: () => {
          return <Image mr="$2" height="$1" width="$9" marginRight="$3" src={logoText} />
        },
        // TODO fix color
        sceneContainerStyle: { backgroundColor: 'white' },
      }}
      drawerContent={SidebarDrawer}
    />
  )
}
