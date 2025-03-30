import { Button, Card, SizableText, TextArea, Theme, XStack, YStack } from '@my/ui'
import React, { useState } from 'react'

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
}

interface OpenAnswerTypeRevealProps {
  question: QuizQuestion
  onAnswerSubmitted: (isCorrect: boolean, answerText: string) => void
  showAnswers: boolean
}

const OpenAnswerTypeReveal: React.FC<OpenAnswerTypeRevealProps> = ({
  question,
  onAnswerSubmitted,
  showAnswers,
}) => {
  const [answerText, setAnswerText] = useState('')

  const handleSubmit = () => {
    // For open answers, we'll let the user decide if their answer was correct
    onAnswerSubmitted(true, answerText)
  }

  return (
    <YStack gap="$4">
      <SizableText size="$6" mb="$2">
        {question.question_text}
      </SizableText>
      {!showAnswers ? (
        <YStack gap="$3">
          <TextArea
            size="$3"
            fontWeight="300"
            height={200}
            m="$1"
            placeholder="Ihre Antwort hier"
            value={answerText}
            onChangeText={setAnswerText}
          />
          <Button theme="active" disabled={!answerText.trim()} onPress={handleSubmit} size="$3">
            Antwort einreichen
          </Button>
        </YStack>
      ) : (
        <Card elevate bordered p="$3">
          <YStack gap="$3">
            <XStack gap="$3" ai="center">
              <Theme name="green">
                <SizableText>Richtige Antwort:</SizableText>
              </Theme>
            </XStack>
            <SizableText>{question.correct_answer_text}</SizableText>
            {answerText && (
              <>
                <Theme name="blue">
                  <SizableText>Ihre Antwort:</SizableText>
                </Theme>
                <SizableText>{answerText}</SizableText>
              </>
            )}
          </YStack>
        </Card>
      )}
    </YStack>
  )
}

export default OpenAnswerTypeReveal
