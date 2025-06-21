import {
  H2,
  isWeb,
  ScrollView,
  XStack,
  YStack,
  Text,
  FullscreenSpinner,
  Card,
  H3,
  Paragraph,
  Button,
} from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'solito/navigation'

import { NextPageWithLayout } from './_app'
import { useChapters, useLectures } from '../../../packages/app/utils/hooks/queryHooks'

// Define types for the chapter and lecture data
type ChapterType = {
  id: number
  title: string
  chapter_mode: 'THEORETICAL' | 'PRACTICAL'
  completion_percentage: number
  total_lectures: number
  completed_lectures: number
}

type LectureType = {
  id: number
  title: string
  content: string
  is_completed: boolean
  chapter_id: number
}

export const Page: NextPageWithLayout = () => {
  const router = useRouter()

  // State for tracking the selected chapter ID (if we need to fetch lectures for a specific chapter)
  const [selectedChapterId, setSelectedChapterId] = useState<number | undefined>(undefined)

  // Get all chapters
  const { data: chapters, isLoading: isLoadingChapters } = useChapters()

  // Get lectures for the selected chapter (if any)
  const { data: lectures, isLoading: isLoadingLectures } = useLectures(selectedChapterId)

  // Track all fetched lectures
  const [allLectures, setAllLectures] = useState<Record<number, LectureType[]>>({})

  // Store fetched chapters
  const allChapters = (chapters as ChapterType[]) || []

  // When lectures data changes for the selected chapter, update our collection
  useEffect(() => {
    if (selectedChapterId && lectures) {
      setAllLectures((prev) => ({
        ...prev,
        [selectedChapterId]: lectures as LectureType[],
      }))
    }
  }, [selectedChapterId, lectures])

  // When chapters change, set up a way to fetch all lectures
  useEffect(() => {
    const fetchAllLectures = async () => {
      if (!allChapters || allChapters.length === 0) return

      // Process one chapter at a time
      if (allChapters.length > 0) {
        // Start with the first chapter
        setSelectedChapterId(allChapters[0].id)
      }
    }

    fetchAllLectures()
  }, [allChapters])

  // When a chapter's lectures are loaded, move to the next chapter
  useEffect(() => {
    if (!isLoadingLectures && selectedChapterId && allChapters.length > 0) {
      // Find current chapter index
      const currentIndex = allChapters.findIndex((c) => c.id === selectedChapterId)

      // If there's a next chapter, select it
      if (currentIndex >= 0 && currentIndex < allChapters.length - 1) {
        setSelectedChapterId(allChapters[currentIndex + 1].id)
      }
    }
  }, [isLoadingLectures, selectedChapterId, allChapters])

  const isLoading =
    isLoadingChapters ||
    isLoadingLectures ||
    (allChapters.length > 0 && Object.keys(allLectures).length < allChapters.length)

  return (
    <>
      <Head>
        <title>Lektionen verwalten</title>
      </Head>

      <XStack maw={1480} width={800} m="auto" f={1}>
        <ScrollView f={4} fb={0}>
          <ScrollToTopTabBarContainer>
            <YStack gap="$7" pb="$10" pt="$5">
              <XStack>
                <Button icon={ArrowLeft} chromeless onPress={() => router.back()}>
                  <Button.Text>Zurück</Button.Text>
                </Button>
              </XStack>
              
              {isWeb && <H2>Lektionen verwalten</H2>}
              
              {/* Work in Progress Message */}
              <Card elevate bordered padding="$4" margin="$4">
                <H3>Work in Progress</H3>
                <Paragraph>This page is currently under development.</Paragraph>
              </Card>
              
              {/* Data is being fetched but not displayed in the UI */}
              <YStack gap="$3">
                {isLoading ? <FullscreenSpinner /> : <Text>Data loaded successfully.</Text>}
              </YStack>
              
              {/* Debug information - can be removed in production */}
              <YStack opacity={0} height={0} overflow="hidden">
                <Text>Chapters loaded: {allChapters.length}</Text>
                <Text>Lectures loaded: {Object.values(allLectures).flat().length}</Text>
              </YStack>
            </YStack>
          </ScrollToTopTabBarContainer>
        </ScrollView>
      </XStack>
    </>
  )
}

// No row component needed for the work in progress version

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
