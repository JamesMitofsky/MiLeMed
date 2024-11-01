import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import Markdown from 'react-native-markdown-display'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { YStack, Text, Spinner, ScrollView, Button, Theme } from 'tamagui'

import { ThemeContext } from '../../provider/theme/UniversalThemeProvider.native'
import { useCheckQuizExistence } from '../../utils/react-query/useCheckQuizExistence'
import { supabase } from '../../utils/supabase/client.native'

const { useParams } = createParam<{ id: string }>()

const IndividualLecture = () => {
  const {
    params: { id },
  } = useParams()
  const router = useRouter()

  const { data: quizExistenceData } = useCheckQuizExistence(parseInt(id, 10))

  const handleNavigateToQuiz = () => {
    router.push(`/lecture/${id}/quiz`)
  }

  const handleMarkAsRead = () => {
    // Mark the lecture as read
    console.log('mark lecture as read')
  }

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
            style={{
              text: { fontSize: 17, color: context?.systemTheme === 'dark' ? 'white' : 'black' },
            }}
          >
            {lecture.content}
          </Markdown>
        </Text>
        {quizExistenceData?.exists ? (
          <Theme name="orange">
            <Button onPress={handleNavigateToQuiz}>Bereit für das Quiz?!</Button>
          </Theme>
        ) : (
          <Theme name="green">
            <Button onPress={handleMarkAsRead}>Als gelesen markieren</Button>
          </Theme>
        )}
      </YStack>
    </ScrollView>
  )
}

export default IndividualLecture
