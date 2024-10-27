import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useContext } from 'react'
import Markdown from 'react-native-markdown-display'
import { YStack, Text, Spinner, ScrollView, Button } from 'tamagui'

import { ThemeContext } from '../../provider/theme/UniversalThemeProvider.native'
import { supabase } from '../../utils/supabase/client.native'

const IndividualLecture = () => {
  // const { id } = useSearchParams()
  const { id }: { id: string } = useLocalSearchParams()

  // Use the ID to query specific module data
  const { data: lecture, isLoading } = useQuery(['lecture', id], {
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.from('lectures').select('*').eq('id', id).single()
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    enabled: !!id, // Only run the query if 'id' is available
  })
  const context = useContext(ThemeContext)

  if (isLoading) {
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" />
        <Text marginTop="$2">Lade Vorlesung...</Text>
      </YStack>
    )
  }

  if (!lecture) {
    return (
      <YStack padding="$4" alignItems="center">
        <Text marginTop="$2">Vorlesung nicht gefunden.</Text>
      </YStack>
    )
  }

  return (
    <ScrollView snapToAlignment="start">
      <YStack padding="$4">
        <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
          {lecture.title}
        </Text>
        <Text fontSize="$4" marginBottom="$2" color="red">
          <Markdown
            style={{ text: { color: context?.systemTheme === 'dark' ? 'white' : 'black' } }}
          >
            {lecture.content}
          </Markdown>
        </Text>
        <Button
          marginTop="$4"
          themeInverse
          onPress={() => {
            /* Add your quiz navigation logic here */
          }}
        >
          Bereit für das Quiz?!
        </Button>
      </YStack>
    </ScrollView>
  )
}

export default IndividualLecture
