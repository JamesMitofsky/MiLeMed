import { Button, Input, SizableText, TextArea, FullscreenSpinner, Spinner, YStack } from '@my/ui'
import { Save } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'solito/router'

import { useSupabase } from '../../utils/supabase/useSupabase'

const ReadModifyLecture = ({ lecture, lectureId }: { lecture: any; lectureId: any }) => {
  const supabase = useSupabase()
  const router = useRouter()
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lecture) {
      setValue('title', lecture.title)
      setValue('content', lecture.content)
    }
  }, [lecture, setValue])

  const handleSaveChanges = async (data) => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from('lectures') // replace 'lectures' with your actual table name
        .update({ title: data.title, content: data.content })
        .eq('id', lectureId)

      if (error) throw error

      router.back()
    } catch (error) {
      console.error('Error updating lecture:', error)
      setLoading(false)
      alert('An error occurred while updating the lecture. Please try again.')
    }
  }

  return (
    <YStack gap="$3">
      {lecture ? (
        <>
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
                />
                {fieldState.error && (
                  <SizableText color="red">{fieldState.error.message}</SizableText>
                )}
              </>
            )}
          />
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Content is required' }}
            render={({ field, fieldState }) => (
              <>
                <TextArea
                  size="$3"
                  fontWeight="300"
                  height={580}
                  placeholder="Your content here"
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
        </>
      ) : (
        <FullscreenSpinner />
      )}
      <Button
        themeInverse
        f={0}
        icon={Save}
        onPress={handleSubmit(handleSaveChanges)}
        size="$3"
        width="auto"
      >
        {loading ? <Spinner /> : 'Save'}
      </Button>
    </YStack>
  )
}

export default ReadModifyLecture
