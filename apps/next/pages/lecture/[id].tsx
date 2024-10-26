import { XStack, ScrollView, YStack, Button, TextArea, Input, Spinner, SizableText } from '@my/ui'
import { Save, ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Chip } from '../../../../packages/app/features/general/chipParts'
import QuizQuestionForm from '../../../../packages/app/features/lectures/QuizQuestionForm'
import useLectureQuery from '../../../../packages/app/utils/react-query/useLectureQuery'
import useQuizQuestionsQuery from '../../../../packages/app/utils/react-query/useQuizQuestions'
import { FullscreenSpinner } from '../../../../packages/ui/src/components/FullscreenSpinner'
import { NextPageWithLayout } from '../_app'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { data: lecture } = useLectureQuery(router.query.id as string)
  const {
    data: quizQuestions,
    isLoading: isQuestionsLoading,
    error,
  } = useQuizQuestionsQuery(router.query.id as string)
  const supabase = useSupabase()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false) // State to track loading status

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title)
      setContent(lecture.content)
    }
  }, [lecture])

  const handleSaveChanges = async () => {
    setLoading(true) // Set loading to true when request starts

    try {
      const { error } = await supabase
        .from('lectures') // replace 'lectures' with your actual table name
        .update({ title, content })
        .eq('id', router.query.id as string)

      if (error) throw error

      // Successfully updated the lecture, now go back
      router.back()
    } catch (error) {
      console.error('Error updating lecture:', error)
      setLoading(false) // Set loading to false if something went wrong.
      alert('An error occurred while updating the lecture. Please try again.')
    }
  }

  console.log(quizQuestions)

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
            {lecture ? (
              <>
                <Input
                  size="$3"
                  fontWeight="300"
                  height={60}
                  placeholder="Your title here"
                  value={title}
                  // @ts-ignore
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextArea
                  size="$3"
                  fontWeight="300"
                  height={580}
                  placeholder="Your content here"
                  value={content}
                  // @ts-ignore
                  onChange={(e) => setContent(e.target.value)}
                />
              </>
            ) : (
              <FullscreenSpinner />
            )}

            <Button
              themeInverse
              f={0}
              icon={Save}
              onPress={handleSaveChanges}
              size="$3"
              width="auto"
            >
              {loading ? <Spinner /> : 'Save'}
            </Button>

            {/* Quiz Questions Section */}
            <YStack gap="$4" pt="$5">
              {isQuestionsLoading ? (
                <Spinner />
              ) : error ? (
                <SizableText color="red">Failed to load quiz questions</SizableText>
              ) : quizQuestions && quizQuestions.length > 0 ? (
                quizQuestions.map((question) => (
                  <YStack key={question.id} gap="$3" p="$4" borderWidth={1} borderColor="$gray3">
                    <SizableText fontWeight="bold" size="$4">
                      {question.question_text}
                    </SizableText>
                    {question.question_type === 'MULTIPLE_CHOICE' && (
                      <YStack gap="$2" pl="$4">
                        {question.quiz_question_options.map((option) => (
                          <Chip
                            // @ts-ignore
                            width="fit-content"
                            rounded
                            theme={option.is_correct && 'green'}
                            key={option}
                          >
                            <Chip.Text size="$3">{option.option_text}</Chip.Text>
                          </Chip>
                        ))}
                      </YStack>
                    )}
                    {question.question_type === 'OPEN' && (
                      <SizableText size="$3" fontStyle="italic">
                        {question.quiz_question_options[0]?.option_text}
                      </SizableText>
                    )}
                  </YStack>
                ))
              ) : (
                <SizableText size="$4" fontStyle="italic">
                  No quiz questions found.
                </SizableText>
              )}
            </YStack>

            <QuizQuestionForm
              onSubmitSuccess={() => console.log('submitted')}
              lectureId={lecture?.id}
            />
          </YStack>
        </ScrollView>
      </XStack>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
