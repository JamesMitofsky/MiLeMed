import { ScrollView } from '@my/ui'
import { SizableText, Switch, XStack, YStack } from 'tamagui'

import { useMode } from '../../provider/modeProvider'
import ListOfChapters from '../home/components/list-of-chapters'

const ViewChaptersScreen = () => {
  const { mode, setMode } = useMode()

  const toggleMode = () => {
    setMode(mode === 'THEORETICAL' ? 'PRACTICAL' : 'THEORETICAL')
  }
  return (
    <ScrollView snapToAlignment="start">
      <YStack padding="$4" gap="$3">
        <XStack mx="$2" mt="$3" mb="$5" gap="$4" onPress={toggleMode}>
          <Switch checked={mode === 'THEORETICAL'} onCheckedChange={toggleMode} size="$2">
            <Switch.Thumb borderColor="$color1" animation="200ms" />
          </Switch>
          <SizableText>{mode === 'THEORETICAL' ? 'Vorlesung' : 'Praktisch'}</SizableText>
        </XStack>
        <ListOfChapters mode={mode === 'THEORETICAL' ? 'THEORETICAL' : 'PRACTICAL'} />
      </YStack>
    </ScrollView>
  )
}

export { ViewChaptersScreen }
