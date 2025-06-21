import { YStack, XStack, Label, RadioGroup } from '@my/ui'
import React from 'react'

import { Chip } from '../general/chipParts'

interface QuizQuestion {
  question_id: number
  question_text: string
  question_type: 'OPEN' | 'MULTIPLE_CHOICE'
  answer_text: string | null
  chosen_option_ids: number[]
  correct_option_ids: number[]
  correct_answer_text: string | null
  is_correct: boolean | null
  answered_at: string | null
  options?: {
    id: number
    text: string
    is_correct: boolean
  }[]
}

interface MultiChoicePickRevealProps {
  question: QuizQuestion
  onAnswerSelected: (selectedIds: number[]) => void
  onAnswerSubmitted: (isCorrect: boolean) => void
  showAnswers: boolean
}

const MultiChoicePickReveal: React.FC<MultiChoicePickRevealProps> = ({
  question,
  onAnswerSelected,
  onAnswerSubmitted,
  showAnswers,
}) => {
  const handleAnswerSelect = (selectedIds: number[]) => {
    onAnswerSelected(selectedIds)
    if (showAnswers) {
      const isCorrect =
        selectedIds.length === question.correct_option_ids.length &&
        selectedIds.every((id) => question.correct_option_ids.includes(id))
      onAnswerSubmitted(isCorrect)
    }
  }

  return (
    <YStack gap="$4">
      <Label size="$6" mb="$2">
        {question.question_text}
      </Label>
      <RadioGroup
        onValueChange={(value) => handleAnswerSelect([parseInt(value, 10)])}
        value={question.chosen_option_ids?.[0]?.toString()}
      >
        <XStack fw="wrap" gap="$2">
          {question.options?.map((option) => (
            <RadioGroup.Item
              key={option.id}
              value={option.id.toString()}
              size="$4"
              disabled={showAnswers}
            >
              <Chip rounded unstyled={false} size="$3">
                <Chip.Text>{option.text}</Chip.Text>
              </Chip>
            </RadioGroup.Item>
          ))}
        </XStack>
      </RadioGroup>
    </YStack>
  )
}

export default MultiChoicePickReveal
