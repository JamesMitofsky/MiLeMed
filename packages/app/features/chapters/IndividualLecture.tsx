import { useContext, useEffect, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { marked } from 'marked'
import RenderHtml from 'react-native-render-html'
import { useRouter } from 'solito/router'
import { YStack, Text, SizableText, ScrollView, Button } from 'tamagui'

import { ThemeContext } from '../../provider/theme/UniversalThemeProvider.native'
import { useLectureById } from '../../utils/hooks/queryHooks'
import { Skeleton } from '../general/Skeleton'
import CustomBackButton from '../general/CustomHeader'

interface IndividualLectureProps {
  lectureId: string
}

// Function to convert markdown to HTML using marked
const markdownToHtml = async (markdown: string): Promise<string> => {
  return marked.parse(markdown)
}

const IndividualLecture = ({ lectureId }: IndividualLectureProps) => {
  // Keep router for potential future use with commented functions
  const router = useRouter()
  const id = parseInt(lectureId, 10)
  const { width } = useWindowDimensions()

  // Use the proper hook to fetch lecture data
  const { data: lecture, isLoading } = useLectureById(id)

  // Convert markdown to HTML
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    if (lecture?.content) {
      markdownToHtml(lecture.content)
        .then((html) => setHtmlContent(html))
        .catch((error) => console.error('Error converting markdown to HTML:', error))
    }
  }, [lecture?.content])

  const context = useContext(ThemeContext)

  function handleNavigateToQuiz() {
    router.push(`/lectures/${id}/quiz`)
  }

  const styles = useMemo(
    () => ({
      body: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 16,
      },
      h1: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 26,
        marginTop: 8,
        marginBottom: 8,
      },
      h2: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 24,
        marginTop: 8,
        marginBottom: 8,
      },
      h3: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 22,
        marginTop: 8,
        marginBottom: 8,
      },
      p: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 20,
        marginTop: 8,
        marginBottom: 8,
      },
    }),
    [context?.current]
  )

  return (
    <ScrollView>
      <YStack p="$4" gap="$4" bg="white" flex={1}>
        <CustomBackButton onBack={() => router.push(`/chapters/${lecture.chapter_id}`)} />
        {isLoading ? (
          <Skeleton height={200} width="100%" />
        ) : lecture ? (
          <YStack pb="$10">
            <YStack gap="$2">
              <SizableText size="$8" fontWeight="800">
                {lecture.title}
              </SizableText>
              {/* <Theme name="alt1">
                <SizableText size="$3">{lecture.subtitle}</SizableText>
              </Theme> */}
            </YStack>
            <RenderHtml
              contentWidth={width - 32} // Accounting for padding
              source={{ html: htmlContent }}
              tagsStyles={styles}
            />
            <Button size="$5" onPress={handleNavigateToQuiz}>
              Zum Quiz
            </Button>
            {/* TODO: Important: check if quiz exists */}
            {/* {lecture.has_quiz ? (
            ) : (
              <Button size="$5" onPress={handleMarkAsRead}>
              Als gelesen markieren
              </Button>
              )} */}
          </YStack>
        ) : (
          <Text>Keine Vorlesung gefunden</Text>
        )}
      </YStack>
    </ScrollView>
  )
}

export default IndividualLecture
