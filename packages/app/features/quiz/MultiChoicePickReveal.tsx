import { QuestionForQuizComponent } from '@my/app/utils/supabase/databaseTypes'
import { useQuizReferenceAnswer } from 'app/utils/hooks/queryHooks'
import React, { useId } from 'react'
import { RadioGroup, YStack, SizableText, View, XStack } from 'tamagui'

interface MultiChoicePickRevealProps {
  // this is incoming
  question: QuestionForQuizComponent
  // this is outgoing. The second param lets us know which question in this lecture was being rendered
  onSelectOption: (selectedOptionId: number, questionId: number) => void
  hasAnswersVisible: boolean
}

const MultiChoicePickReveal: React.FC<MultiChoicePickRevealProps> = ({
  question,
  onSelectOption,
  hasAnswersVisible,
}) => {
  const uniqueId = useId()

  const { data: optionQuestionAnswer } = useQuizReferenceAnswer(question.question_id)

  console.log('\n\noptionQuestionAnswer', optionQuestionAnswer)

  const handleValueChange = (value: string) => {
    const optionId = Number(value)
    onSelectOption(optionId, question.question_id)
  }

  // console.log('OPTIONS', question.options)

  return (
    <YStack gap="$2" p="$2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
      <SizableText fontWeight="bold">{question.question_text}</SizableText>
      <RadioGroup
        disabled={hasAnswersVisible}
        onValueChange={handleValueChange}
        flexWrap="wrap"
        gap="$2"
        flexDirection="column"
      >
        {question.options.map((option) => (
          <XStack
            key={option.id}
            flexDirection="row"
            alignItems="center"
            gap="$3"
            borderRadius="$2"
            onPress={() => handleValueChange(String(option.id))}
          >
            <View onPress={(e) => e.stopPropagation()}>
              <RadioGroup.Item
                backgroundColor={
                  hasAnswersVisible && optionQuestionAnswer?.[0].option_id === option.id
                    ? '$green5Light'
                    : undefined
                }
                id={uniqueId + option.id}
                value={String(option.id)}
              >
                <RadioGroup.Indicator />
              </RadioGroup.Item>
            </View>
            <SizableText textWrap="wrap">{option.option_text}</SizableText>
          </XStack>
        ))}
      </RadioGroup>
    </YStack>
  )
}

export default MultiChoicePickReveal
