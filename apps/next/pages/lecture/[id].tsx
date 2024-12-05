import { XStack, ScrollView, YStack, Button } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import { useFetchQuizQuestions } from 'app/utils/react-query/useFetchQuizQuestions'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import Head from 'next/head'
import { useRouter } from 'next/router'

import QuizQuestionForm from '../../../../packages/app/features/lectures/QuizQuestionForm'
import ReadModifyLecture from '../../../../packages/app/features/lectures/ReadModifyLecture'
import ShowExistingQuizQuestions from '../../../../packages/app/features/lectures/ShowExistingQuizQuestions'
import { useFetchSingleLecture } from '../../../../packages/app/utils/react-query/useFetchSingleLecture'
import { NextPageWithLayout } from '../_app'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { data: lecture } = useFetchSingleLecture(parseInt(router.query.id as string, 10))
  const {
    data: quizQuestions,
    isLoading: areQuestionsLoading,
    error,
    refetch,
  } = useFetchQuizQuestions(parseInt(router.query.id as string, 10))
  const supabase = useSupabase()

  const handleQuestionDelete = async (questionId: number) => {
    const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId)
    refetch()

    if (error) {
      console.error('Error deleting quiz question:', error)
      alert('An error occurred while deleting the quiz question. Please try again.')
    }
  }

  return (
    <>
      <Head>
        <title>Lecture</title>
      </Head>
      <XStack maw={1480} width={800} m="auto" f={1}>
        <ScrollView f={4} fb={0}>
          <YStack gap="$7" pb="$16" pt="$5">
            <Button
              themeShallow
              f={0}
              icon={ArrowLeft}
              onPress={() => router.back()}
              size="$3"
              width="auto"
            >
              Back
            </Button>
            <YStack gap="$12">
              <ReadModifyLecture lecture={lecture} lectureId={router.query.id as string} />
              <ShowExistingQuizQuestions
                quizQuestions={quizQuestions}
                areQuestionsLoading={areQuestionsLoading}
                error={error}
                onDelete={(questionId) => {
                  handleQuestionDelete(questionId)
                  refetch()
                }}
              />
              <QuizQuestionForm onSubmitSuccess={refetch} lectureId={lecture?.id} />
            </YStack>
          </YStack>
        </ScrollView>
      </XStack>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
