import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, Spinner } from 'tamagui'

import { supabase } from '../../utils/supabase/client.native'

const IndividualModuleScreen = () => {
  // const { id } = useSearchParams()
  const { id } = useLocalSearchParams()

  // Use the ID to query specific module data
  const { data: module, isLoading } = useQuery(['module', id], {
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    enabled: !!id, // Only run the query if 'id' is available
  })

  if (isLoading) {
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" />
        <Text marginTop="$2">Loading module...</Text>
      </YStack>
    )
  }

  if (!module) {
    return (
      <YStack padding="$4" alignItems="center">
        <Text marginTop="$2">Module not found.</Text>
      </YStack>
    )
  }

  return (
    <YStack padding="$4">
      <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
        {id}
        {module.name}
      </Text>
      <Text fontSize="$4" marginBottom="$2">
        {module.description}
      </Text>
      {/* Add more module details as needed */}
    </YStack>
  )
}

export default IndividualModuleScreen
