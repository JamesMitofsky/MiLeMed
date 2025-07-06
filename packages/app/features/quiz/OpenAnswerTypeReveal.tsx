import { QuestionForQuizComponent } from 'app/utils/supabase/databaseTypes'
import React, { useState } from 'react'
import { YStack, SizableText, Input, XStack, Button } from 'tamagui'

interface OpenAnswerTypeRevealProps {
  question: QuestionForQuizComponent
  onTextInput: (userSubmittedText: string, questionId: number) => void
  value: string
  hasRequestedAnswers: boolean
  onSelfEvaluation: (isCorrect: boolean, answerText: string, questionId: number) => void
}

const OpenAnswerTypeReveal: React.FC<OpenAnswerTypeRevealProps> = ({
  question,
  onTextInput,
  value,
  hasRequestedAnswers,
  onSelfEvaluation,
}) => {
  const [isShowingOpenQuestionAnswer, setIsShowingOpenQuestionAnswer] = useState(false)
  const [userHasSubmittedAnswer, setUserHasSubmittedAnswer] = useState(false)

  const handleShowOpenQuestionAnswer = () => {
    setIsShowingOpenQuestionAnswer(true)
  }

  const handleSelfEvaluation = (isCorrect: boolean) => {
    onSelfEvaluation(isCorrect, value, question.question_id)
  }

  return (
    <YStack gap="$2" p="$2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
      <SizableText fontWeight="bold">{question.question_text}</SizableText>

      <Input
        placeholder="Deine Antwort..."
        value={value}
        onChangeText={(text) => onTextInput(text, question.question_id)}
        multiline
        numberOfLines={5}
        mt="$2"
      />

      {hasRequestedAnswers && (
        <YStack my="$3" gap="$2">
          <SizableText fontWeight="bold">Kam deine Antwort ungefähr hin?</SizableText>

          <SizableText m="$2">
            lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet,
            consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </SizableText>

          <XStack ai="center" jc="space-around">
            <Button onPress={() => handleSelfEvaluation(true)} theme="success">
              Das passt!
            </Button>
            <Button onPress={() => handleSelfEvaluation(false)} theme="error">
              Ich übe noch!
            </Button>
          </XStack>
        </YStack>
      )}
      {/* {isShowingOpenQuestionAnswer && (
        <YStack mt="$2" gap="$2">
          <SizableText>Answers are visible</SizableText>
        </YStack>
      )} */}
    </YStack>
  )
}

export default OpenAnswerTypeReveal
