import { ScrollView } from '@my/ui'
import { Button, Label, Switch, YStack } from 'tamagui'

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
        <Button
          flexDirection="row"
          justifyContent="flex-start"
          maxWidth={200}
          animation="medium"
          onPress={toggleMode}
        >
          <Switch checked={mode === 'THEORETICAL'} onCheckedChange={toggleMode} size="$2">
            <Switch.Thumb borderColor="$color1" animation="200ms" />
          </Switch>
          <Label size="$1.5">{mode === 'THEORETICAL' ? 'Theoretisch' : 'Praktisch'}</Label>
        </Button>
        <ListOfChapters mode={mode === 'THEORETICAL' ? 'THEORETICAL' : 'PRACTICAL'} />
      </YStack>
    </ScrollView>
  )
}

export default ViewChaptersScreen
