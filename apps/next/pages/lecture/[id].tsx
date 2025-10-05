'use client'

import { XStack, ScrollView, YStack, Button } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import Head from 'next/head'
import { useRouter } from 'next/router'

import ReadModifyLecture from '../../../../packages/app/features/lectures/ReadModifyLecture'
import {
  useQuizSystem,
  useQuizOptions,
  useLectureById,
} from '../../../../packages/app/utils/hooks/queryHooks'
import { NextPageWithLayout } from '../_app'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()

  const { data: lecture, refetch: refetchLecture } = useLectureById(
    parseInt(router.query.id as string, 10)
  )

  const { useQuizResults } = useQuizSystem()
  const {
    data: quizQuestions,
    isLoading: areQuestionsLoading,
    error,
  } = useQuizResults(parseInt(router.query.id as string, 10))

  console.log('Quiz questions:', quizQuestions)

  // for every quiz question ID, there are also 0-N options.
  // Extract question IDs from the quiz questions to fetch only relevant options
  const questionIds = quizQuestions ? quizQuestions.map((q) => q.question_id) : []
  const { data: quizOptions, getOptionsForQuestion } = useQuizOptions(questionIds)

  console.log('Quiz options:', quizOptions, 'for question IDs:', questionIds)

  const supabase = useSupabase()

  const handleQuestionDelete = async (questionId: number) => {
    const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId)

    if (error) {
      console.error('Error deleting quiz question:', error)
    }
  }

  return (
    <>
      <Head>
        <title>{lecture ? `Lecture: ${lecture.title}` : 'Lecture'}</title>
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
              <ReadModifyLecture
                lecture={lecture}
                lectureId={router.query.id as string}
                quizQuestions={quizQuestions}
                quizOptions={quizOptions}
                getOptionsForQuestion={getOptionsForQuestion}
                isQuizLoading={areQuestionsLoading}
                onDeleteQuestion={handleQuestionDelete}
                onSaveSuccess={refetchLecture}
              />
            </YStack>
          </YStack>
        </ScrollView>
      </XStack>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
