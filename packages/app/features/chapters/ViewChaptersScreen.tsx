import { ScrollView } from '@my/ui'
import { SizableText, Switch, Theme, XStack, YStack } from 'tamagui'

import { useMode } from '../../provider/modeProvider'
import ListOfChapters from '../home/components/list-of-chapters'
import CustomBackButton from '../general/CustomHeader'
import { useRouter } from 'solito/router'

const ViewChaptersScreen = () => {
  const { mode, setMode } = useMode()
  const router = useRouter()

  const toggleMode = () => {
    setMode(mode === 'THEORETICAL' ? 'PRACTICAL' : 'THEORETICAL')
  }
  return (
    <ScrollView snapToAlignment="start" backgroundColor="white">
      <YStack padding="$4" gap="$3">
        <CustomBackButton onBack={() => router.push('/')} />
        <Theme name={mode === 'PRACTICAL' ? 'brandPrimary' : 'brandSecondary'}>
          <XStack mx="$2" mt="$3" mb="$5" gap="$4" ai="center" onPress={toggleMode}>
            <Switch
              id="mode-switch"
              checked={mode === 'PRACTICAL'}
              onCheckedChange={(checked) => setMode(checked ? 'PRACTICAL' : 'THEORETICAL')}
              size="$3"
              theme={mode === 'PRACTICAL' ? 'brandPrimary' : 'brandSecondary'}
            >
              <Switch.Thumb animation="quick" />
            </Switch>
            <SizableText color={mode === 'PRACTICAL' ? '$brandPrimary' : '$brandSecondary'}>
              {mode === 'PRACTICAL' ? 'Blockpraktikum' : 'Vorlesung'}
            </SizableText>
          </XStack>
        </Theme>
        <ListOfChapters mode={mode === 'THEORETICAL' ? 'THEORETICAL' : 'PRACTICAL'} />
      </YStack>
    </ScrollView>
  )
}

export { ViewChaptersScreen }
