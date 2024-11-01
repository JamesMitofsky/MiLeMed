import { YStack, XStack, Label, RadioGroup } from '@my/ui' // Adjust the import based on your UI library
import React from 'react'
import { Control, Controller } from 'react-hook-form'

import { QuizQuestionsWithOptionsType } from '../../utils/react-query/useQuizQuestions'
import { QuizAnswersType } from '../../utils/supabase/databaseTypes'
import { Chip } from '../general/chipParts'

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
    <Controller
      name={`answers.${index}.chosen_option_ids`}
      control={control}
      render={({ field: { onChange, value } }) => (
        <RadioGroup
          name={`answers.${index}.chosen_option_ids`}
          value={value?.toString()}
          onValueChange={(selectedValue) => !areAnswersVisible && onChange(Number(selectedValue))}
        >
          <YStack gap="$3" ml="$5">
            {q.quiz_question_options.map((o) => (
              <XStack key={o.id} ai="center" gap="$4">
                <RadioGroup.Item size="$5" value={o.id.toString()} id={`option-${index}-${o.id}`}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                {areAnswersVisible && o.is_correct ? (
                  <Chip
                    rounded
                    // @ts-ignore
                    theme={o.is_correct ? 'green' : 'default'}
                    key={o.option_text}
                  >
                    <Chip.Text size="$3">{o.option_text}</Chip.Text>
                  </Chip>
                ) : (
                  <Label htmlFor={`option-${index}-${o.id}`}>{o.option_text}</Label>
                )}
              </XStack>
            ))}
          </YStack>
        </RadioGroup>
      )}
    />
  )
}

export default MultiChoicePickReveal
