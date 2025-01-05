import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Image } from 'react-native'
import Markdown, { ASTNode } from 'react-native-markdown-display'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { YStack, Text, ScrollView, Button, Theme, SizableText } from 'tamagui'

import { ThemeContext } from '../../provider/theme/UniversalThemeProvider.native'
import { useHasAssociatedQuiz } from '../../utils/react-query/useHasAssociatedQuiz'
import { useMarkLectureAsRead } from '../../utils/react-query/useMarkLectureAsRead'
import { supabase } from '../../utils/supabase/client.native'
import { Skeleton } from '../general/Skeleton'

const { useParams } = createParam<{ id: string }>()

const IndividualLecture = () => {
  const {
    params: { id },
  } = useParams()
  const router = useRouter()

  const { data: quizExistenceData } = useHasAssociatedQuiz(parseInt(id, 10))

  const handleNavigateToQuiz = () => {
    router.push(`/lecture/${id}/quiz`)
  }
  const markLectureAsRead = useMarkLectureAsRead()

  const handleMarkAsRead = () => {
    markLectureAsRead.mutate(parseInt(id, 10))
    router.back()
  }

  const { data: lecture, isLoading } = useQuery(['lecture', id], {
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.from('lectures').select('*').eq('id', id).single()
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    enabled: !!id,
  })
  const context = useContext(ThemeContext)

  const customRules = {
    image: (node: ASTNode) => {
      const { src, alt } = node.attributes as { src: string; alt: string }

      return (
        <YStack ai="center" w="100%">
          <Image
            source={{ uri: src }}
            style={{ maxHeight: 400, width: '100%', height: '100%' }}
            resizeMode="contain"
          />
          {alt && (
            <SizableText size="$1" my="$2" fontStyle="italic" theme="alt1">
              {alt}
            </SizableText>
          )}
        </YStack>
      )
    },
  }

  if (isLoading) {
    return (
      <YStack o={0.5} padding="$4" mb="$8" gap="$4">
        <YStack mt="$1" mb="$6">
          <Skeleton height={20} width="100%" />
        </YStack>
        <YStack gap="$2">
          <Skeleton height={12} width="75%" />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="75%" />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="35%" />
        </YStack>
        <YStack gap="$2">
          <Skeleton height={12} width="75%" />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="75%" />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="35%" />
        </YStack>
        <YStack gap="$2">
          <Skeleton height={12} width="75%" />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="75%" />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="35%" />
        </YStack>
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
      <YStack padding="$4" mb="$8">
        <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
          {lecture.title}
        </Text>
        <Markdown
          style={{
            text: {
              lineHeight: 24,
              fontSize: 17,
              color: context?.systemTheme === 'dark' ? 'white' : 'black',
            },
          }}
          // rules={customRules}
        >
          {lecture.content}
        </Markdown>
        <Theme name="green">
          {quizExistenceData?.exists ? (
            <Button onPress={handleNavigateToQuiz}>Bereit für das Quiz?!</Button>
          ) : (
            <Button onPress={handleMarkAsRead}>Als gelesen markieren</Button>
          )}
        </Theme>
      </YStack>
    </ScrollView>
  )
}

export default IndividualLecture
