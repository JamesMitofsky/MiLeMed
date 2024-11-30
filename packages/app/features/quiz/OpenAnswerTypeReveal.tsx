import { Button, Card, SizableText, TextArea, Theme, XStack, YStack } from '@my/ui' // Adjust the import based on your UI library
import React from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'

import { QuizQuestionsWithOptionsType } from '../../utils/react-query/useFetchQuizQuestions'
import { QuizAnswersType } from '../../utils/supabase/databaseTypes'

interface OpenAnswerTypeRevealProps {
  q: QuizQuestionsWithOptionsType
  index: number
  control: Control<{
    answers: QuizAnswersType[]
  }>
  areAnswersVisible: boolean
  onWrongAnswerClick: () => void
  onRightAnswerClick: () => void
  hasEvaluatedMultipleChoice: boolean
}

const OpenAnswerTypeReveal: React.FC<OpenAnswerTypeRevealProps> = ({
  q,
  index,
  control,
  areAnswersVisible,
  onWrongAnswerClick,
  onRightAnswerClick,
  hasEvaluatedMultipleChoice,
}) => {
  const answerText = useWatch({
    control,
    name: `answers.${index}.answer_text`,
  })

  return !areAnswersVisible ? (
    <Controller
      name={`answers.${index}.answer_text`}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextArea
          size="$3"
          fontWeight="300"
          height={200}
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
        {!hasEvaluatedMultipleChoice && (
          <Card gap="$4" backgroundColor="#fee8af" p="$3" mt="$7">
            <SizableText size="$5">War Ihre Antwort richtig?</SizableText>
            <XStack gap="$3" w="100%" jc="space-around">
              <Theme name="red">
                <Button onPress={onWrongAnswerClick}>Nicht ganz</Button>
              </Theme>
              <Theme name="green">
                <Button onPress={onRightAnswerClick}>Richtig</Button>
              </Theme>
            </XStack>
          </Card>
        )}
      </YStack>
    </YStack>
  )
}

export default OpenAnswerTypeReveal
