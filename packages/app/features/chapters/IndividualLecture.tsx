import { useContext } from 'react'
import Markdown from 'react-native-markdown-display'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { YStack, Text, ScrollView, SizableText } from 'tamagui'

import { ThemeContext } from '../../provider/theme/UniversalThemeProvider.native'
import { useLectures } from '../../utils/hooks/queryHooks'
import { Skeleton } from '../general/Skeleton'

const { useParams } = createParam<{ id: string }>()

const IndividualLecture = () => {
  const {
    params: { id },
  } = useParams()
  const router = useRouter()

  const { getLectureById, markLectureCompleted } = useLectures()
  const { data: lecture, isLoading } = getLectureById(parseInt(id, 10))

  const handleNavigateToQuiz = () => {
    router.push(`/lecture/${id}/quiz`)
  }

  const handleMarkAsRead = () => {
    markLectureCompleted.mutate(parseInt(id, 10))
    router.back()
  }

  const context = useContext(ThemeContext)

  return (
    <ScrollView>
      <YStack p="$4" gap="$4">
        {isLoading ? (
          <Skeleton height={200} width="100%" />
        ) : lecture ? (
          <>
            <YStack gap="$2">
              <SizableText size="$8" fontWeight="800">
                {lecture.title}
              </SizableText>
              {/* <Theme name="alt1">
                <SizableText size="$3">{lecture.subtitle}</SizableText>
              </Theme> */}
            </YStack>
            <Markdown
              style={{
                body: {
                  color: context?.current === 'dark' ? '#fff' : '#000',
                  fontSize: 16,
                },
                heading1: {
                  color: context?.current === 'dark' ? '#fff' : '#000',
                  fontSize: 24,
                  marginTop: 8,
                  marginBottom: 8,
                },
                heading2: {
                  color: context?.current === 'dark' ? '#fff' : '#000',
                  fontSize: 20,
                  marginTop: 8,
                  marginBottom: 8,
                },
                heading3: {
                  color: context?.current === 'dark' ? '#fff' : '#000',
                  fontSize: 18,
                  marginTop: 8,
                  marginBottom: 8,
                },
                image: {
                  maxHeight: 400,
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                },
              }}
            >
              {lecture.content}
            </Markdown>
            {/* TODO: Important: check if quiz exists */}
            {/* {lecture.has_quiz ? (
              <Button size="$5" onPress={handleNavigateToQuiz}>
                Zum Quiz
              </Button>
            ) : (
              <Button size="$5" onPress={handleMarkAsRead}>
                Als gelesen markieren
              </Button>
            )} */}
          </>
        ) : (
          <Text>Keine Vorlesung gefunden</Text>
        )}
      </YStack>
    </ScrollView>
  )
}

export default IndividualLecture
