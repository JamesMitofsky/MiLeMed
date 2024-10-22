import { XStack, ScrollView, YStack, Button, TextArea, Input, Spinner } from '@my/ui'
import { Save } from '@tamagui/lucide-icons'
import { ArrowLeft } from '@tamagui/lucide-icons/dist/esm/icons/arrow-left'
import { HomeLayout } from 'app/features/home/layout.web'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import useLectureQuery from '../../../../packages/app/utils/react-query/useLectureQuery'
import { FullscreenSpinner } from '../../../../packages/ui/src/components/FullscreenSpinner'
import { NextPageWithLayout } from '../_app'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { data: lecture } = useLectureQuery(router.query.id as string)
  const supabase = useSupabase()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false) // State to track loading status

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title)
      setContent(lecture.content)
    }
  }, [lecture])

  const handleSaveChanges = async () => {
    console.log('Save changes')
    console.log('Title:', title)
    console.log('Content:', content)

    setLoading(true) // Set loading to true when request starts

    try {
      const { error } = await supabase
        .from('lectures') // replace 'lectures' with your actual table name
        .update({ title, content })
        .eq('id', router.query.id as string)

      if (error) {
        throw error
      }

      // Successfully updated the lecture, now go back
      router.back()
    } catch (error) {
      console.error('Error updating lecture:', error)
      setLoading(false) // Set loading to false if something went wrong.
      alert(
        'An error occurred while updating the lecture. Nothing has been changed. Please try again.'
      )
    }
  }

  return (
    <>
      <Head>
        <title>Lecture</title>
      </Head>
      <XStack maw={1480} width={800} m="auto" f={1}>
        <ScrollView f={4} fb={0}>
          <YStack gap="$7" pb="$10" pt="$5">
            <Button
              themeShallow
              f={0}
              icon={ArrowLeft}
              onPress={() => router.back()}
              size="$3"
              width="auto"
            >
              Back
            </Button>
            {lecture ? (
              <>
                <Input
                  size="$3"
                  fontWeight="300"
                  height={60}
                  placeholder="Your title here"
                  value={title}
                  // @ts-ignore
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextArea
                  size="$3"
                  fontWeight="300"
                  height={580}
                  placeholder="Your content here"
                  value={content}
                  // @ts-ignore
                  onChange={(e) => setContent(e.target.value)}
                />
              </>
            ) : (
              <FullscreenSpinner />
            )}

            <Button
              themeInverse
              f={0}
              icon={Save}
              onPress={handleSaveChanges}
              size="$3"
              width="auto"
            >
              {loading ? <Spinner /> : 'Save'}
            </Button>
          </YStack>
        </ScrollView>
      </XStack>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
