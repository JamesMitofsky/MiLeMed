import {
  H2,
  ScrollView,
  XStack,
  YStack,
  Text,
  FullscreenSpinner,
  Card,
  H3,
  Switch,
  Label,
  Button,
  Theme,
} from '@my/ui'
import { Input } from '@my/ui/src/components/forms/inputs/components/inputsParts'
import { BookOpen, Stethoscope, Info, List, Loader2, Plus, Search } from '@tamagui/lucide-icons'
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
  const [mode, setMode] = useState<'THEORETICAL' | 'PRACTICAL'>('PRACTICAL')

  // State for search term
  const [searchTerm, setSearchTerm] = useState('')

  // Get all chapters and lectures using the new hook
  const { data, isLoading } = useAllChaptersAndLectures(mode)

  // Extract chapters and lectures from the data
  const allChapters = (data?.chapters || []) as ChapterData[]
  const allLecturesByChapter = (data?.lecturesByChapter || {}) as Record<number, LectureData[]>

  // Filter chapters and lectures based on search term
  const chapters = searchTerm
    ? allChapters.filter((chapter) => {
        // Check if chapter title matches search
        const chapterMatches = chapter.title.toLowerCase().includes(searchTerm.toLowerCase())

        // Check if any lectures in this chapter match search
        const hasMatchingLectures = allLecturesByChapter[chapter.id]?.some((lecture) =>
          lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
        )

        return chapterMatches || hasMatchingLectures
      })
    : allChapters

  // Filter lectures for each chapter
  const lecturesByChapter = chapters.reduce((filtered, chapter) => {
    const chapterLectures = allLecturesByChapter[chapter.id] || []

    filtered[chapter.id] = searchTerm
      ? chapterLectures.filter((lecture) =>
          lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : chapterLectures

    return filtered
  }, {} as Record<number, LectureData[]>)

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
              {/* <XStack>
                <Button icon={ArrowLeft} chromeless onPress={() => router.back()}>
                  <Button.Text>Zurück</Button.Text>
                </Button>
              </XStack> */}

              {/* Mode toggle switch */}
              <YStack gap="$3">
                <XStack jc="space-between" ai="center" mt="$3">
                  <XStack ai="center" gap="$2" ml="$3">
                    <List size="$3" color="$gray11" />
                    <H2 color="$gray11">Lektionen verwalten</H2>
                  </XStack>
                  <XStack alignItems="center" gap="$4">
                    <XStack flex={1} gap="$2" ai="center">
                      <Label htmlFor="mode-switch" size="$6" fontWeight="bold">
                        {mode === 'THEORETICAL' ? 'Vorlesung' : 'Blockpraktikum'}
                      </Label>
                      {mode === 'THEORETICAL' ? (
                        <BookOpen size="$1" color="$blue10" />
                      ) : (
                        <Stethoscope size="$1" color="$green10" />
                      )}
                    </XStack>

                    <Theme name={mode === 'PRACTICAL' ? 'green' : 'light_blue_active'}>
                      <Switch
                        id="mode-switch"
                        checked={mode === 'PRACTICAL'}
                        onCheckedChange={handleModeToggle}
                        size="$4"
                        theme={mode === 'PRACTICAL' ? 'green' : 'blue'}
                      >
                        <Switch.Thumb animation="quick" />
                      </Switch>
                    </Theme>
                  </XStack>
                </XStack>
                <XStack ml="$3" gap="$4">
                  <Button
                    size="$2"
                    alignSelf="flex-start"
                    theme="orange"
                    icon={<Plus color="$gray12" />}
                    onPress={() => router.push('/create-lecture')}
                  >
                    <Button.Text color="$gray12">Neue Lektion</Button.Text>
                  </Button>
                  <Button
                    size="$2"
                    alignSelf="flex-start"
                    theme="orange"
                    variant="outlined"
                    icon={<Plus color="orange" />}
                    onPress={() => router.push('/create-chapter')}
                  >
                    <Button.Text color="orange">Neues Kapitel</Button.Text>
                  </Button>
                </XStack>

                {/* Search bar */}
                <XStack ml="$3" mr="$3" mt="$4">
                  <Input size="$3" minWidth="100%">
                    <Input.Box>
                      <Input.Icon>
                        <Search size="$1" color="$gray10" />
                      </Input.Icon>
                      <Input.Area
                        paddingLeft={0}
                        flex={1}
                        placeholder="Suche nach Kapiteln oder Lektionen..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        size="$3"
                        borderColor="$gray8"
                        clearButtonMode="while-editing"
                      />
                    </Input.Box>
                  </Input>
                </XStack>
              </YStack>

              {isLoading ? (
                <YStack p="$4" gap="$4" ai="center">
                  <XStack ai="center" gap="$2">
                    <Loader2 size="$1" color="$blue10" />
                    <H3>Loading chapters and lectures...</H3>
                  </XStack>
                  <FullscreenSpinner />
                </YStack>
              ) : (
                <YStack p="$4" gap="$6">
                  {/* Display chapters and their lectures */}
                  {chapters.map((chapter) => (
                    <YStack key={chapter.id} gap="$2">
                      <XStack ai="center" gap="$2">
                        {mode === 'THEORETICAL' ? (
                          <BookOpen size="$2" color="$blue10" />
                        ) : (
                          <Stethoscope size="$2" color="$green10" />
                        )}
                        <H2>{chapter.title}</H2>
                      </XStack>
                      <XStack pl="$4" ai="center" gap="$1">
                        {/* <Info size="$1" color="$gray10" /> */}
                        <Text color="$gray10">{chapter.chapter_mode}</Text>
                      </XStack>

                      {/* Display lectures for this chapter */}
                      <YStack pl="$4" gap="$4">
                        {lecturesByChapter[chapter.id]?.length > 0 ? (
                          lecturesByChapter[chapter.id].map((lecture: LectureData) => (
                            <Card
                              key={lecture.id}
                              bordered
                              padding="$3"
                              mb="$2"
                              pressStyle={{ opacity: 0.8, scale: 0.98 }}
                              animation="bouncy"
                              cursor="pointer"
                              onPress={() => router.push(`/lecture/${lecture.id}`)}
                            >
                              <XStack ai="center" gap="$2">
                                <H3>{lecture.title}</H3>
                              </XStack>
                            </Card>
                          ))
                        ) : (
                          <XStack ai="center" gap="$2" opacity={0.7}>
                            <Info size="$1" color="$gray9" />
                            <Text color="$gray9">
                              Für dieses Kapitel wurden keine Vorlesungen gefunden
                            </Text>
                          </XStack>
                        )}
                      </YStack>
                    </YStack>
                  ))}
                </YStack>
              )}

              {/* Debug info */}
              {/* <YStack p="$4" gap="$4" opacity={0.7} borderTopWidth={1} borderColor="$gray5" mt="$4">
                <XStack ai="center" gap="$2">
                  <Info size="$1" color="$gray10" />
                  <H3>Debug Information</H3>
                </XStack>
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
                    icon={RefreshCw}
                  >
                    <Button.Text>Log Data to Console</Button.Text>
                  </Button>
                </YStack>
              </YStack> */}
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
