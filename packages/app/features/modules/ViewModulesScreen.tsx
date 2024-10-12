import { ScrollView } from '@my/ui'
import { YStack, Text } from 'tamagui'

import ListOfModules from '../home/components/list-of-modules'

const ViewModulesScreen = () => {
  return (
    <YStack padding="$4">
      <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
        Modules
      </Text>

      <ScrollView snapToAlignment="start">
        <YStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfModules />
        </YStack>
      </ScrollView>
    </YStack>
  )
}

export default ViewModulesScreen
