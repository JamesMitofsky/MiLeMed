import { YStack, SizableText, Spinner, Button, XStack } from '@my/ui'
import { Trash } from '@tamagui/lucide-icons'

import { QuizQuestionsWithOptionsType } from '../../utils/react-query/useQuizQuestions'
import { Chip } from '../general/chipParts'

interface ShowExistingQuizQuestionsProps {
  quizQuestions?: QuizQuestionsWithOptionsType[]
  areQuestionsLoading: boolean
  error: unknown
  onDelete: (questionId: number) => void
}

const ShowExistingQuizQuestions: React.FC<ShowExistingQuizQuestionsProps> = ({
  quizQuestions,
  areQuestionsLoading,
  error,
  onDelete,
}) => {
  return (
    <YStack gap="$4" pt="$5">
      <SizableText size="$6" fontStyle="italic">
        Quiz Questions
      </SizableText>
      {areQuestionsLoading ? (
        <Spinner />
      ) : error ? (
        <SizableText color="red">Failed to load quiz questions</SizableText>
      ) : quizQuestions && quizQuestions.length > 0 ? (
        quizQuestions.map((question) => (
          <YStack key={question.id} gap="$3" p="$4" borderWidth={1} borderColor="$gray3">
            <XStack justifyContent="space-between">
              <SizableText fontWeight="bold" size="$4">
                {question.question_text}
              </SizableText>
              <Button theme="red" size="$3" circular onPress={() => onDelete(question.id)}>
                <Button.Icon>
                  <Trash />
                </Button.Icon>
              </Button>
            </XStack>
            {question.question_type === 'MULTIPLE_CHOICE' && (
              <YStack gap="$2" pl="$4">
                {question.quiz_question_options.map((option) => (
                  <Chip
                    // @ts-ignore
                    width="fit-content"
                    rounded
                    // @ts-ignore
                    theme={option.is_correct ? 'green' : 'default'}
                    key={option.option_text}
                  >
                    <Chip.Text size="$3">{option.option_text}</Chip.Text>
                  </Chip>
                ))}
              </YStack>
            )}
            {question.question_type === 'OPEN' && (
              <SizableText size="$3" fontStyle="italic">
                {question.quiz_question_options[0]?.option_text}
              </SizableText>
            )}
          </YStack>
        ))
      ) : (
        <SizableText size="$4" fontStyle="italic">
          None found.
        </SizableText>
      )}
    </YStack>
  )
}

export default ShowExistingQuizQuestions
