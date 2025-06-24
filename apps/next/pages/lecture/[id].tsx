'use client'

import { XStack, ScrollView, YStack, Button } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import Head from 'next/head'
import { useRouter } from 'next/router'

import ReadModifyLecture from '../../../../packages/app/features/lectures/ReadModifyLecture'
import { useLectures, useQuizSystem } from '../../../../packages/app/utils/hooks/queryHooks'
import { NextPageWithLayout } from '../_app'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()

  const { useLectureById } = useLectures()
  const { data: lecture, refetch: refetchLecture } = useLectureById(parseInt(router.query.id as string, 10))

  const { getQuizResults } = useQuizSystem()
  const {
    data: quizQuestions,
    isLoading: areQuestionsLoading,
    error,
  } = getQuizResults(parseInt(router.query.id as string, 10))

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
