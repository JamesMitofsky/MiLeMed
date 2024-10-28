import useQuizQuestionsQuery from 'app/utils/react-query/useQuizQuestions'
import { Stack } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createParam } from 'solito'
import { Label, Checkbox, YStack, Input, SizableText } from 'tamagui'

const { useParams } = createParam<{ id: number }>()

const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()

  const { data: questions, isLoading } = useQuizQuestionsQuery(lectureId)

  console.log(questions)

  if (isLoading) return <Label>Loading...</Label>

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Quiz' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <YStack p="$4" gap="$6">
          {questions
            ? questions?.map((q) => (
                <YStack key={q.id} gap="$4">
                  <SizableText size="$4">{q.question_text}</SizableText>
                  {q.question_type === 'MULTIPLE_CHOICE' ? (
                    q.quiz_question_options.map((o) => (
                      <Checkbox key={o.id} value={o.id.toString()}>
                        {o.option_text}
                      </Checkbox>
                    ))
                  ) : (
                    <Input placeholder="Your answer" />
                  )}
                </YStack>
              ))
            : 'There are no questions for this lecture.'}
        </YStack>
      </SafeAreaView>
    </>
  )
}

export default QuizForm
