import VersionUpdateInfo from '@my/app/features/general/VersionUpdateInfo'
import { HomeScreen } from '@my/app/features/home/screen'
import { ScrollView } from '@my/ui'
import { useVersion } from 'app/provider'

export default function RootLayout() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      f={1}
      fb={0}
      contentContainerStyle={{ flexGrow: 1 }}
      pt="$6"
    >
      <AppVersionCheck MainComponent={<HomeScreen />} />
    </ScrollView>
  )
}

// Version check component that prompts for update when app version is less than remote version
function AppVersionCheck({ MainComponent }: { MainComponent: JSX.Element }) {
  const { needsUpdate, remoteVersionInfo } = useVersion()

  if (needsUpdate) {
    return <VersionUpdateInfo remoteVersionInfo={remoteVersionInfo} />
  }

  return <>{MainComponent}</>
}
