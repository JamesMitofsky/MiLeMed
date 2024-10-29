import { ScrollView, View } from '@my/ui'
import { Check } from '@tamagui/lucide-icons'
import useQuizQuestionsQuery from 'app/utils/react-query/useQuizQuestions'
import { QuizAnswersType } from 'app/utils/supabase/databaseTypes'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { Stack } from 'expo-router'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createParam } from 'solito'
import { Checkbox, YStack, SizableText, Button, XStack, TextArea } from 'tamagui'

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

          const singleResponse: Pick<
            QuizAnswersType,
            'question_id' | 'profile_id' | 'answer_text' | 'chosen_option_ids' | 'is_correct'
          > = {
            question_id: question.id,
            profile_id: user.id,
            answer_text: answer.answer_text,
            chosen_option_ids: answer.chosen_option_ids,
            is_correct: answer.is_correct || false,
          }

          return singleResponse
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
                    <YStack gap="$6">
                      {q.quiz_question_options.map((o) => (
                        <XStack ai="center" gap="$3">
                          <Controller
                            key={o.id}
                            name={`answers.${index}.chosen_option_ids`}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Checkbox
                                size="$7"
                                value={o.id.toString()}
                                checked={value?.includes(o.id)}
                                onCheckedChange={() => {
                                  const newValue = value?.includes(o.id)
                                    ? value.filter((id: number) => id !== o.id)
                                    : [...(value || []), o.id]
                                  onChange(newValue)
                                }}
                              >
                                <Checkbox.Indicator>
                                  <Check />
                                </Checkbox.Indicator>
                              </Checkbox>
                            )}
                          />
                          <SizableText size="$3">{o.option_text}</SizableText>
                        </XStack>
                      ))}
                    </YStack>
                  ) : (
                    <>
                      <Controller
                        name={`answers.${index}.answer_text`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextArea
                            size="$3"
                            fontWeight="300"
                            height={300}
                            m="$1"
                            placeholder="Ihr Inhalt hier"
                            value={value || ''}
                            onChangeText={onChange}
                          />
                        )}
                      />
                    </>
                  )}
                </YStack>
              ))}
              <Button onPress={handleSubmit(onSubmit)}>Antworten einreichen</Button>
            </YStack>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </>
  )
}

export default QuizForm
