import { ScrollView, useToastController, View } from '@my/ui'
import MultiChoicePickReveal from 'app/features/quiz/MultiChoicePickReveal'
import OpenAnswerTypeReveal from 'app/features/quiz/OpenAnswerTypeReveal'
import { useLectures, useQuizSystem } from 'app/utils/hooks/queryHooks'
import { useUser } from 'app/utils/useUser'
import { randomUUID } from 'expo-crypto'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useEffect, useCallback } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createParam } from 'solito'
import { YStack, SizableText, Button, Theme } from 'tamagui'

const { useParams } = createParam<{ id: number }>()
const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()

  const router = useRouter()
  const { user } = useUser()
  const { getLectureById } = useLectures()
  const { data: lecture } = getLectureById(lectureId)
  const { getQuizResults, recordQuizAnswer, markQuizCompleted } = useQuizSystem()
  const { data: questions } = getQuizResults(lectureId)

  const [hasEvaluatedMultipleChoice, setHasEvaluatedMultipleChoice] = useState(false)
  const [answerIds, setAnswerIds] = useState<{ [key: number]: number[] }>({})
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)

  const toast = useToastController()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      const newId = randomUUID()
      setSessionId(newId)
    }
  }, [sessionId])

  const updateAnswerCorrectness = useCallback(
    async (
      questionId: number,
      isCorrect: boolean,
      answerText?: string,
      chosenOptionIds?: number[]
    ) => {
      if (!user || !sessionId) return

      try {
        await recordQuizAnswer.mutateAsync({
          questionId,
          answerText,
          chosenOptionIds,
          lectureId,
        })

        if (isCorrect) {
          toast.show('Richtige Antwort!', {
            message: 'Gut gemacht!',
            duration: 2000,
          })
        } else {
          toast.show('Falsche Antwort', {
            message: 'Versuche es noch einmal.',
            duration: 2000,
          })
        }
      } catch (error) {
        console.error('Error updating answer:', error)
        toast.show('Fehler', {
          message: 'Fehler beim Speichern der Antwort.',
          duration: 2000,
        })
      }
    },
    [user, sessionId, recordQuizAnswer, lectureId, toast]
  )

  const onSubmit = useCallback(async () => {
    if (!questions) return

    const allCorrect = questions.every((question) => {
      if (question.question_type === 'MULTIPLE_CHOICE') {
        const selectedAnswers = answerIds[question.question_id] || []
        const correctAnswers = question.correct_option_ids || []

        return (
          selectedAnswers.length === correctAnswers.length &&
          selectedAnswers.every((id) => correctAnswers.includes(id))
        )
      }
      return question.is_correct || false
    })

    try {
      await markQuizCompleted.mutateAsync({
        lectureId,
        passed: allCorrect,
      })

      if (allCorrect) {
        toast.show('Quiz abgeschlossen!', {
          message: 'Sehr gut gemacht!',
          duration: 2000,
        })
        router.push(`/lecture/${lectureId}`)
      } else {
        toast.show('Quiz nicht bestanden', {
          message: 'Bitte versuche es noch einmal.',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.show('Fehler', {
        message: 'Fehler beim Abschließen des Quiz.',
        duration: 2000,
      })
    }
  }, [questions, answerIds, markQuizCompleted, lectureId, toast, router])

  if (!questions) {
    return (
      <YStack f={1} jc="center" ai="center">
        <SizableText>Laden...</SizableText>
      </YStack>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Quiz: ${lecture?.title ?? 'Laden...'}`,
          headerBackTitle: 'Zurück',
        }}
      />
      <Theme name="light">
        <KeyboardAwareScrollView>
          <ScrollView>
            <YStack space="$4" p="$4">
              {questions.map((question) => (
                <View key={question.question_id}>
                  {question.question_type === 'MULTIPLE_CHOICE' ? (
                    <MultiChoicePickReveal
                      question={question}
                      onAnswerSelected={(selectedIds) => {
                        setAnswerIds((prev) => ({ ...prev, [question.question_id]: selectedIds }))
                        setHasEvaluatedMultipleChoice(true)
                      }}
                      showAnswers={areAnswersVisible}
                      onAnswerSubmitted={(isCorrect) =>
                        updateAnswerCorrectness(
                          question.question_id,
                          isCorrect,
                          undefined,
                          answerIds[question.question_id]
                        )
                      }
                    />
                  ) : (
                    <OpenAnswerTypeReveal
                      question={question}
                      onAnswerSubmitted={(isCorrect, answerText) =>
                        updateAnswerCorrectness(question.question_id, isCorrect, answerText)
                      }
                      showAnswers={areAnswersVisible}
                    />
                  )}
                </View>
              ))}

              <Button
                onPress={() => {
                  setAreAnswersVisible(true)
                  onSubmit()
                }}
                disabled={!hasEvaluatedMultipleChoice}
                theme={hasEvaluatedMultipleChoice ? 'active' : 'gray'}
              >
                Quiz abschließen
              </Button>
            </YStack>
          </ScrollView>
        </KeyboardAwareScrollView>
      </Theme>
    </>
  )
}

export default QuizForm
