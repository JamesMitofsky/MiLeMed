import { SizableText, TextArea, YStack } from '@my/ui' // Adjust the import based on your UI library
import React from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'

import { QuizQuestionsWithOptionsType } from '../../utils/react-query/useQuizQuestions'
import { QuizAnswersType } from '../../utils/supabase/databaseTypes'

interface OpenAnswerTypeRevealProps {
  q: QuizQuestionsWithOptionsType
  index: number
  control: Control<{
    answers: QuizAnswersType[]
  }>
  areAnswersVisible: boolean
}

const OpenAnswerTypeReveal: React.FC<OpenAnswerTypeRevealProps> = ({
  q,
  index,
  control,
  areAnswersVisible,
}) => {
  const answerText = useWatch({
    control,
    name: `answers.${index}.answer_text`,
  })

  console.log(q)

  return !areAnswersVisible ? (
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
  ) : (
    <YStack gap="$5">
      <YStack gap="$1">
        <SizableText size="$4" fontWeight="500">
          Ihre Antwort:
        </SizableText>
        <SizableText>{answerText || 'Keine Antwort gegeben'}</SizableText>
      </YStack>
      <YStack gap="$1">
        <SizableText size="$4" fontWeight="500" color="green" mt="$2">
          Richtige Antwort:
        </SizableText>
        <SizableText>
          {q.quiz_question_options[0].option_text || 'Keine richtige Antwort verfügbar'}
        </SizableText>
      </YStack>
    </YStack>
  )
}

export default OpenAnswerTypeReveal
