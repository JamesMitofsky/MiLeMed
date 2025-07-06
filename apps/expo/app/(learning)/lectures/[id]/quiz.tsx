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
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { createParam } from 'solito'
import { YStack, SizableText, Button, Theme } from 'tamagui'

/**
 * Represents a quiz response where the user selected an option.
 */
type OptionResponse = {
  question_id: number
  type: 'OPTION'
  selected_option_id: number
}

/**
 * Represents a quiz response where the user provided a text answer.
 */
type TextResponse = {
  question_id: number
  type: 'TEXT'
  answer_text: string
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
  const [hasAnswersVisible, setHasAnswersVisible] = useState(false)
  const [userResponses, setUserResponses] = useState<UserResponsesMap>({})
  // this groups all OPTION and TEXT choices that have been marked correct or incorrect, regardles of correctness
  const [questionsThatHaveBeenEvaluated, setQuestionsThatHaveBeenEvaluated] = useState<{
    [questionId: number]: boolean | undefined
  }>({})

  console.log('TEST', questionsThatHaveBeenEvaluated)

  // FUNCTIONS

  /**
   * Updates the user's selected answers for multiple choice questions
   * @param selectedOptionId - The ID of the selected option
   * @param questionId - The ID of the question being answered
   */
  const updateUserSelectedAnswers = useCallback((selectedOptionId: number, questionId: number) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        type: 'OPTION',
        selected_option_id: selectedOptionId,
      },
    }))

    // check if this selectedOptionIsRight
    const isCorrect =
      referenceAnswersData?.some((option) => {
        // Find if this option is in the reference answers
        const isReferenceAnswer = referenceAnswersData?.some(
          (answer) => answer.question_id === questionId && answer.option_id === selectedOptionId
        )
        return option.option_id === selectedOptionId && isReferenceAnswer
      }) || false

    updateTextResponseCorrectness(questionId, isCorrect)
  }, [])

  const updateUserWrittenAnswers = useCallback((userSubmittedText: string, questionId: number) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        type: 'TEXT',
        answer_text: userSubmittedText,
      },
    }))
  }, [])

  // Initialize questionsUserHasCorrectlyAnswered when questions are loaded
  useEffect(() => {
    if (questions) {
      const initialAnswerState = questions.reduce((acc, question) => {
        // Only add entries that have a defined value
        // Since we're initializing, we'll skip adding undefined values
        return acc
      }, {} as { [questionId: number]: boolean | undefined })

      setQuestionsThatHaveBeenEvaluated(initialAnswerState)
    }
  }, [questions])

  // trying to make sure all questions are evaluated before showing next button
  const hasAnsweredAllQuestions = useMemo(() => {
    // console.log('questionsThatHaveBeenEvaluated', questionsThatHaveBeenEvaluated)
    // console.log('questions', questions)
    // console.log(
    //   'questionsThatHaveBeenEvaluated.length',
    //   Object.values(questionsThatHaveBeenEvaluated).length
    // )
    // console.log('questions.length', questions.length)

    console.log('\n\n\nTEST')
    console.log(Object.values(questionsThatHaveBeenEvaluated).length === questions?.length)

    console.log(Object.values(questionsThatHaveBeenEvaluated).length)
    console.log(questions?.length)
    return Object.values(questionsThatHaveBeenEvaluated).length === questions?.length
  }, [questionsThatHaveBeenEvaluated, questions])

  const hasAnsweredAllQuestionsCorrectly = useMemo(() => {
    // Check if we have the correct number of answers and all are true
    return (
      questions &&
      Object.keys(questionsThatHaveBeenEvaluated).length === questions.length &&
      Object.values(questionsThatHaveBeenEvaluated).every((value) => value)
    )
  }, [questionsThatHaveBeenEvaluated, questions])

  const updateTextResponseCorrectness = useCallback((questionId: number, isCorrect: boolean) => {
    setQuestionsThatHaveBeenEvaluated((prev) => ({
      ...prev,
      [questionId]: isCorrect,
    }))
  }, [])

  const submitEvaluationOfOpenAnswer = useCallback(
    async (questionId: number, isCorrect: boolean) => {
      updateTextResponseCorrectness(questionId, isCorrect)
    },
    [user, recordQuizAnswer, lectureId, toast]
  )

  // this is called when the user has decided whether their open choice answer is correct or not
  const submitAllFinalAnswersToServer = useCallback(async () => {
    if (hasAnsweredAllQuestionsCorrectly) {
      console.log('submitting quiz to server', userResponses)
      await markLectureCompleted.mutate({ lectureId })
      navigate('/')
      toast.show('Quiz abgeschlossen', {
        message: 'Gut gemacht!',
        duration: 3000,
      })
    } else {
      navigate('/')
      toast.show('Quiz nicht abgeschlossen', {
        message: 'Noch nicht alle Fragen beantwortet',
        duration: 3000,
      })
    }
  }, [hasAnsweredAllQuestionsCorrectly])

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
                        hasAnswersVisible={hasAnswersVisible}
                      />
                    ) : (
                      <OpenAnswerTypeReveal
                        question={question}
                        onTextInput={(userSubmittedText, questionId) =>
                          updateUserWrittenAnswers(userSubmittedText, questionId)
                        }
                        value={(() => {
                          const response = userResponses[question.question_id]
                          return response?.type === 'TEXT' ? response.answer_text : ''
                        })()}
                        hasAnswersVisible={hasAnswersVisible}
                        onSelfEvaluation={(isCorrect, questionId) =>
                          submitEvaluationOfOpenAnswer(questionId, isCorrect)
                        }
                      />
                    )}
                  </View>
                )
              })}
              {!hasAnswersVisible && (
                <Button
                  onPress={() => {
                    setHasAnswersVisible(true)
                  }}
                  theme="brandSecondary"
                >
                  Alle Antworten senden
                </Button>
              )}
              {hasAnsweredAllQuestions && (
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
