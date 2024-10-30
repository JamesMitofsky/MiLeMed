import { ScrollView } from '@my/ui'
import { YStack } from 'tamagui'

import ListOfChapters from '../home/components/list-of-chapters'

const ViewChaptersScreen = () => {
  return (
    <ScrollView snapToAlignment="start">
      <YStack padding="$4" gap="$3">
        <ListOfChapters />
      </YStack>
    </ScrollView>
  )
}

export default ViewChaptersScreen
