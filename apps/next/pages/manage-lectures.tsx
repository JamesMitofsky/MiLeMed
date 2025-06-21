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

  // Log chapters data when it loads
  useEffect(() => {
    if (chapters) {
      console.log('Chapters data loaded:', chapters)
    }
  }, [chapters])

  // When lectures data changes for the selected chapter, update our collection
  useEffect(() => {
    if (selectedChapterId && lectures) {
      console.log(`Lectures for chapter ${selectedChapterId} loaded:`, lectures)
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

      // Log progress
      console.log(
        `Finished loading lectures for chapter ${selectedChapterId} (${currentIndex + 1}/${
          allChapters.length
        })`
      )

      // If there's a next chapter, select it
      if (currentIndex >= 0 && currentIndex < allChapters.length - 1) {
        setSelectedChapterId(allChapters[currentIndex + 1].id)
      } else if (currentIndex === allChapters.length - 1) {
        // This was the last chapter
        console.log('All lectures loaded. Final data collection:', allLectures)
      }
    }
  }, [isLoadingLectures, selectedChapterId, allChapters, allLectures])

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
              
              {/* Debug info */}
              <YStack p="$4" space="$4">
                <YStack>
                  <Text>Chapters: {allChapters.length}</Text>
                  <Text>Lectures: {Object.values(allLectures).flat().length}</Text>
                  <Text>Loading: {isLoading ? 'Yes' : 'No'}</Text>
                  <Text>Current chapter ID: {selectedChapterId || 'None'}</Text>
                  <Button
                    onPress={() => {
                      console.log('All chapters:', allChapters)
                      console.log('All lectures by chapter:', allLectures)
                      console.log('Total lectures:', Object.values(allLectures).flat().length)
                    }}
                  >
                    Log Data to Console
                  </Button>
                </YStack>

                {isLoading && <FullscreenSpinner />}
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
