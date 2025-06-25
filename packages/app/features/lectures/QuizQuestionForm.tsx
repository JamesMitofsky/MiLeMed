import { zodResolver } from '@hookform/resolvers/zod'
import { YStack, XStack, Button, Input, SizableText } from '@my/ui'
import { Save, Plus, Trash, Check } from '@tamagui/lucide-icons'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Checkbox, TextArea } from 'tamagui'

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
}

interface QuizQuestionFormProps {
  onSubmitSuccess: (questionData?: QuizQuestionFormData) => void
  lectureId?: number
  initialData?: QuizQuestionFormData
  questionId?: number // Add questionId for existing questions
  tempQuestion?: boolean
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
  onSubmitSuccess,
  lectureId,
  initialData,
  questionId, // Add questionId
  tempQuestion = false,
}) => {
  console.log('QuizQuestionForm initialData:', initialData);
  
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuizQuestionFormData>({
    resolver: zodResolver(quizQuestionSchema),
    defaultValues: initialData || {
      question_text: '',
      question_type: 'MULTIPLE_CHOICE',
      options: [{ option_text: '', is_correct: false }],
    },
  })

  const supabase = useSupabase()
  const { fields: options, append, remove } = useFieldArray({ control, name: 'options' })
  console.log('Field array options:', options);
  
  const questionType = watch('question_type')

  const handleAddOption = useCallback(
    () => append({ option_text: '', is_correct: false }),
    [append]
  )

  const handleRemoveOption = useCallback((index: number) => remove(index), [remove])

  const submitForm = useCallback(
    async (data: QuizQuestionFormData) => {
      try {
        // If this is a temporary question (during lecture creation), just pass the data back
        if (tempQuestion) {
          console.log('Temporary question - passing data back', data)
          onSubmitSuccess(data)
          reset()
          return
        }

        // For database operations, we need a lectureId
        if (!lectureId) {
          console.error('No lectureId provided')
          return
        }
        
        // Check if this is an edit or a new question
        if (questionId) {
          console.log('UPDATING existing question ID:', questionId, 'with data:', data)
          await updateQuizQuestion(supabase, questionId, data)
          console.log('Question updated successfully')
        } else {
          console.log('ADDING new question to lectureID:', lectureId, 'with data:', data)
          await addQuizQuestion(supabase, lectureId, data)
          console.log('Question added successfully')
        }
        
        reset()
        onSubmitSuccess()
      } catch (error) {
        console.error('Failed to save quiz question:', error)
      }
    },
    [lectureId, questionId, addQuizQuestion, updateQuizQuestion, supabase, reset, onSubmitSuccess, tempQuestion]
  )

  // Store initial question type to detect actual changes
  const [initialQuestionType, setInitialQuestionType] = useState<string | null>(null);
  
  // Set initial question type on first render
  useEffect(() => {
    if (initialQuestionType === null) {
      setInitialQuestionType(questionType);
      console.log('Setting initial question type:', questionType);
    }
  }, [questionType, initialQuestionType]);
  
  // Only reset options when question type changes from its initial value
  useEffect(() => {
    // Skip if we don't have initialQuestionType yet
    if (initialQuestionType === null) return;
    
    // Skip on first render or if question type hasn't changed
    if (questionType === initialQuestionType) return;
    
    console.log('Question type changed from', initialQuestionType, 'to', questionType, '- resetting options');
    reset({ ...watch(), options: [{ option_text: '', is_correct: false }] });
  }, [questionType, initialQuestionType, reset, watch])

  return (
    <>
      <YStack gap="$4" p="$5" borderWidth={1} borderColor="$gray3" borderRadius="$2">
        <SizableText fontWeight="bold" size="$5">
          {initialData ? 'Edit Quiz Question' : 'Create New Quiz Question'}
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

        <Controller
          name="question_type"
          control={control}
          render={({ field }) => (
            <CustomSelect placeholder="Question Type" {...field} items={questionTypes} />
          )}
        />

        {questionType === 'MULTIPLE_CHOICE' ? (
          <YStack gap="$3">
            <SizableText fontWeight="bold">Options:</SizableText>

            {errors.options && (
              <SizableText color="red">
                {errors.options.message || 'At least one option must be marked as correct'}
              </SizableText>
            )}

            {options.map((option, index) => (
              <XStack key={option.id} gap="$6" alignItems="center">
                <Controller
                  name={`options.${index}.option_text`}
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input {...field} placeholder={`Option ${index + 1}`} />
                      {errors.options?.[index]?.option_text && (
                        <SizableText color="red">
                          {errors.options[index].option_text.message}
                        </SizableText>
                      )}
                    </>
                  )}
                />

                <Controller
                  name={`options.${index}.is_correct`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(v === true)}
                      size="$6"
                    >
                      <Checkbox.Indicator>
                        <Check />
                      </Checkbox.Indicator>
                    </Checkbox>
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
          {initialData ? 'Update Question' : 'Save Question'}
        </Button>
      </YStack>
    </>
  )
}

export default QuizQuestionForm
