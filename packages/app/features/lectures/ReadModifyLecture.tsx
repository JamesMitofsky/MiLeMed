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
} from '@my/ui'
import { Save, Pencil, Eye } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { useSupabase } from '../../utils/supabase/useSupabase'
import { parseMarkdown } from '../general/markdownParser'

const ReadModifyLecture = ({ lecture, lectureId }: { lecture: any; lectureId: any }) => {
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

  useEffect(() => {
    if (lecture) {
      setValue('title', lecture.title)
      setValue('content', lecture.content)
    }
  }, [lecture, setValue])

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
        .from('lectures') // Replace 'lectures' with your actual table name
        .update({ title: data.title, content: data.content })
        .eq('id', lectureId)

      if (error) throw error

      alert('Modification successful! :)')
      setIsEditMode(false)
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
              backgroundColor={isEditMode ? '$red12' : undefined} //TODO determine why these colors don't work
              icon={isEditMode ? Eye : Pencil}
              onPress={() => setIsEditMode(!isEditMode)}
            >
              <Button.Text color={isEditMode ? '$red12' : undefined}>
                {isEditMode ? 'Cancel' : 'Modify'}
              </Button.Text>
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
                    placeholder="Your title here"
                    value={field.value}
                    // @ts-ignore
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!isEditMode}
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
                    placeholder="Your content here"
                    value={field.value}
                    // @ts-ignore
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!isEditMode}
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
          {isEditMode && (
            <Button
              themeInverse
              f={0}
              icon={Save}
              onPress={handleSubmit(handleSaveChanges)}
              size="$3"
              width="auto"
              disabled={!hasChanges || loading}
            >
              {loading ? <Spinner /> : 'Save'}
            </Button>
          )}
        </>
      ) : (
        <FullscreenSpinner />
      )}
    </YStack>
  )
}

export default ReadModifyLecture
