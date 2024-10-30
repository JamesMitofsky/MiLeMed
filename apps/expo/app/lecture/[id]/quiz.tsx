import { ScrollView, useToastController, View } from '@my/ui'
import MultiChoicePickReveal from 'app/features/quiz/MultiChoicePickReveal'
import OpenAnswerTypeReveal from 'app/features/quiz/OpenAnswerTypeReveal'
import useQuizQuestionsQuery from 'app/utils/react-query/useQuizQuestions'
import { QuizAnswersType } from 'app/utils/supabase/databaseTypes'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createParam } from 'solito'
import { YStack, SizableText, Button } from 'tamagui'

const { useParams } = createParam<{ id: number }>()
const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()
  const router = useRouter()
  const { user } = useUser()
  const { data: questions } = useQuizQuestionsQuery(lectureId)
  const { control, handleSubmit } = useForm<{ answers: QuizAnswersType[] }>()
  const supabase = useSupabase()

  const [answerIds, setAnswerIds] = useState<{ [key: number]: number[] }>({})
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)

  const toast = useToastController()

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

  const onSubmit = async (answers: { answers: QuizAnswersType[] }) => {
    if (!questions || !user) return

    try {
      const responses = answers.answers.map((answer, index) => {
        const question = questions[index]
        if (!question) return null

        const singleResponse: Pick<
          QuizAnswersType,
          'question_id' | 'profile_id' | 'answer_text' | 'chosen_option_ids' | 'is_correct'
        > = {
          question_id: question.id,
          profile_id: user.id,
          answer_text: answer.answer_text,
          chosen_option_ids: answerIds[question.id] || [],
          is_correct: answer.is_correct || false,
        }

        return singleResponse
      })

      const validResponses = responses.filter(
        (response): response is NonNullable<typeof response> => response !== null
      )

      setAreAnswersVisible(true)

      const { error } = await supabase.from('user_quiz_answers').insert(validResponses)
      if (error) throw error
      toast.show('Antworten erfolgreich eingereicht!', { type: 'success' })
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your responses.')
    }
  }

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
                      {q.question_type === 'MULTIPLE_CHOICE' ? 'Mehrfachauswahl' : 'Offene Antwort'}
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
                    />
                  )}
                </YStack>
              ))}
              {areAnswersVisible ? (
                <Button onPress={() => router.dismiss(2)}>Zurück zu den Kapiteln</Button>
              ) : (
                <Button onPress={handleSubmit(onSubmit)}>Antworten einreichen</Button>
              )}
            </YStack>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </>
  )
}

export default QuizForm
