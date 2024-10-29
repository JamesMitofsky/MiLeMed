import useQuizQuestionsQuery from 'app/utils/react-query/useQuizQuestions'
import { QuizAnswersType } from 'app/utils/supabase/databaseTypes'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { Stack } from 'expo-router'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createParam } from 'solito'
import { Checkbox, YStack, Input, SizableText, Button } from 'tamagui'

// type QuizAnswersType = {
//     answer_text: string | null;
//     answered_at: string | null;
//     chosen_option_ids: number[] | null;
//     id: number;
//     is_correct: boolean | null;
//     profile_id: string;
//     question_id: number;
//     updated_at: string | null;
// }

const { useParams } = createParam<{ id: number }>()
const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()
  const { user } = useUser()
  const { data: questions } = useQuizQuestionsQuery(lectureId)
  const { control, handleSubmit } = useForm<{ answers: QuizAnswersType[] }>()
  const supabase = useSupabase()
  const onSubmit = async (answers: { answers: QuizAnswersType[] }) => {
    if (!questions || !user) return

    try {
      const responses = await Promise.all(
        answers.answers.map((answer, index) => {
          const question = questions[index]
          if (!question) return null

          return {
            question_id: question.id,
            profile_id: user.id,
            quiz_attempt_id: 1, // Replace with actual attempt ID
            answer_text: answer.answer_text,
            chosen_option_ids: answer.chosen_option_ids, // Support multiple chosen option IDs
            is_correct: answer.is_correct || false,
          }
        })
      )

      // Filter out null values
      const validResponses = responses.filter(
        (response): response is NonNullable<typeof response> => response !== null
      )

      const { error } = await supabase.from('user_quiz_answers').insert(validResponses)
      if (error) throw error
      alert('Responses submitted successfully!')
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your responses.')
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Quiz' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <YStack p="$4" gap="$6">
          {questions?.map((q, index) => (
            <YStack key={q.id} gap="$4">
              <SizableText size="$4">{q.question_text}</SizableText>
              {q.question_type === 'MULTIPLE_CHOICE' ? (
                q.quiz_question_options.map((o) => (
                  <>
                    <SizableText size="$3">{o.option_text}</SizableText>
                    <Controller
                      key={o.id}
                      name={`answers.${index}.chosen_option_ids`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          value={o.id.toString()}
                          checked={value?.includes(o.id)}
                          onCheckedChange={() => {
                            const newValue = value?.includes(o.id)
                              ? value.filter((id: number) => id !== o.id)
                              : [...(value || []), o.id]
                            onChange(newValue)
                          }}
                        >
                          <Checkbox.Indicator />
                        </Checkbox>
                      )}
                    />
                  </>
                ))
              ) : (
                <Controller
                  name={`answers.${index}.answer_text`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Input placeholder="Your Answer" value={value || ''} onChangeText={onChange} />
                  )}
                />
              )}
            </YStack>
          ))}
          <Button onPress={handleSubmit(onSubmit)}>Submit Answers</Button>
        </YStack>
      </SafeAreaView>
    </>
  )
}

export default QuizForm
