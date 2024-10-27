import { ScrollView } from '@my/ui'
import { YStack, Text } from 'tamagui'

import ListOfChapters from '../home/components/list-of-chapters'

const ViewChaptersScreen = () => {
  return (
    <ScrollView snapToAlignment="start">
      <YStack padding="$4" gap="$3">
        <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
          Kapitel
        </Text>

        <ListOfChapters />
      </YStack>
    </ScrollView>
  )
}

export default ViewChaptersScreen
