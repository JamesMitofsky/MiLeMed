import type { Database } from '@my/supabase/types'
import {
  Button,
  Card,
  FullscreenSpinner,
  H1,
  Input,
  Separator,
  SizableText,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { Check, Eye, Info, Pencil, Plus, Save, Trash, X } from '@tamagui/lucide-icons'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'

import QuizQuestionForm from './QuizQuestionForm'
import { useQuizReferenceAnswers } from '../../utils/hooks/queryHooks'
import { useSupabase } from '../../utils/supabase/useSupabase'
import { parseMarkdown } from '../general/markdownParser'

interface QuizQuestion {
  question_id: number
  question_text: string
  question_type: 'MULTIPLE_CHOICE' | 'OPEN'
  options?: {
    option_text: string
    is_correct: boolean
  }[]
  correct_answer?: string
  // Additional fields from quiz_get_results
  correct_answer_text?: string
}

// Removed unused type

type QuizOption = Database['public']['Tables']['quiz_options']['Row']

interface ReadModifyLectureProps {
  lecture: {
    id: number
    title: string
    content: string
    chapter_id: number
    sort_order: number
  } | null
  lectureId: string
  quizQuestions?: QuizQuestion[]
  quizOptions?: QuizOption[] // Quiz options from the database with proper type
  getOptionsForQuestion?: (questionId: number) => QuizOption[] // Function to get options for a specific question
  isQuizLoading?: boolean
  onDeleteQuestion?: (questionId: number) => void
  onSaveSuccess?: () => void
}

const ReadModifyLecture = ({
  lecture,
  lectureId,
  quizQuestions = [],
  quizOptions = [],
  getOptionsForQuestion,
  isQuizLoading = false,
  onDeleteQuestion,
  onSaveSuccess,
}: ReadModifyLectureProps) => {
  const supabase = useSupabase()
  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [localQuestions, setLocalQuestions] = useState<QuizQuestion[]>(quizQuestions || [])
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false)
  const [savedQuestions, setSavedQuestions] = useState<Record<number, boolean>>({})

  // Watch for changes in form values
  const watchedValues = watch(['title', 'content'])

  const toast = useToastController()

  useEffect(() => {
    if (lecture) {
      setValue('title', lecture.title)
      setValue('content', lecture.content)
    }
  }, [lecture, setValue])

  // Debug statements to check quiz questions data
  useEffect(() => {
    console.log('Quiz Questions:', JSON.stringify(quizQuestions, null, 2))
    // Update local questions when quiz questions change
    setLocalQuestions(quizQuestions || [])
  }, [quizQuestions])

  useEffect(() => {
    // Check if there are changes compared to the original lecture values
    const originalTitle = lecture?.title || ''
    const originalContent = lecture?.content || ''
    const currentValues = getValues()
    setHasChanges(
      currentValues.title !== originalTitle || currentValues.content !== originalContent
    )
  }, [watchedValues, lecture, getValues])

  const handleSaveChanges = async (data) => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from('content_lectures') // Replace 'lectures' with your actual table name
        .update({ title: data.title, content: data.content })
        .eq('id', parseInt(lectureId, 10))

      if (error) throw error
      toast.show('Lecture updated successfully!', { appearance: 'success' })
      setIsEditMode(false)

      // Refetch lecture data to update the display
      if (onSaveSuccess) {
        onSaveSuccess()
      }
    } catch (error) {
      console.error('Error updating lecture:', error)
      alert('An error occurred while updating the lecture. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Build list of question IDs and load reference (correct) answers for those questions
  const questionIds = (localQuestions || []).map((q) => q.question_id)
  const { getReferenceAnswersForQuestion } = useQuizReferenceAnswers(questionIds)

  type RefAnswerRow = Database['public']['Tables']['quiz_reference_answers']['Row']

  const getCorrectOptionIdsForQuestion = (questionId: number): number[] => {
    try {
      const refs: RefAnswerRow[] = getReferenceAnswersForQuestion
        ? getReferenceAnswersForQuestion(questionId)
        : []
      // Filter for OPTION type answers and return option_id list
      return refs
        .filter((r) => r.answer_type === 'OPTION' && r.option_id != null)
        .map((r) => r.option_id as number)
    } catch (e) {
      console.error('Error determining correct options for question', questionId, e)
      return []
    }
  }

  return (
    <YStack gap="$3">
      {lecture ? (
        <>
          <XStack justifyContent="space-between">
            <SizableText size="$5" fontWeight="500">
              Lecture Details
            </SizableText>
            <Button
              size="$3"
              theme={isEditMode ? 'success' : 'warning'}
              icon={isEditMode ? Eye : Pencil}
              onPress={() => setIsEditMode(!isEditMode)}
            >
              <Button.Text>{isEditMode ? 'View' : 'Modify'}</Button.Text>
            </Button>
          </XStack>
          {isEditMode ? (
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    size="$3"
                    fontWeight="300"
                    height={60}
                    m="$1"
                    placeholder="Your title here"
                    value={field.value}
                    // @ts-ignore
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && (
                    <SizableText color="red">{fieldState.error.message}</SizableText>
                  )}
                </>
              )}
            />
          ) : (
            <H1 size="$9">{lecture.title}</H1>
          )}
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Content is required' }}
            render={({ field, fieldState }) => (
              <>
                {isEditMode ? (
                  <TextArea
                    size="$3"
                    fontWeight="300"
                    height={400}
                    m="$1"
                    placeholder="Your content here"
                    value={field.value}
                    // @ts-ignore
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                ) : (
                  <>{parseMarkdown(lecture.content)}</>
                )}
                {fieldState.error && (
                  <SizableText color="red">{fieldState.error.message}</SizableText>
                )}
              </>
            )}
          />
          {isEditMode &&
            (hasChanges ? (
              <Button
                themeInverse
                f={0}
                icon={Save}
                onPress={handleSubmit(handleSaveChanges)}
                size="$3"
                width="auto"
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Save'}
              </Button>
            ) : (
              <XStack gap="$2" ai="center">
                <Info />
                <SizableText>Editing, but no changes have been made yet.</SizableText>
              </XStack>
            ))}

          {/* Quiz Questions Section */}
          <YStack gap="$4" mt="$6">
            <Separator />
            <XStack justifyContent="space-between" alignItems="center">
              <SizableText size="$5" fontWeight="500">
                Quiz Questions
              </SizableText>
              {isEditMode && (
                <Button
                  size="$3"
                  themeShallow
                  theme="success"
                  icon={Plus}
                  onPress={() => setShowNewQuestionForm(true)}
                >
                  Add Question
                </Button>
              )}
            </XStack>

            {/* New Question Form */}
            {isEditMode && showNewQuestionForm && (
              <Card bordered padding="$3" mb="$3">
                <YStack gap="$3">
                  <QuizQuestionForm
                    lectureId={parseInt(lectureId, 10)}
                    onSuccess={() => {
                      // Hide the form
                      setShowNewQuestionForm(false)

                      // Refetch quiz questions to get the newly created question
                      if (onSaveSuccess) {
                        onSaveSuccess()
                      }
                    }}
                  />

                  <Button theme="warning" size="$2" onPress={() => setShowNewQuestionForm(false)}>
                    Cancel
                  </Button>
                </YStack>
              </Card>
            )}

            {isQuizLoading ? (
              <XStack ai="center" gap="$2">
                <Spinner size="small" />
                <Text>Loading quiz questions...</Text>
              </XStack>
            ) : localQuestions && localQuestions.length > 0 ? (
              <YStack gap="$3">
                {localQuestions.map((question, index) => {
                  // In edit mode, show all questions as editable forms
                  if (isEditMode) {
                    return (
                      <Card key={`edit-${question.question_id}`} bordered padding="$3" mb="$3">
                        <YStack gap="$3">
                          <QuizQuestionForm
                            lectureId={parseInt(lectureId, 10)}
                            questionId={question.question_id}
                            onSuccess={() => {
                              // Mark this question as saved
                              setSavedQuestions((prev) => ({
                                ...prev,
                                [question.question_id]: true,
                              }))

                              // Refetch quiz questions
                              if (onSaveSuccess) {
                                onSaveSuccess()
                              }
                            }}
                          />

                          {/* Delete button still available in edit mode */}
                          {onDeleteQuestion && (
                            <Button
                              icon={Trash}
                              theme="warning"
                              size="$2"
                              onPress={() => {
                                console.log(
                                  'Delete button clicked for question ID:',
                                  question.question_id
                                )
                                console.log('Delete handler exists:', !!onDeleteQuestion)
                                console.log('Full question data:', question)

                                // Call the delete handler function
                                try {
                                  console.log('Attempting to delete question...')
                                  // Remove from local state immediately for instant UI feedback
                                  setLocalQuestions((prev) =>
                                    prev.filter((q) => q.question_id !== question.question_id)
                                  )
                                  // Call the actual delete handler
                                  onDeleteQuestion(question.question_id)
                                  console.log('Delete handler called successfully')
                                } catch (error) {
                                  console.error('Error in delete handler:', error)
                                }

                                // Refetch quiz questions after deleting
                                try {
                                  console.log('Attempting to trigger refetch...')
                                  if (onSaveSuccess) {
                                    onSaveSuccess()
                                    console.log('Refetch triggered successfully')
                                  } else {
                                    console.warn('onSaveSuccess callback is not available')
                                  }
                                } catch (error) {
                                  console.error('Error triggering refetch:', error)
                                }
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </YStack>
                      </Card>
                    )
                  }

                  // In view mode, show the normal question card
                  return (
                    <Card key={question.question_id} bordered padding="$3" mb="$3">
                      <YStack gap="$3">
                        <SizableText fontWeight="bold">{question.question_text}</SizableText>

                        <YStack gap="$1">
                          <XStack gap="$2" alignItems="center">
                            <Text fontWeight="bold">Type:</Text>
                            <Text>
                              {question.question_type === 'MULTIPLE_CHOICE'
                                ? 'Multiple Choice'
                                : 'Open Ended'}
                            </Text>
                          </XStack>
                        </YStack>

                        {question.question_type === 'MULTIPLE_CHOICE' && (
                          <YStack gap="$2">
                            <Text fontWeight="bold">Options:</Text>
                            {/* Use the getOptionsForQuestion function to fetch options from the database */}
                            {getOptionsForQuestion && (
                              <>
                                {/* Display options from the quiz_options table */}
                                {(() => {
                                  const options = getOptionsForQuestion(question.question_id)
                                  const correctOptionIds = getCorrectOptionIdsForQuestion(
                                    question.question_id
                                  )
                                  return options && options.length > 0 ? (
                                    options.map((option: QuizOption, optIndex) => (
                                      <XStack key={optIndex} gap="$2" alignItems="center">
                                        {correctOptionIds.includes(option.id) ? (
                                          <Check color="$green10" />
                                        ) : (
                                          <X color="$accent5" />
                                        )}
                                        <Text>{option.option_text}</Text>
                                      </XStack>
                                    ))
                                  ) : (
                                    <Text color="$red10">No options available</Text>
                                  )
                                })()}
                              </>
                            )}
                            {/* Fallback to original options if getOptionsForQuestion is not available */}
                            {!getOptionsForQuestion &&
                              Array.isArray(question.options) &&
                              question.options.length > 0 &&
                              question.options.map((option, optIndex) => (
                                <XStack key={optIndex} gap="$2" alignItems="center">
                                  {option.is_correct ? (
                                    <Check color="$green10" />
                                  ) : (
                                    <X color="$accent5" />
                                  )}
                                  <Text>{option.option_text}</Text>
                                </XStack>
                              ))}
                            {!getOptionsForQuestion &&
                              (!Array.isArray(question.options) ||
                                question.options.length === 0) && (
                                <Text color="$red10">No options available</Text>
                              )}
                          </YStack>
                        )}

                        {question.question_type === 'OPEN' && question.correct_answer && (
                          <YStack gap="$2">
                            <Text fontWeight="bold">Correct Answer:</Text>
                            <Text>{question.correct_answer}</Text>
                          </YStack>
                        )}
                      </YStack>
                    </Card>
                  )
                })}
              </YStack>
            ) : (
              <Text>No quiz questions available for this lecture.</Text>
            )}
          </YStack>
        </>
      ) : (
        <FullscreenSpinner />
      )}
    </YStack>
  )
}

export default ReadModifyLecture
