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
  Button,
  Switch,
  Label,
} from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'solito/navigation'

import { NextPageWithLayout } from './_app'
import { useAllChaptersAndLectures } from '../../../packages/app/utils/hooks/queryHooks'

// Define types for the data structure returned by useAllChaptersAndLectures
type ChapterData = {
  id: number
  title: string
  chapter_mode: 'THEORETICAL' | 'PRACTICAL'
  [key: string]: unknown
}

type LectureData = {
  id: number
  title: string
  content: string
  chapter_id: number
  [key: string]: unknown
}

export const Page: NextPageWithLayout = () => {
  const router = useRouter()

  // State for mode filter (THEORETICAL or PRACTICAL)
  const [mode, setMode] = useState<'THEORETICAL' | 'PRACTICAL'>('THEORETICAL')

  // Get all chapters and lectures using the new hook
  const { data, isLoading } = useAllChaptersAndLectures(mode)

  // Extract chapters and lectures from the data
  const chapters = (data?.chapters || []) as ChapterData[]
  const lecturesByChapter = (data?.lecturesByChapter || {}) as Record<number, LectureData[]>

  // Toggle between THEORETICAL and PRACTICAL modes
  const handleModeToggle = (checked: boolean) => {
    const newMode = checked ? 'PRACTICAL' : 'THEORETICAL'
    console.log('🔄 Mode toggle switched to:', newMode)
    setMode(newMode)
  }

  // Log when data or loading state changes
  useEffect(() => {
    console.log('📊 Data updated:', {
      isLoading,
      chaptersCount: chapters.length,
      lecturesCount: Object.values(lecturesByChapter).flat().length,
    })
  }, [data, isLoading, chapters, lecturesByChapter])

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

              {/* Mode toggle switch */}
              <XStack alignItems="center" space="$4" p="$4">
                <Label htmlFor="mode-switch" flex={1}>
                  {mode === 'PRACTICAL' ? 'Praktisch' : 'Theoretisch'}
                </Label>
                <Switch
                  id="mode-switch"
                  checked={mode === 'PRACTICAL'}
                  onCheckedChange={handleModeToggle}
                  size="$4"
                >
                  <Switch.Thumb animation="quick" />
                </Switch>
              </XStack>

              {isLoading ? (
                <YStack p="$4" gap="$4" ai="center">
                  <H3>Loading chapters and lectures...</H3>
                  <FullscreenSpinner />
                </YStack>
              ) : (
                <YStack p="$4" gap="$6">
                  {/* Display chapters and their lectures */}
                  {chapters.map((chapter) => (
                    <YStack key={chapter.id} gap="$2">
                      <H2>{chapter.title}</H2>
                      <Text color="$gray10">{chapter.chapter_mode}</Text>

                      {/* Display lectures for this chapter */}
                      <YStack pl="$4" gap="$4">
                        {lecturesByChapter[chapter.id]?.length > 0 ? (
                          lecturesByChapter[chapter.id].map((lecture: LectureData) => (
                            <Card key={lecture.id} bordered padding="$3" mb="$2">
                              <H3>{lecture.title}</H3>
                            </Card>
                          ))
                        ) : (
                          <Text color="$gray9">No lectures found for this chapter</Text>
                        )}
                      </YStack>
                    </YStack>
                  ))}
                </YStack>
              )}

              {/* Debug info */}
              <YStack p="$4" gap="$4" opacity={0.7} borderTopWidth={1} borderColor="$gray5" mt="$4">
                <H3>Debug Information</H3>
                <YStack>
                  <Text>Current Mode: {mode || 'All'}</Text>
                  <Text>Chapters: {chapters.length}</Text>
                  <Text>Lectures: {Object.values(lecturesByChapter).flat().length}</Text>
                  <Text>Loading: {isLoading ? 'Yes' : 'No'}</Text>
                  <Button
                    onPress={() => {
                      console.log('Current mode:', mode)
                      console.log('All chapters:', chapters)
                      console.log('All lectures by chapter:', lecturesByChapter)
                      console.log('Total lectures:', Object.values(lecturesByChapter).flat().length)
                    }}
                    mt="$2"
                  >
                    Log Data to Console
                  </Button>
                </YStack>
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
