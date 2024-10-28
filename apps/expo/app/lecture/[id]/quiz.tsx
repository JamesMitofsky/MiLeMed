import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import useQuizQuestionsQuery from 'app/utils/react-query/useQuizQuestions'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { Stack } from 'expo-router'
import React, { useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Input, Label, Checkbox, YStack } from 'tamagui'
import { z } from 'zod'

// Define types for form data
type QuizAnswerFormData = {
  answers: {
    question_id: number
    answer_text?: string
    chosen_option_id?: number
  }[]
}

// Zod schema for form validation
export const quizAnswerSchema = z.object({
  answers: z.array(
    z.object({
      question_id: z.number(),
      answer_text: z.string().optional(), // For open questions
      chosen_option_id: z.number().optional(), // For multiple choice
    })
  ),
})

const QuizForm: React.FC = () => {
  const lectureId = useMemo(() => 1, []) // Example lecture ID
  const { user } = useUser()

  const { data: questions, isLoading } = useQuizQuestionsQuery(lectureId)
  const supabase = useSupabase()

  const { control, handleSubmit } = useForm<QuizAnswerFormData>({
    resolver: zodResolver(quizAnswerSchema),
    defaultValues: useMemo(() => ({ answers: [] }), []),
  })

  // Function to create a new quiz attempt
  const createQuizAttempt = useCallback(
    async (lectureId: number, profileId: string): Promise<number> => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert([
          {
            lecture_id: lectureId,
            profile_id: profileId,
            attempt_number: 1, // You may need to calculate the correct attempt number
          },
        ])
        .select('id')
        .single()

      if (error) throw error
      return data.id // Return the new quiz_attempt_id
    },
    [supabase]
  )

  // Mutation to handle quiz attempt creation and answer submission
  const mutation = useMutation(
    useCallback(
      async (formData: QuizAnswerFormData) => {
        // Step 1: Create a new quiz attempt
        if (!user) throw new Error('User was expected to exist but is not found')
        const quizAttemptId = await createQuizAttempt(lectureId, user?.id)

        // Step 2: Fetch correct answers for validation
        const { data: correctAnswers, error: correctAnswersError } = await supabase
          .from('quiz_question_options')
          .select('id, question_id, is_correct')
          .in(
            'question_id',
            formData.answers.map((answer) => answer.question_id)
          )

        if (correctAnswersError) throw correctAnswersError

        // Step 3: Submit the answers, marking them as correct or incorrect
        const { data, error } = await supabase.from('quiz_answers').insert(
          formData.answers.map((answer) => {
            const correctOption = correctAnswers.find(
              (option) =>
                option.question_id === answer.question_id && option.id === answer.chosen_option_id
            )

            return {
              question_id: answer.question_id,
              profile_id: user.id,
              quiz_attempt_id: quizAttemptId,
              answer_text: answer.answer_text || null,
              chosen_option_id: answer.chosen_option_id || null,
              is_correct: correctOption?.is_correct || false, // Mark as correct if it matches
            }
          })
        )

        if (error) throw error
        return data
      },
      [createQuizAttempt, lectureId, user, supabase]
    )
  )

  const onSubmit = useCallback(
    (data: QuizAnswerFormData) => {
      mutation.mutate(data)
    },
    [mutation]
  )

  const renderQuestion = useCallback(
    (question, index) => (
      <YStack key={question.id}>
        <Label>{question.question_text}</Label>
        {question.question_type === 'MULTIPLE_CHOICE' ? (
          // Render multiple choice options
          question.quiz_question_options.map((option) => (
            <Controller
              key={option.id}
              control={control}
              name={`answers.${index}.chosen_option_id`}
              render={({ field }) => (
                <Checkbox
                  value={option.id.toString()}
                  // @ts-ignore
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  {option.option_text}
                </Checkbox>
              )}
            />
          ))
        ) : (
          // Render open answer input
          <Controller
            control={control}
            name={`answers.${index}.answer_text`}
            render={({ field }) => (
              <Input
                placeholder="Your answer"
                value={field.value || ''}
                // @ts-ignore
                onChangeText={field.onChange}
              />
            )}
          />
        )}
      </YStack>
    ),
    [control]
  )

  if (isLoading) return <Label>Loading...</Label>

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Quiz' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <YStack>
          {questions?.map(renderQuestion)}
          <Button onPress={handleSubmit(onSubmit)}>Submit Answers</Button>
        </YStack>
      </SafeAreaView>
    </>
  )
}

export default QuizForm
