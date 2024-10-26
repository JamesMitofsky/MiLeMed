import { YStack, SizableText, Spinner } from '@my/ui'

import { QuizQuestionsWithOptionsType } from '../../utils/react-query/useQuizQuestions'
import { Chip } from '../general/chipParts'

interface ShowExistingQuizQuestionsProps {
  quizQuestions?: QuizQuestionsWithOptionsType[]
  areQuestionsLoading: boolean
  error: unknown
}

const ShowExistingQuizQuestions: React.FC<ShowExistingQuizQuestionsProps> = ({
  quizQuestions,
  areQuestionsLoading,
  error,
}) => {
  return (
    <YStack gap="$4" pt="$5">
      {areQuestionsLoading ? (
        <Spinner />
      ) : error ? (
        <SizableText color="red">Failed to load quiz questions</SizableText>
      ) : quizQuestions && quizQuestions.length > 0 ? (
        quizQuestions.map((question) => (
          <YStack key={question.id} gap="$3" p="$4" borderWidth={1} borderColor="$gray3">
            <SizableText fontWeight="bold" size="$4">
              {question.question_text}
            </SizableText>
            {question.question_type === 'MULTIPLE_CHOICE' && (
              <YStack gap="$2" pl="$4">
                {question.quiz_question_options.map((option) => (
                  <Chip
                    // @ts-ignore
                    width="fit-content"
                    rounded
                    theme={option.is_correct && ('green' as any)}
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
          No quiz questions found.
        </SizableText>
      )}
    </YStack>
  )
}

export default ShowExistingQuizQuestions
