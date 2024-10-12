import {
  FullscreenSpinner,
  SubmitButton,
  Theme,
  YStack,
  useMedia,
  useToastController,
} from '@my/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useGlobalStore } from 'app/utils/global-store'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const CreatePostSchema = z.object({
  title: formFields.text.describe('Name // Lecture title'),
  content: formFields.textarea.describe('Description // Content of the lecture'),
  category_id: formFields.select.describe('Module // Connected to which module'),
  image_url: formFields.image.describe('Image URL // Image for the lecture'),
})

export const CreatePostForm = () => {
  const { setToggleCreateModal } = useGlobalStore()
  const { sm } = useMedia()
  const toast = useToastController()
  const router = useRouter()
  const { profile, user } = useUser()
  const supabase = useSupabase()

  const { data: modules } = useQuery(['projects'], {
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*')

      if (error) {
        // no rows - edge case of user being deleted
        if (error.code === 'PGRST116') {
          await supabase.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }
      return data
    },
  })

  const uploadImageAndGetUrl = async (imageSource: { fileURL: string; path: string }) => {
    console.log('imageSource', imageSource)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(
        `public/${Date.now()}_image${imageSource.path}`,
        await fetch(imageSource.fileURL).then((res) => res.blob())
      )

    console.log('uploadData', uploadData)
    if (uploadError) {
      // throw uploadError
      console.log('error', uploadError)
    }

    const { data: publicUrlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(uploadData?.path as string)
    return publicUrlData.publicUrl
  }

  const mutation = useMutation({
    async onError(error) {
      console.log('error', error)
    },
    async mutationFn(data: z.infer<typeof CreatePostSchema>) {
      console.log('here data', data)
      const imageUrl = await uploadImageAndGetUrl(
        data.image_url as {
          fileURL: string
          path: string
        }
      )

      // Insert post with the image URL
      await supabase.from('posts').insert({
        title: data.title,
        content: data.content,
        category_id: data.category_id,
        image_url: imageUrl,
        profile_id: user?.id,
      })
    },

    async onSuccess() {
      console.log('success')
      toast.show('Successfully created!')
      if (sm) {
        router.back()
      } else {
        setToggleCreateModal()
      }
    },
  })

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }

  return (
    <>
      <SchemaForm
        onSubmit={(values) => mutation.mutate(values)}
        schema={CreatePostSchema}
        defaultValues={{
          title: '',
          content: '',
          category_id: '',
        }}
        props={{
          category_id: {
            placeholder: 'Choose a module',
            options:
              modules?.map(({ name, id }) => ({
                name,
                value: id,
              })) || [],
          },
        }}
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>Create Lecture</SubmitButton>
          </Theme>
        )}
      >
        {(fields) => (
          <YStack gap="$2" py="$4" pb="$0" pt="$0" minWidth="100%" $gtSm={{ minWidth: 480 }}>
            {Object.values(fields)}
          </YStack>
        )}
      </SchemaForm>
    </>
  )
}
