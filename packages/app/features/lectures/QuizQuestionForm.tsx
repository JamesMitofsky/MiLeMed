import { zodResolver } from '@hookform/resolvers/zod'
import { YStack, XStack, Button, Input, SizableText, useToastController } from '@my/ui'
import { Save, Plus, Trash } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { RadioGroup, TextArea } from 'tamagui'

import { addQuizQuestion } from '../../utils/supabase/simpleQueries/addQuizQuestion'
import { updateQuizQuestion } from '../../utils/supabase/simpleQueries/updateQuizQuestion'
import { useSupabase } from '../../utils/supabase/useSupabase'
import { z } from '../../utils/zod-de'
import { CustomSelect } from '../general/CustomSelect'

export interface QuizQuestionOption {
  option_text: string
  is_correct: boolean
}

export interface QuizQuestionFormData {
  question_text: string
  question_type: 'OPEN' | 'MULTIPLE_CHOICE'
  options: QuizQuestionOption[]
  question_id?: number // Optional ID for existing questions
}

interface QuizQuestionFormProps {
  lectureId: number
  questionId?: number // If provided, will fetch and update existing question
  onSuccess?: () => void // Optional callback after successful save
}

const questionTypes = [
  { label: 'Open-ended', value: 'OPEN' },
  { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
]

const quizQuestionSchema = z
  .object({
    question_text: z.string().min(1, 'Question text is required'),
    question_type: z.enum(['OPEN', 'MULTIPLE_CHOICE']),
    options: z
      .array(
        z.object({
          option_text: z.string().min(1, 'Option text is required'),
          is_correct: z.boolean(),
        })
      )
      .min(1, 'At least one option is required for multiple choice questions'),
  })
  .superRefine((data, ctx) => {
    if (data.question_type === 'MULTIPLE_CHOICE') {
      const hasCorrectOption = data.options.some((option) => option.is_correct)
      if (!hasCorrectOption) {
        ctx.addIssue({
          code: 'custom', // Specify 'custom' as the code for custom validation errors
          path: ['options'],
          message: 'At least one option must be marked as correct',
        })
      }
    }
  })

const QuizQuestionForm: React.FC<QuizQuestionFormProps> = ({
  lectureId,
  questionId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabase()
  const toast = useToastController()
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuizQuestionFormData>({
    resolver: zodResolver(quizQuestionSchema),
    defaultValues: {
      question_text: '',
      question_type: 'MULTIPLE_CHOICE',
      options: [{ option_text: '', is_correct: false }],
    },
  })

  const { fields: options, append, remove } = useFieldArray({ control, name: 'options' })

  const questionType = watch('question_type')
  const allOptions = watch('options')

  // Get the index of the currently selected correct option
  const correctOptionIndex = allOptions.findIndex((opt) => opt.is_correct)

  // Handler to update which option is correct (for radio button)
  const handleCorrectOptionChange = useCallback(
    (index: number) => {
      // Set all options to false, then set the selected one to true
      const updatedOptions = allOptions.map((opt, i) => ({
        ...opt,
        is_correct: i === index,
      }))
      reset({ ...watch(), options: updatedOptions })
    },
    [allOptions, reset, watch]
  )

  // Fetch existing question data if questionId is provided
  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!questionId) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch question details
        const { data: question, error: questionError } = await supabase
          .from('quiz_questions')
          .select('id, question_text, question_type')
          .eq('id', questionId)
          .single()

        if (questionError) throw questionError

        // Fetch options
        const { data: dbOptions, error: optionsError } = await supabase
          .from('quiz_options')
          .select('id, option_text')
          .eq('question_id', questionId)

        if (optionsError) throw optionsError

        // Fetch reference answers to determine which options are correct
        const { data: refAnswers, error: refError } = await supabase
          .from('quiz_reference_answers')
          .select('option_id, answer_text')
          .eq('question_id', questionId)

        if (refError) throw refError

        // Build options array with is_correct flags
        const formattedOptions =
          dbOptions?.map((opt) => ({
            option_text: opt.option_text,
            is_correct: refAnswers?.some((ref) => ref.option_id === opt.id) || false,
          })) || []

        // For OPEN questions, use answer_text from reference answers
        if (question.question_type === 'OPEN' && refAnswers?.[0]?.answer_text) {
          formattedOptions[0] = {
            option_text: refAnswers[0].answer_text,
            is_correct: true,
          }
        }

        // Reset form with fetched data
        reset({
          question_text: question.question_text,
          question_type: question.question_type,
          options:
            formattedOptions.length > 0
              ? formattedOptions
              : [{ option_text: '', is_correct: false }],
        })
      } catch (error) {
        console.error('Failed to fetch question data:', error)
        toast.show('Failed to load question data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestionData()
  }, [questionId, supabase, reset, toast])

  const handleAddOption = useCallback(
    () => append({ option_text: '', is_correct: false }),
    [append]
  )

  const handleRemoveOption = useCallback((index: number) => remove(index), [remove])

  const submitForm = useCallback(
    async (data: QuizQuestionFormData) => {
      try {
        if (questionId) {
          // Update existing question
          await updateQuizQuestion(supabase, questionId, data)
          toast.show('Question updated successfully')
        } else {
          // Create new question
          await addQuizQuestion(supabase, lectureId, data)
          toast.show('Question added successfully')
          reset() // Only reset form for new questions
        }

        // Invalidate relevant caches
        queryClient.invalidateQueries({ queryKey: ['quiz-questions'] })
        queryClient.invalidateQueries({ queryKey: ['quiz-options'] })
        queryClient.invalidateQueries({ queryKey: ['quiz-reference-answers'] })

        // Call success callback if provided
        onSuccess?.()
      } catch (error) {
        console.error('Failed to save quiz question:', error)
        toast.show('Failed to save quiz question')
      }
    },
    [lectureId, questionId, supabase, reset, queryClient, toast, onSuccess]
  )

  // Store initial question type to detect actual changes
  const [initialQuestionType, setInitialQuestionType] = useState<string | null>(null)

  // Set initial question type on first render
  useEffect(() => {
    if (initialQuestionType === null) {
      setInitialQuestionType(questionType)
      console.log('Setting initial question type:', questionType)
    }
  }, [questionType, initialQuestionType])

  // Only reset options when question type changes from its initial value
  useEffect(() => {
    // Skip if we don't have initialQuestionType yet
    if (initialQuestionType === null) return

    // Skip on first render or if question type hasn't changed
    if (questionType === initialQuestionType) return

    console.log(
      'Question type changed from',
      initialQuestionType,
      'to',
      questionType,
      '- resetting options'
    )
    reset({ ...watch(), options: [{ option_text: '', is_correct: false }] })
  }, [questionType, initialQuestionType, reset, watch])

  if (isLoading) {
    return (
      <YStack gap="$4" p="$5" borderWidth={1} borderRadius="$2" ai="center" jc="center">
        <SizableText>Loading question data...</SizableText>
      </YStack>
    )
  }

  return (
    <>
      <YStack gap="$4" p="$5" borderRadius="$2">
        <SizableText fontWeight="bold" size="$5">
          {questionId ? 'Edit Quiz Question' : 'Create New Quiz Question'}
        </SizableText>

        <Controller
          name="question_text"
          control={control}
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Question text" size="$3" />
              {errors.question_text && (
                <SizableText color="red">{errors.question_text.message}</SizableText>
              )}
            </>
          )}
        />

        {!questionId ? (
          <Controller
            name="question_type"
            control={control}
            render={({ field }) => (
              <CustomSelect placeholder="Question Type" {...field} items={questionTypes} />
            )}
          />
        ) : (
          <SizableText fontWeight="bold">Question Type: {questionType}</SizableText>
        )}

        {questionType === 'MULTIPLE_CHOICE' ? (
          <YStack gap="$3">
            <SizableText fontWeight="bold">Options:</SizableText>

            {errors.options && (
              <SizableText color="red">
                {errors.options.message || 'At least one option must be marked as correct'}
              </SizableText>
            )}

            <RadioGroup
              value={correctOptionIndex.toString()}
              onValueChange={(value) => handleCorrectOptionChange(parseInt(value, 10))}
              gap="$3"
            >
              {options.map((option, index) => (
                <XStack key={option.id} gap="$3" alignItems="center">
                  <RadioGroup.Item value={index.toString()} id={`option-${index}`} size="$4">
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>

                  <Controller
                    name={`options.${index}.option_text`}
                    control={control}
                    render={({ field }) => (
                      <YStack f={1}>
                        <Input {...field} placeholder={`Option ${index + 1}`} f={1} />
                        {errors.options?.[index]?.option_text && (
                          <SizableText color="red">
                            {errors.options[index].option_text.message}
                          </SizableText>
                        )}
                      </YStack>
                    )}
                  />

                  <Button
                    themeShallow
                    size="$2"
                    icon={Trash}
                    onPress={() => handleRemoveOption(index)}
                  />
                </XStack>
              ))}
            </RadioGroup>

            <Button themeShallow icon={Plus} onPress={handleAddOption}>
              Add Option
            </Button>
          </YStack>
        ) : (
          <Controller
            name="options.0.option_text"
            control={control}
            render={({ field }) => (
              <>
                <TextArea
                  {...field}
                  fontWeight="300"
                  height={300}
                  placeholder="Quiz answer content here"
                />
                {errors.options?.[0]?.option_text && (
                  <SizableText color="red">{errors.options[0].option_text.message}</SizableText>
                )}
              </>
            )}
          />
        )}

        <Button themeInverse size="$3" icon={Save} onPress={handleSubmit(submitForm)}>
          {questionId ? 'Update Question' : 'Save Question'}
        </Button>
      </YStack>
    </>
  )
}

export default QuizQuestionForm
