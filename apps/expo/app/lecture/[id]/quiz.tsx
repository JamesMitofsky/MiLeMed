import useQuizQuestionsQuery from 'app/utils/react-query/useQuizQuestions'
import { QuizAnswersType } from 'app/utils/supabase/databaseTypes'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { Stack } from 'expo-router'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createParam } from 'solito'
import { Label, Checkbox, YStack, Input, SizableText, Button } from 'tamagui'

const { useParams } = createParam<{ id: number }>()

const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()
  const { user } = useUser()

  const { data: questions, isLoading } = useQuizQuestionsQuery(lectureId)
  const { control, handleSubmit } = useForm<QuizAnswersType>()
  const supabase = useSupabase()

  const onSubmit = async (data: QuizAnswersType) => {
    if (!questions || !user) return
    try {
      const responses = await Promise.all(
        questions.map(async (q) => {
          if (q.question_type === 'MULTIPLE_CHOICE') {
            // For multiple-choice, check if the chosen option is correct
            const chosenOptionId = parseInt(data[`answer_${q.id}`], 10)
            const { data: option, error } = await supabase
              .from('quiz_question_options')
              .select('is_correct')
              .eq('id', chosenOptionId)
              .single()

            if (error) {
              console.error('Error fetching option:', error)
              throw error
            }

            return {
              question_id: q.id,
              profile_id: user.id, // Replace with actual authenticated user profile ID
              quiz_attempt_id: 1, // Replace with actual attempt ID
              answer_text: null,
              chosen_option_id: chosenOptionId,
              is_correct: option?.is_correct || false,
            }
          } else {
            // For open-ended questions, mark as correct
            return {
              question_id: q.id,
              profile_id: user.id, // Replace with actual authenticated user profile ID
              quiz_attempt_id: 1, // Replace with actual attempt ID
              answer_text: data[`answer_${q.id}`] || null,
              chosen_option_id: null,
              is_correct: true,
            }
          }
        })
      )

      // Insert all responses in bulk
      const { error } = await supabase.from('quiz_answers').insert(responses)
      if (error) throw error
      alert('Responses submitted successfully!')
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your responses.')
    }
  }

  if (isLoading) return <Label>Loading...</Label>

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Quiz' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <YStack p="$4" gap="$6">
          {questions?.map((q) => (
            <YStack key={q.id} gap="$4">
              <SizableText size="$4">{q.question_text}</SizableText>
              {q.question_type === 'MULTIPLE_CHOICE' ? (
                q.quiz_question_options.map((o) => (
                  <Controller
                    key={o.id}
                    // @ts-ignore
                    name={`answer_${q.id}`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        value={o.id.toString()}
                        checked={value === o.id.toString()}
                        // @ts-ignore
                        onChange={() => onChange(o.id.toString())}
                      >
                        {o.option_text}
                      </Checkbox>
                    )}
                  />
                ))
              ) : (
                <Controller
                  // @ts-ignore
                  name={`answer_${q.id}`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    // @ts-ignore
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
