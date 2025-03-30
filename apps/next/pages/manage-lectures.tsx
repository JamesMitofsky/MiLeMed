import { Button, ScrollView, XStack, YStack } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { NextPageWithLayout } from './_app'
import { useChapters } from '../../../packages/app/utils/hooks/queryHooks'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { getChapterSummary } = useChapters()
  const { data: chapters } = getChapterSummary()

  return (
    <>
      <Head>
        <title>Lektionen verwalten</title>
      </Head>

      <XStack>
        <Button
          icon={ArrowLeft}
          chromeless
          onPress={() => {
            router.back()
          }}
        >
          Zurück
        </Button>
      </XStack>

      <ScrollView>
        <YStack gap="$4" p="$4">
          <YStack gap="$4">
            {chapters?.flatMap((chapter) => (
              <Button
                key={`chapter-${chapter.id}`}
                onPress={() => {
                  router.push(`/chapter/${chapter.id}`)
                }}
              >
                {chapter.title}
              </Button>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
