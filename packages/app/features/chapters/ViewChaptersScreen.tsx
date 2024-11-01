import { ScrollView } from '@my/ui'
import { useState } from 'react'
import { Button, Label, Switch, YStack } from 'tamagui'

import ListOfChapters from '../home/components/list-of-chapters'

const ViewChaptersScreen = () => {
  const [isTheoretical, setIsTheoretical] = useState(true)
  return (
    <ScrollView snapToAlignment="start">
      <YStack padding="$4" gap="$3">
        <Button
          flexDirection="row"
          justifyContent="flex-start"
          maxWidth={200}
          animation="medium"
          onPress={() => setIsTheoretical(!isTheoretical)}
        >
          <Switch checked={isTheoretical} onCheckedChange={setIsTheoretical} size="$2">
            <Switch.Thumb borderColor="$color1" animation="200ms" />
          </Switch>
          <Label size="$1.5">{isTheoretical ? 'Theoretisch' : 'Praktisch'}</Label>
        </Button>
        <ListOfChapters mode={isTheoretical ? 'THEORETICAL' : 'PRACTICAL'} />
      </YStack>
    </ScrollView>
  )
}

export default ViewChaptersScreen
