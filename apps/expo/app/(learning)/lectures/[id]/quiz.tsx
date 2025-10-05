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
import React, { useState, useCallback, useMemo, useRef } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { createParam } from 'solito'
import { YStack, SizableText, Button, Theme } from 'tamagui'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Represents a quiz response where the user selected an option.
 */
type OptionResponse = {
  question_id: number
  type: 'OPTION'
  selected_option_id: number
  isCorrect: boolean
}

/**
 * Represents a quiz response where the user provided a text answer.
 */
type TextResponse = {
  question_id: number
  type: 'TEXT'
  isCorrect?: boolean
}

/**
 * A user's response to a quiz question, either option or text.
 */
type QuizResponse = OptionResponse | TextResponse
type UserResponsesMap = Record<number, QuizResponse>

const { useParams } = createParam<{ id: number }>()
const QuizForm: React.FC = () => {
  const {
    params: { id: lectureId },
  } = useParams()

  // HOOKS
  const { user } = useUser()
  const { navigate } = useRouter()
  const toast = useToastController()
  const scrollViewRef = useRef<any>(null)

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
  const queryClient = useQueryClient()

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
  const [hasAnswersVisible, setHasAnswersVisible] = useState(false)
  const [userResponses, setUserResponses] = useState<UserResponsesMap>({})
  // // this groups all OPTION and TEXT choices that have been marked correct or incorrect, regardles of correctness
  // const [questionsThatHaveBeenEvaluated, setQuestionsThatHaveBeenEvaluated] = useState<{
  //   [questionId: number]: boolean | undefined
  // }>({})

  // FUNCTIONS

  const scrollToBottom = () => {
    // Make sure the ref is available
    if (scrollViewRef.current) {
      // Use setTimeout to ensure this happens after the state update and render
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }, 100)
    }
  }

  const handleMultiChoiceSelect = (selectedOptionId: number, questionId: number) => {
    // first, check to see if the selected option was right
    const isCorrect =
      referenceAnswersData?.some((option) => {
        // Find if this option is in the reference answers
        const isReferenceAnswer = referenceAnswersData?.some(
          (answer) => answer.question_id === questionId && answer.option_id === selectedOptionId
        )
        return option.option_id === selectedOptionId && isReferenceAnswer
      }) || false

    // then record that
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        type: 'OPTION',
        selected_option_id: selectedOptionId,
        isCorrect,
      },
    }))
  }

  const handleOpenAnswerEvaluation = useCallback(
    async (questionId: number, isCorrect: boolean) => {
      setUserResponses((prev) => ({
        ...prev,
        [questionId]: {
          question_id: questionId,
          type: 'TEXT',
          isCorrect,
        },
      }))
    },
    [user, recordQuizAnswer, lectureId, toast]
  )

  // this is called when the user has decided whether their open choice answer is correct or not
  const allQuestionsAnswered = Object.values(userResponses).length === questions?.length

  const allQuestionsAnsweredCorrectly = Object.values(userResponses).every(
    (response) => response.isCorrect
  )

  const submitAllFinalAnswersToServer = useCallback(async () => {
    if (allQuestionsAnsweredCorrectly && allQuestionsAnswered) {
      try {
        // If you want to be more specific with the exact query key:
        queryClient.invalidateQueries({
          queryKey: ['chaptersWithLectures'],
        })
        markLectureCompleted.mutate({ lectureId })

        // Show toast immediately
        toast.show('Quiz abgeschlossen', {
          message: 'Gut gemacht!',
          duration: 3000,
        })

        navigate('/')
      } catch (error) {
        console.error('Something went wrong on submit', error)
      }
    } else {
      navigate(`/lectures/${lectureId}`)
      toast.show('Quiz nicht abgeschlossen', {
        message: 'Noch nicht alle Fragen beantwortet',
        duration: 3000,
      })
    }
  }, [
    allQuestionsAnsweredCorrectly,
    allQuestionsAnswered,
    queryClient,
    markLectureCompleted,
    lectureId,
    toast,
    navigate,
  ])

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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          style={{ flex: 1 }}
        >
          <ScrollView ref={scrollViewRef}>
            <YStack gap="$4" p="$4" pb="$10">
              {questions?.map((question) => {
                return (
                  <View key={question.question_id}>
                    {question.question_type === 'MULTIPLE_CHOICE' ? (
                      <MultiChoicePickReveal
                        question={question}
                        onSelectOption={(selectedOptionId, questionId) =>
                          handleMultiChoiceSelect(selectedOptionId, questionId)
                        }
                        hasAnswersVisible={hasAnswersVisible}
                        disabled={hasAnswersVisible}
                      />
                    ) : (
                      <OpenAnswerTypeReveal
                        question={question}
                        // onTextInput={(userSubmittedText, questionId) =>
                        //   updateUserWrittenAnswers(userSubmittedText, questionId)
                        // }
                        // value={(() => {
                        //   const response = userResponses[question.question_id]
                        //   return response?.type === 'TEXT' ? response.answer_text : ''
                        // })()}
                        hasAnswersVisible={hasAnswersVisible}
                        onSelfEvaluation={(isCorrect, questionId) =>
                          handleOpenAnswerEvaluation(questionId, isCorrect)
                        }
                        disabled={hasAnswersVisible}
                      />
                    )}
                  </View>
                )
              })}
              {!hasAnswersVisible && (
                <Button
                  onPress={() => {
                    setHasAnswersVisible(true)
                    scrollToBottom()
                  }}
                  theme="brandSecondary"
                >
                  Alle Antworten senden
                </Button>
              )}
              {/* TODO maybe this should only show after the user has submitted the value of all their written answers  */}
              {/* {hasAnsweredAllQuestions && hasAnswersVisible && ( */}
              {hasAnswersVisible && (
                <Button
                  onPress={() => {
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
