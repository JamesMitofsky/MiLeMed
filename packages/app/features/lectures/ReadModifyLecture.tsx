import {
  Button,
  Input,
  SizableText,
  TextArea,
  FullscreenSpinner,
  Spinner,
  YStack,
  XStack,
  H1,
  useToast,
  Card,
  Text,
  Separator,
} from '@my/ui'
import { Save, Info, Check, X, Trash, Eye, Pencil } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { useSupabase } from '../../utils/supabase/useSupabase'
import { parseMarkdown } from '../general/markdownParser'

interface QuizQuestion {
  id: number
  question_text: string
  question_type: 'MULTIPLE_CHOICE' | 'OPEN_ENDED'
  options?: {
    option_text: string
    is_correct: boolean
  }[]
  correct_answer?: string
}

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
  isQuizLoading?: boolean
  onDeleteQuestion?: (questionId: number) => void
  onSaveSuccess?: () => void
}

const ReadModifyLecture = ({
  lecture,
  lectureId,
  quizQuestions = [],
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

  // Watch for changes in form values
  const watchedValues = watch(['title', 'content'])

  const toast = useToast()

  useEffect(() => {
    if (lecture) {
      setValue('title', lecture.title)
      setValue('content', lecture.content)
    }
  }, [lecture, setValue])
  
  // Debug statements to check quiz questions data
  useEffect(() => {
    console.log('Quiz Questions:', JSON.stringify(quizQuestions, null, 2))
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
              theme={isEditMode ? 'red' : 'blue'}
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
            <SizableText size="$5" fontWeight="500">
              Quiz Questions
            </SizableText>
            
            {isQuizLoading ? (
              <XStack ai="center" gap="$2">
                <Spinner size="small" />
                <Text>Loading quiz questions...</Text>
              </XStack>
            ) : quizQuestions && quizQuestions.length > 0 ? (
              <YStack gap="$3">
                {quizQuestions.map((question, index) => {
                  console.log(`Question ${index}:`, question);
                  console.log(`Question ${index} type:`, question.question_type);
                  console.log(`Question ${index} options:`, question.options);
                  
                  return (
                    <Card key={question.id} bordered padding="$3" mb="$3">
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
                            {Array.isArray(question.options) && question.options.length > 0 ? (
                              question.options.map((option, optIndex) => (
                                <XStack key={optIndex} gap="$2" alignItems="center">
                                  {option.is_correct ? (
                                    <Check color="$green9" />
                                  ) : (
                                    <X color="$gray9" />
                                  )}
                                  <Text>{option.option_text}</Text>
                                </XStack>
                              ))
                            ) : (
                              <Text color="$orange9">No options available</Text>
                            )}
                          </YStack>
                        )}
                        
                        {question.question_type === 'OPEN_ENDED' && question.correct_answer && (
                          <YStack gap="$2">
                            <Text fontWeight="bold">Correct Answer:</Text>
                            <Text>{question.correct_answer}</Text>
                          </YStack>
                        )}
                        
                        <XStack gap="$2">
                          {onDeleteQuestion && (
                            <Button
                              icon={Trash}
                              theme="red"
                              size="$2"
                              onPress={() => onDeleteQuestion(question.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </XStack>
                      </YStack>
                    </Card>
                  );
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
