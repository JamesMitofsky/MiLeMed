import { useQuizReferenceAnswer } from 'app/utils/hooks/queryHooks'
import { QuestionForQuizComponent } from 'app/utils/supabase/databaseTypes'
import React, { useState } from 'react'
import { YStack, SizableText, Input, Button, XStack } from 'tamagui'

interface OpenAnswerTypeRevealProps {
  question: QuestionForQuizComponent
  onTextInput: (userSubmittedText: string, questionId: number) => void
  value: string
  hasAnswersVisible: boolean
  onSelfEvaluation: (isCorrect: boolean, questionId: number) => void
}

const OpenAnswerTypeReveal: React.FC<OpenAnswerTypeRevealProps> = ({
  question,
  onTextInput,
  value,
  hasAnswersVisible,
  onSelfEvaluation,
}) => {
  const { data: openQuestionAnswer } = useQuizReferenceAnswer(question.question_id)

  const [formState, setFormState] = useState<undefined | 'SUCCESS' | 'FAILURE'>()

  // console.log('question id', question.question_id)

  // console.log('\n\n\n\nREFERENCE ANSWER Singular', openQuestionAnswer)

  // const [isShowingOpenQuestionAnswer, setIsShowingOpenQuestionAnswer] = useState(false)
  // const [userHasSubmittedAnswer, setUserHasSubmittedAnswer] = useState(false)

  // const handleShowOpenQuestionAnswer = () => {
  //   setIsShowingOpenQuestionAnswer(true)
  // }

  const handleSelfEvaluation = (isCorrect: boolean) => {
    setFormState(isCorrect ? 'SUCCESS' : 'FAILURE')
    onSelfEvaluation(isCorrect, question.question_id)
  }

  // console.log('REFERENCE ANSWER Singular', openQuestionAnswer)

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
        disabled={hasAnswersVisible}
      />

      {hasAnswersVisible && (
        <YStack my="$3" gap="$2">
          <SizableText fontWeight="bold">Kam deine Antwort ungefähr hin?</SizableText>
          {openQuestionAnswer?.[0] !== undefined ? (
            <SizableText m="$2">{openQuestionAnswer?.[0].answer_text}</SizableText>
          ) : (
            <SizableText m="$2">
              Noch keine Antwort -- looks like we goofed something up! Please let us know in the
              feedback panel! 🙏
            </SizableText>
          )}
          {!formState && (
            <XStack ai="center" jc="space-around">
              <Button onPress={() => handleSelfEvaluation(true)} theme="success">
                Das passt!
              </Button>
              <Button onPress={() => handleSelfEvaluation(false)} theme="error">
                Ich übe noch!
              </Button>
            </XStack>
          )}
          {formState === 'SUCCESS' && (
            <SizableText m="$2" fontWeight="bold" theme="success">
              Gut gemacht! 🎉
            </SizableText>
          )}
          {formState === 'FAILURE' && (
            <SizableText m="$2" fontWeight="bold" theme="error">
              Kein Problem, beim nächsten Mal klappt's bestimmt! 💪
            </SizableText>
          )}
        </YStack>
      )}
    </YStack>
  )
}

export default OpenAnswerTypeReveal
