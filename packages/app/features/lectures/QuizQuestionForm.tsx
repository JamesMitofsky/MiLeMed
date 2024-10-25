import { YStack, XStack, Button, Input, SizableText } from '@my/ui'
import { Save, Plus, Trash } from '@tamagui/lucide-icons'
import React, { useCallback } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

import { addQuizQuestion } from '../../utils/supabase/simpleQueries/addQuizQuestion'
import { useSupabase } from '../../utils/supabase/useSupabase'
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

const QuizQuestionForm: React.FC<QuizQuestionFormProps> = ({
  onSubmitSuccess,
  lectureId,
  initialData,
}) => {
  const { control, handleSubmit, watch, reset } = useForm<QuizQuestionFormData>({
    defaultValues: initialData || {
      question_text: '',
      question_type: 'OPEN',
      options: [{ option_text: '', is_correct: false }],
    },
  })
  const supabase = useSupabase()
  const { fields, append, remove } = useFieldArray({ control, name: 'options' })
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
  return (
    <>
      <YStack gap="$4" p="$5" borderWidth={1} borderColor="$gray3" borderRadius="$2">
        <SizableText fontWeight="bold" size="$5">
          {initialData ? 'Edit Quiz Question' : 'Create New Quiz Question'}
        </SizableText>

        <Controller
          name="question_text"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Question text" size="$3" />}
        />

        <Controller
          name="question_type"
          control={control}
          render={({ field }) => (
            <CustomSelect placeholder="Question Type" {...field} items={questionTypes} />
          )}
        />

        {questionType === 'MULTIPLE_CHOICE' && (
          <YStack gap="$3">
            <SizableText fontWeight="bold">Options:</SizableText>
            {fields.map((option, index) => (
              <XStack key={option.id} gap="$2" alignItems="center">
                <Controller
                  name={`options.${index}.option_text`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder={`Option ${index + 1}`} size="$2" />
                  )}
                />
                <Controller
                  name={`options.${index}.is_correct`}
                  control={control}
                  render={({ field: { value, ...field } }) => (
                    <input
                      {...field}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
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
            <Button themeShallow size="$2" icon={Plus} onPress={handleAddOption}>
              Add Option
            </Button>
          </YStack>
        )}

        <Button themeInverse size="$3" icon={Save} onPress={handleSubmit(submitForm)}>
          {initialData ? 'Update Question' : 'Save Question'}
        </Button>
      </YStack>
    </>
  )
}

export default QuizQuestionForm
