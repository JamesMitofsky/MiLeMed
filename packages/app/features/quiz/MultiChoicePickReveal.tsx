import { YStack, XStack, Checkbox, SizableText } from '@my/ui' // Adjust the import based on your UI library
import { Check } from '@tamagui/lucide-icons' // Adjust the import based on your icon library
import React from 'react'
import { Control, Controller } from 'react-hook-form'

import { QuizQuestionsWithOptionsType } from '../../utils/react-query/useQuizQuestions'
import { QuizAnswersType } from '../../utils/supabase/databaseTypes'

interface MultiChoicePickRevealProps {
  q: QuizQuestionsWithOptionsType
  index: number
  control: Control<{
    answers: QuizAnswersType[]
  }>
  answerIds: number[]
  areAnswersVisible: boolean
}

const MultiChoicePickReveal: React.FC<MultiChoicePickRevealProps> = ({
  q,
  index,
  control,
  answerIds,
  areAnswersVisible,
}) => {
  return (
    <YStack gap="$6">
      {q.quiz_question_options.map((o) => (
        <XStack key={o.id} ai="center" gap="$3">
          {!areAnswersVisible && (
            <Controller
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
          )}
          <SizableText
            size="$3"
            style={{
              color: areAnswersVisible && answerIds.includes(o.id) ? 'green' : 'inherit',
            }}
          >
            {o.option_text}
          </SizableText>
        </XStack>
      ))}
    </YStack>
  )
}

export default MultiChoicePickReveal
