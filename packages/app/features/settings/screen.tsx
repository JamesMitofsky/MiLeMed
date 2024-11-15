import { Paragraph, ScrollView, Settings, YStack } from '@my/ui'
import { LogOut, Moon, Trash } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { Alert } from 'react-native'

import packageJson from '../../package.json'

export const SettingsScreen = () => {
  const supabase = useSupabase()

  const handleDeleteAccount = () => {
    Alert.alert(
      'Konto löschen',
      'Sind Sie sicher, dass Sie Ihr Konto und alle zugehörigen Daten löschen möchten? Sie können gerne fortfahren, aber wir wären Ihnen dankbar, wenn Sie sich zuerst unter hilfe@milemed.de mit uns in Verbindung setzen würden.',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Löschen',
          onPress: async () => {
            // Get the current user's session
            const session = (await supabase.auth.getSession()).data.session

            if (!session?.access_token) {
              Alert.alert('Error', 'User is not authenticated.')
              return
            }

            // Determine the Edge Function URL based on the environment
            const EDGE_FUNCTION_URL =
              process.env.NODE_ENV === 'production'
                ? `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.functions.supabase.co/delete-user`
                : 'http://localhost:54321/functions/v1/delete-user'

            // Call the Edge Function
            const response = await fetch(EDGE_FUNCTION_URL, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: session.user.id }),
            })

            const data = await response.json()
            if (!response.ok) {
              console.error('Error:', data.error || 'An error occurred.')
              Alert.alert(
                'Fehler',
                `${
                  data.error || 'Ein Fehler ist aufgetreten.'
                } Bitte kontaktieren Sie hilfe@milemed.de, damit wir Ihr Problem umgehend lösen können.`
              )
            }

            console.log('User deleted successfully:', data)
            Alert.alert('Erfolg: Ihr Konto wurde erfolgreich gelöscht.')
            await supabase.auth.signOut()
          },
        },
      ]
    )
  }

  return (
    <YStack f={1}>
      <ScrollView>
        <Settings>
          <Settings.Items>
            {/* <Settings.Group $gtSm={{ space: '$1' }}>
              <Settings.Item
                icon={Cog}
                isActive={pathname === 'settings/general'}
                {...useLink({ href: media.sm ? '/settings/general' : '/settings' })}
                accentTheme="green"
              >
                General
              </Settings.Item>
              <Settings.Item
                icon={Lock}
                isActive={pathname === '/settings/change-password'}
                {...useLink({ href: '/settings/change-password' })}
                accentTheme="green"
              >
                Change Password
              </Settings.Item>
              <Settings.Item
                icon={Mail}
                isActive={pathname === '/settings/change-email'}
                {...useLink({ href: '/settings/change-email' })}
                accentTheme="green"
              >
                Change Email
              </Settings.Item>
              </Settings.Group> */}
            <Settings.Group>
              {/* <SettingsThemeAction /> TODO: add back in the theme when this is fixed */}
              <SettingsItemLogoutAction />
              <Settings.Item onPress={handleDeleteAccount} icon={Trash} accentTheme="red">
                Konto löschen
              </Settings.Item>
            </Settings.Group>
          </Settings.Items>
        </Settings>
      </ScrollView>
      {/*
      NOTE: you should probably get the actual native version here using https://www.npmjs.com/package/react-native-version-info
      we just did a simple package.json read since we want to keep things simple for the starter
       */}
      <Paragraph py="$2" ta="center" theme="alt2">
        version {packageJson.version}
      </Paragraph>
    </YStack>
  )
}

const SettingsThemeAction = () => {
  const { toggle, current } = useThemeSetting()

  return (
    <Settings.Item icon={Moon} accentTheme="blue" onPress={toggle} rightLabel={current}>
      Thema
    </Settings.Item>
  )
}

export const SettingsItemLogoutAction = () => {
  const supabase = useSupabase()

  return (
    <Settings.Item icon={LogOut} accentTheme="green" onPress={() => supabase.auth.signOut()}>
      Abmelden
    </Settings.Item>
  )
}
