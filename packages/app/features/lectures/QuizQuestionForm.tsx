import { zodResolver } from '@hookform/resolvers/zod'
import { YStack, XStack, Button, Input, SizableText } from '@my/ui'
import { Save, Plus, Trash, Check } from '@tamagui/lucide-icons'
import React, { useCallback, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Checkbox, TextArea } from 'tamagui'

import { addQuizQuestion } from '../../utils/supabase/simpleQueries/addQuizQuestion'
import { useSupabase } from '../../utils/supabase/useSupabase'
import { z } from '../../utils/zod-de'
import { CustomSelect } from '../general/CustomSelect'

interface QuizQuestionOption {
  option_text: string
  is_correct: boolean
}

export interface QuizQuestionFormData {
  question_text: string
  question_type: 'OPEN' | 'MULTIPLE_CHOICE'
  options: QuizQuestionOption[]
}

interface QuizQuestionFormProps {
  onSubmitSuccess: () => void
  lectureId?: number
  initialData?: QuizQuestionFormData
}

const questionTypes = [
  { label: 'Open-ended', value: 'OPEN' },
  { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
]

const quizQuestionSchema = z.object({
  question_text: z.string().nonempty('Question text is required'),
  question_type: z.enum(['OPEN', 'MULTIPLE_CHOICE']),
  options: z
    .array(
      z.object({
        option_text: z.string().nonempty('Option text is required'),
        is_correct: z.boolean(),
      })
    )
    .min(1, 'At least one option is required for multiple choice questions')
    .refine((options) => options.every((option) => option.option_text.trim() !== ''), {
      message: 'Each option must have text',
    }),
})

const QuizQuestionForm: React.FC<QuizQuestionFormProps> = ({
  onSubmitSuccess,
  lectureId,
  initialData,
}) => {
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
  const questionType = watch('question_type')

  const handleAddOption = useCallback(
    () => append({ option_text: '', is_correct: false }),
    [append]
  )

  const handleRemoveOption = useCallback((index: number) => remove(index), [remove])

  const submitForm = useCallback(
    async (data: QuizQuestionFormData) => {
      if (!lectureId) return
      try {
        await addQuizQuestion(supabase, lectureId, data)
        reset()
        console.log('submitted to lectureID: ', lectureId)
        onSubmitSuccess()
      } catch (error) {
        console.error('Failed to add quiz question:', error)
      }
    },
    [lectureId, addQuizQuestion, supabase, reset, onSubmitSuccess]
  )

  // reset options on question type change
  useEffect(() => {
    reset({ ...watch(), options: [{ option_text: '', is_correct: false }] })
  }, [questionType, reset, watch])

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
