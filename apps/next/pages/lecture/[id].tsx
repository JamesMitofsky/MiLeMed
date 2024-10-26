import { XStack, ScrollView, YStack, Button } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import useQuizQuestionsQuery from 'app/utils/react-query/useQuizQuestions'
import Head from 'next/head'
import { useRouter } from 'next/router'

import QuizQuestionForm from '../../../../packages/app/features/lectures/QuizQuestionForm'
import ReadModifyLecture from '../../../../packages/app/features/lectures/ReadModifyLecture'
import ShowExistingQuizQuestions from '../../../../packages/app/features/lectures/ShowExistingQuizQuestions'
import useLectureQuery from '../../../../packages/app/utils/react-query/useLectureQuery'
import { NextPageWithLayout } from '../_app'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { data: lecture } = useLectureQuery(router.query.id as string)
  const {
    data: quizQuestions,
    isLoading: areQuestionsLoading,
    error,
    refetch,
  } = useQuizQuestionsQuery(router.query.id as string)

  return (
    <>
      <Head>
        <title>Lecture</title>
      </Head>
      <XStack maw={1480} width={800} m="auto" f={1}>
        <ScrollView f={4} fb={0}>
          <YStack gap="$7" pb="$10" pt="$5">
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
            <ReadModifyLecture lecture={lecture} lectureId={router.query.id as string} />
            <ShowExistingQuizQuestions
              quizQuestions={quizQuestions}
              areQuestionsLoading={areQuestionsLoading}
              error={error}
            />
            <QuizQuestionForm onSubmitSuccess={refetch} lectureId={lecture?.id} />
          </YStack>
        </ScrollView>
      </XStack>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
