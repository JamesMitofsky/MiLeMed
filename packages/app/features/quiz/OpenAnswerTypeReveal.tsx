import { QuestionForQuizComponent } from 'app/utils/supabase/databaseTypes'
import React, { useState } from 'react'
import { YStack, SizableText, Input } from 'tamagui'

interface OpenAnswerTypeRevealProps {
  question: QuestionForQuizComponent
  onTextInput: (userSubmittedText: string, questionId: number) => void
  value: string
}

const OpenAnswerTypeReveal: React.FC<OpenAnswerTypeRevealProps> = ({
  question,
  onTextInput,
  value,
}) => {
  const [answerText, setAnswerText] = useState('')
  const [selfEvaluation, setSelfEvaluation] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // const handleSubmit = () => {
  //   if (answerText.trim() && !submitted) {
  //     setSubmitted(true)
  //   }
  // }

  return (
    <YStack gap="$2" p="$2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
      <SizableText fontWeight="bold">{question.question_text}</SizableText>

      <Input
        placeholder="Deine Antwort..."
        value={value}
        onChangeText={(text) => onTextInput(text, question.question_id)}
        disabled={submitted}
        // disabled={submitted || showAnswer}
        multiline
        numberOfLines={3}
        mt="$2"
      />

      {/* {!submitted && !showAnswer && (
        <Button onPress={handleSubmit} mt="$2" disabled={!answerText.trim()}>
          Antwort einreichen
        </Button>
      )} */}

      {/* {submitted && !showAnswer && (
        <YStack mt="$2" space="$2">
          <SizableText>Wie bewertest du deine Antwort?</SizableText>
          <XStack space="$2">
            <Button
              onPress={() => handleSelfEvaluation(true)}
              flex={1}
              backgroundColor={selfEvaluation === true ? '$green8' : undefined}
            >
              Richtig
            </Button>
            <Button
              onPress={() => handleSelfEvaluation(false)}
              flex={1}
              backgroundColor={selfEvaluation === false ? '$red8' : undefined}
            >
              Falsch
            </Button>
          </XStack>
        </YStack>
      )}

      {showAnswer && question.reference_answer && (
        <YStack mt="$2" p="$2" backgroundColor="$backgroundHover" borderRadius="$2">
          <SizableText fontWeight="bold">Referenzantwort:</SizableText>
          <Paragraph mt="$1">{question.reference_answer}</Paragraph>
        </YStack>
      )} */}
    </YStack>
  )
}

export default OpenAnswerTypeReveal
