import { ScrollView, useToastController, View } from '@my/ui'
import { useQueryClient } from '@tanstack/react-query'
import MultiChoicePickReveal from 'app/features/quiz/MultiChoicePickReveal'
import OpenAnswerTypeReveal from 'app/features/quiz/OpenAnswerTypeReveal'
import { useFetchChapterIdByLectureId } from 'app/utils/react-query/useFetchChapterIdByLectureId'
import useFetchQuizQuestions from 'app/utils/react-query/useFetchQuizQuestions'
import { QuizAnswersType } from 'app/utils/supabase/databaseTypes'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { randomUUID } from 'expo-crypto'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createParam } from 'solito'
import { YStack, SizableText, Button, Theme } from 'tamagui'

const { useParams } = createParam<{ id: number }>()
const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()
  const queryClient = useQueryClient()

  const router = useRouter()
  const { user } = useUser()
  const { data: questions } = useFetchQuizQuestions(lectureId)
  const { control, handleSubmit } = useForm<{ answers: QuizAnswersType[] }>()
  const supabase = useSupabase()

  const { data: chapterId } = useFetchChapterIdByLectureId(lectureId)

  const [hasEvaluatedMultipleChoice, setHasEvaluatedMultipleChoice] = useState(false)

  const [answerIds, setAnswerIds] = useState<{ [key: number]: number[] }>({})
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)

  const toast = useToastController()

  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      const newId = randomUUID()
      setSessionId(newId)
    }
  }, [sessionId])

  const updateAnswerCorrectness = useCallback(
    async (questionId: number, isCorrect: boolean) => {
      if (!user || !sessionId) return

      try {
        const { error } = await supabase
          .from('user_quiz_answers')
          .update({ is_correct: isCorrect })
          .eq('question_id', questionId)
          .eq('profile_id', user.id)
          .eq('session_id', sessionId) // Ensure it applies only to this session

        if (error) {
          console.error('Error updating answer correctness:', error)
          toast.show('Something is going wrong on submission')
          // toast.show('Es gab einen Fehler beim Aktualisieren Ihrer Antwort.')
        } else {
          toast.show('Ihre Antwort wurde aktualisiert!')
          setHasEvaluatedMultipleChoice(true)
        }
      } catch (error) {
        console.error('Error updating response:', error)
      }
    },
    [user, sessionId, supabase, toast]
  )

  const onSubmit = useCallback(
    async ({ answers }) => {
      if (!questions || !user || !sessionId) return

      try {
        const responses = answers.map((answer, index) => {
          const question = questions[index]
          if (!question) return null

          return {
            question_id: question.id,
            profile_id: user.id,
            answer_text: answer.answer_text,
            chosen_option_ids: answerIds[question.id] || [],
            is_correct: answer.is_correct || false,
            session_id: sessionId,
          }
        })

        const validResponses = responses.filter((response) => response !== null)

        // Submit answers with session ID to the backend (trigger will handle session creation)
        const { error } = await supabase.from('user_quiz_answers').insert(validResponses)
        setAreAnswersVisible(true)

        await queryClient.invalidateQueries(['lectures_with_completion', chapterId])
        await queryClient.invalidateQueries(['chapters'])
        if (error) throw error
      } catch (error) {
        console.error('Submission error:', error)
        alert('There was an error submitting your answers.')
      }
    },
    [questions, user, sessionId, answerIds, supabase, toast, queryClient]
  )

  // Fetch answer IDs on component mount or when questions data changes
  useEffect(() => {
    const fetchAnswerIds = async () => {
      if (!questions) return

      const answerIdMap: { [key: number]: number[] } = {}

      await Promise.all(
        questions.map(async (question) => {
          const { data: correctOptions, error: optionsError } = await supabase
            .from('quiz_question_options')
            .select('id')
            .eq('question_id', question.id)
            .eq('is_correct', true)

          if (optionsError) {
            console.error('Error fetching answer options:', optionsError)
            return
          }

          answerIdMap[question.id] = correctOptions?.map((option) => option.id) || []
        })
      )

      setAnswerIds(answerIdMap)
    }

    fetchAnswerIds()
  }, [questions, supabase])

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Quiz' }} />
      <ScrollView f={1} fb={0}>
        <View pb="$8">
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardOpeningTime={0} // Reduces keyboard opening delay
            resetScrollToCoords={{ x: 0, y: 0 }}
          >
            <YStack p="$4" gap="$10" mt="$6">
              {questions?.map((q, index) => (
                <YStack key={q.id} gap="$3">
                  <YStack gap="$1">
                    <SizableText size="$6">{q.question_text}</SizableText>
                    <SizableText size="$3">
                      {q.question_type === 'MULTIPLE_CHOICE' ? 'Einzelauswahl' : 'Offene Antwort'}
                    </SizableText>
                  </YStack>
                  {q.question_type === 'MULTIPLE_CHOICE' ? (
                    <MultiChoicePickReveal
                      control={control}
                      index={index}
                      q={q}
                      answerIds={answerIds[q.id] || []}
                      areAnswersVisible={areAnswersVisible}
                    />
                  ) : (
                    <OpenAnswerTypeReveal
                      areAnswersVisible={areAnswersVisible}
                      control={control}
                      index={index}
                      q={q}
                      hasEvaluatedMultipleChoice={hasEvaluatedMultipleChoice}
                      onRightAnswerClick={() => updateAnswerCorrectness(q.id, true)}
                      onWrongAnswerClick={() => updateAnswerCorrectness(q.id, false)}
                    />
                  )}
                </YStack>
              ))}

              <Theme name="green">
                {!areAnswersVisible && (
                  <Button onPress={handleSubmit(onSubmit)}>Antworten einreichen</Button>
                )}
                {areAnswersVisible && hasEvaluatedMultipleChoice && (
                  <Button onPress={() => router.dismiss(2)}>Zurück zu den Kapiteln</Button>
                )}
              </Theme>
            </YStack>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </>
  )
}

export default QuizForm
