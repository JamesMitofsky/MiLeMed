import { Paragraph, ScrollView, Settings, useToastController, YStack } from '@my/ui'
import { LogOut, Moon, Trash } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { AlertDialog, Button, SizableText, XStack } from 'tamagui'

import packageJson from '../../package.json'

export const SettingsScreen = () => {
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

              <Settings.Item icon={Trash} accentTheme="red">
                <VerifyDeleteDialog />
              </Settings.Item>
              {/* <Settings.Item onPress={handleDeleteAccount} icon={Trash} accentTheme="red">
                Konto löschen
              </Settings.Item> */}
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

function VerifyDeleteDialog() {
  const supabase = useSupabase()
  const toast = useToastController()

  const handleDeleteAccount = async () => {
    // Get the current user's session
    const session = (await supabase.auth.getSession()).data.session

    if (!session?.access_token) {
      toast.show('User is not authenticated.')
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
    if (response.status !== 200) {
      toast.show(
        `${
          data.error || 'Ein Fehler ist aufgetreten.'
        } Bitte kontaktieren Sie hilfe@milemed.de, damit wir Ihr Problem umgehend lösen können.`
      )
      throw new Error('Error:', data.error || 'An error occurred while deleting the current user.')
    }

    console.log('User deleted successfully:', data)
    toast.show('Erfolg: Ihr Konto wurde erfolgreich gelöscht.')
    console.log('theoretically would navigate away here')
    // await supabase.auth.signOut()
  }
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        <SizableText>Konto löschen</SizableText>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          style={{ maxWidth: 800 }}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack>
            <AlertDialog.Title>Konto löschen</AlertDialog.Title>
            <AlertDialog.Description>
              Sind Sie sicher, dass Sie Ihr Konto und alle zugehörigen Daten löschen möchten? Sie
              können gerne fortfahren, aber wir wären Ihnen dankbar, wenn Sie sich zuerst unter
              hilfe@milemed.de mit uns in Verbindung setzen würden.
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                {/* Cancel */}
                <Button>Abbrechen</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                {/* Delete account */}
                <Button theme="red" onPress={() => handleDeleteAccount()}>
                  Löschen
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}
