import { ScrollView } from '@my/ui'
import { YStack, Text } from 'tamagui'

import ListOfChapters from '../home/components/list-of-chapters'

const ViewChapterssScreen = () => {
  return (
    <YStack padding="$4">
      <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
        Kapitel
      </Text>

      <ScrollView snapToAlignment="start">
        <YStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfChapters />
        </YStack>
      </ScrollView>
    </YStack>
  )
}

export default ViewChapterssScreen
