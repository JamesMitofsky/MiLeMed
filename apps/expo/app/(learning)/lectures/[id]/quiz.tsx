import OpenAnswerTypeReveal from '@my/app/features/quiz/OpenAnswerTypeReveal'
import { QuestionForQuizComponent } from '@my/app/utils/supabase/databaseTypes'
import { ScrollView, useToastController, View } from '@my/ui'
import MultiChoicePickReveal from 'app/features/quiz/MultiChoicePickReveal'
import {
  useLectureById,
  useQuizSystem,
  useQuizOptions,
  useQuizReferenceAnswers,
} from 'app/utils/hooks/queryHooks'
import { useUser } from 'app/utils/useUser'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useCallback, useMemo } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { createParam } from 'solito'
import { YStack, SizableText, Button, Theme } from 'tamagui'

const { useParams } = createParam<{ id: number }>()
const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()

  // HOOKS
  const { user } = useUser()

  const toast = useToastController()
  const { data: lecture } = useLectureById(lectureId)
  const { useQuizResults, recordQuizAnswer, markLectureCompleted } = useQuizSystem()
  const { data: quizQuestions } = useQuizResults(lectureId)
  // Extract question IDs from the quiz questions
  const questionIds = useMemo(() => {
    return quizQuestions?.map((question: { question_id: any }) => question.question_id) || []
  }, [quizQuestions])
  // Fetch options for all questions
  const { data: optionsData } = useQuizOptions(questionIds)
  // Fetch reference answers for all questions
  const { data: referenceAnswersData } = useQuizReferenceAnswers(questionIds)

  // Combine questions with their options and reference answers
  const questions: QuestionForQuizComponent[] | null = useMemo(() => {
    if (!quizQuestions || !optionsData) return null

    return quizQuestions.map((question: { question_id: any }) => {
      // Find options for this question
      const questionOptions = optionsData.filter(
        (option) => option.question_id === question.question_id
      )

      // Find reference answers for this question
      const referenceAnswerIds =
        referenceAnswersData
          ?.filter((answer) => answer.question_id === question.question_id)
          .map((answer) => answer.id) || []

      return {
        ...question,
        options: questionOptions,
        reference_answer_ids: referenceAnswerIds,
      }
    })
  }, [quizQuestions, optionsData, referenceAnswersData])

  // STATES
  const [hasVisibleAnswers, setHasVisibleAnswers] = useState(false)
  /** Stores all user responses to quiz questions */
  const [userResponses, setUserResponses] = useState<{ [key: number]: number | string }[]>([])

  /**
   * Updates the user's selected answers for multiple choice questions
   * @param selectedOptionId - The ID of the selected option
   * @param questionId - The ID of the question being answered
   */
  const updateUserSelectedAnswers = useCallback((selectedOptionId: number, questionId: number) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: [selectedOptionId],
    }))
  }, [])

  /**
   * Updates the user's written answers for open answer questions
   * @param userSubmittedText - The text submitted by the user
   * @param questionId - The ID of the question being answered
   */
  const updateUserWrittenAnswers = useCallback((userSubmittedText: string, questionId: number) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: userSubmittedText,
    }))
  }, [])

  const submitEvaluationOfOpenAnswer = useCallback(
    async (questionId: number, isCorrect: boolean, answerText: string) => {
      if (!user) return null

      // // we are checking to see if open answer is right!
      // recordQuizAnswer.mutate({
      //   questionId,
      //   answerText,
      //   lectureId,
      // })
    },
    [user, recordQuizAnswer, lectureId, toast]
  )

  const { navigate } = useRouter()

  // this is called when the user has decided whether their open choice answer is correct or not
  const submitAllFinalAnswersToServer = useCallback(async () => {
    console.log('submitting quiz to server', userResponses)
    markLectureCompleted.mutate({ lectureId })
    toast.show('Quiz abgeschlossen', {
      message: 'Gut gemacht!',
      duration: 3000,
    })
    navigate('/')
  }, [userResponses])

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
        <KeyboardAvoidingView>
          <ScrollView>
            <YStack gap="$4" p="$4">
              {questions?.map((question) => {
                return (
                  <View key={question.question_id}>
                    {question.question_type === 'MULTIPLE_CHOICE' ? (
                      <MultiChoicePickReveal
                        question={question}
                        onSelectOption={(selectedOptionId, questionId) =>
                          updateUserSelectedAnswers(selectedOptionId, questionId)
                        }
                      />
                    ) : (
                      <OpenAnswerTypeReveal
                        question={question}
                        onTextInput={(userSubmittedText, questionId) =>
                          updateUserWrittenAnswers(userSubmittedText, questionId)
                        }
                        value={userResponses[question.question_id] as string}
                        hasRequestedAnswers={hasVisibleAnswers}
                        onSelfEvaluation={(isCorrect, answerText, questionId) =>
                          submitEvaluationOfOpenAnswer(questionId, isCorrect, answerText)
                        }
                      />
                    )}
                  </View>
                )
              })}
              {!hasVisibleAnswers ? (
                <Button
                  onPress={() => {
                    setHasVisibleAnswers(true)
                  }}
                  theme="brandSecondary"
                >
                  Alle Antworten senden
                </Button>
              ) : (
                <Button
                  onPress={() => {
                    setHasVisibleAnswers(true)
                    submitAllFinalAnswersToServer()
                  }}
                  theme="brandPrimary"
                >
                  Vortrag abschließen
                </Button>
              )}
            </YStack>
          </ScrollView>
        </KeyboardAvoidingView>
      </Theme>
    </>
  )
}

export default QuizForm
