import { QuestionForQuizComponent } from '@my/app/utils/supabase/databaseTypes'
import { useQuizReferenceAnswer } from 'app/utils/hooks/queryHooks'
import React, { useId, useState } from 'react'
import { RadioGroup, YStack, SizableText, Label, View, styled } from 'tamagui'

interface MultiChoicePickRevealProps {
  // this is incoming
  question: QuestionForQuizComponent
  // this is outgoing. The second param lets us know which question in this lecture was being rendered
  onSelectOption: (selectedOptionId: number, questionId: number) => void
  hasAnswersVisible: boolean
  disabled: boolean
}

const MultiChoicePickReveal: React.FC<MultiChoicePickRevealProps> = ({
  question,
  onSelectOption,
  hasAnswersVisible,
  disabled,
}) => {
  const uniqueId = useId()

  const [selectedId, setSelectedId] = useState<string>()

  const { data: answerToQuestion } = useQuizReferenceAnswer(question.question_id)

  const handleIdSelection = (id: string) => {
    setSelectedId(id)
    onSelectOption(parseInt(id, 10), question.question_id)
  }

  return (
    <YStack gap="$2" p="$2" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
      <SizableText fontWeight="bold">{question.question_text}</SizableText>
      <RadioGroup
        flexWrap="wrap"
        gap="$4"
        my="$2"
        rowGap="$4"
        flexDirection="row"
        value={selectedId}
        onValueChange={handleIdSelection}
      >
        {question.options.map(({ id, option_text }) => (
          <Card
            key={option_text}
            flexDirection="row"
            flex={1}
            flexBasis={150}
            alignItems="center"
            gap="$3"
            padding={0}
            minWidth="100%"
            active={selectedId === String(id) || false}
            paddingHorizontal="$2.5"
            cursor="pointer"
            onPress={() => handleIdSelection(String(id))}
            $gtXs={{
              minWidth: 'auto',
            }}
            backgroundColor={
              hasAnswersVisible &&
              answerToQuestion &&
              answerToQuestion.length > 0 &&
              answerToQuestion[0].option_id === id
                ? '$green7Light'
                : undefined
            }
          >
            <View onPress={(e) => e.stopPropagation()}>
              <RadioGroup.Item id={uniqueId + option_text} value={String(id)}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
            </View>

            <Label padding="$2" lineHeight="$8" cursor="pointer" htmlFor={uniqueId + option_text}>
              {option_text}
            </Label>
          </Card>
        ))}
      </RadioGroup>
    </YStack>
  )
}

export default MultiChoicePickReveal

export const Card = styled(View, {
  cursor: 'pointer',
  width: '100%',
  borderRadius: '$4',
  padding: '$3',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  focusStyle: {
    backgroundColor: '$backgroundFocus',
    borderColor: '$borderColorFocus',
  },
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  ...(process.env.TAMAGUI_TARGET === 'web' && {
    pressStyle: {
      backgroundColor: '$backgroundPress',
      borderColor: '$borderColorPress',
    },
  }),

  variants: {
    active: {
      true: {
        backgroundColor: '$backgroundFocus',
        borderColor: '$borderColorFocus',
      },
    },
  } as const,
})
