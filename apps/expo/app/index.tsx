import { HomeScreen } from '@my/app/features/home/screen'
import { ScrollView } from '@my/ui'

export default function RootLayout() {
  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        f={1}
        fb={0}
        contentContainerStyle={{ flexGrow: 1 }}
        pt="$6"
      >
        <HomeScreen /> {/* this is still being put in like it's a slot idk why... */}
      </ScrollView>
    </>
  )
}
