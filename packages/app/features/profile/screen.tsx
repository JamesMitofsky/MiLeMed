import { Settings, YStack, useWindowDimensions, Image } from '@my/ui'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { Cog, Home, User } from '@tamagui/lucide-icons'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { useUser } from 'app/utils/useUser'
import { useLink } from 'solito/link'

// @ts-ignore
import logo from './square-logo.png'

// used in expo
export function SidebarDrawer(props) {
  const { profile } = useUser()
  const name = profile?.name
  const insets = useSafeAreaInsets()
  const height = useWindowDimensions().height

  return (
    <DrawerContentScrollView {...props} f={1}>
      <YStack
        maw={600}
        mx="auto"
        w="100%"
        f={1}
        h={height - insets.bottom - insets.top}
        py="$4"
        pb="$2"
      >
        <Image m="auto" height="$18" width="$18" src={logo} />
        <Settings>
          <Settings.Items>
            <Settings.Group>
              <Settings.Item icon={Home} {...useLink({ href: '/' })} accentTheme="blue">
                Home
              </Settings.Item>
              <Settings.Item icon={User} {...useLink({ href: '/profile' })} accentTheme="pink">
                Profil bearbeiten
              </Settings.Item>
              {/* <Settings.Item icon={Box} accentTheme="green">
                My Items
              </Settings.Item>
              <Settings.Item icon={Users} accentTheme="orange">
                Refer Your Friends
              </Settings.Item>
              <Settings.Item icon={Milestone} accentTheme="gray">
                Address Info
              </Settings.Item>
              <Settings.Item icon={ShoppingCart} accentTheme="blue">
                Purchase History
              </Settings.Item> */}
              <Settings.Item {...useLink({ href: '/settings' })} icon={Cog}>
                Einstellungen
              </Settings.Item>
            </Settings.Group>
          </Settings.Items>
        </Settings>

        {/* <XStack gap="$4" mb="$7" mt="auto" ai="center" px="$4">
          <User size={30} color="$color" />
          <Paragraph ta="center" ml="$-1.5">
            {name ?? ''}
          </Paragraph>
        </XStack> */}
      </YStack>
    </DrawerContentScrollView>
  )
}
