import {
  H2,
  isWeb,
  ScrollView,
  XStack,
  YStack,
  Text,
  FullscreenSpinner,
  View,
  styled,
  Button,
  Input,
  SizableText,
  Switch,
} from '@my/ui'
import { Eye, ArrowLeft } from '@tamagui/lucide-icons'
import { parseMarkdown } from 'app/features/general/markdownParser'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import Head from 'next/head'
import React, { useState, useMemo } from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { useRouter } from 'solito/navigation'

import { NextPageWithLayout } from './_app'
import { useChapters, useLectures } from '../../../packages/app/utils/hooks/queryHooks'

// Define types for the lecture data
// Type for lecture data from the API
type LectureType = {
  id: number
  title: string
  content: string
  is_completed: boolean
  chapter_id: number
  chapter_title: string
  chapter_mode: 'THEORETICAL' | 'PRACTICAL'
}

const truncateContent = (content: string, sentenceCount = 2): string => {
  if (!content) return ''
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content]
  if (!sentences || sentences.length <= sentenceCount) {
    return content
  }
  return sentences.slice(0, sentenceCount).join(' ') + '...'
}

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [mode, setMode] = useState<'THEORETICAL' | 'PRACTICAL'>('THEORETICAL')
  
  // Get all chapters
  const { getChapterSummary } = useChapters()
  const { data: chapters, isLoading: isLoadingChapters } = getChapterSummary()

  // Get all lectures for each chapter
  const { getLecturesWithCompletion } = useLectures()
  const allLecturesQueries = React.useMemo(
    () =>
      chapters?.map((chapter) => ({
        chapterId: chapter.id,
        query: getLecturesWithCompletion(chapter.id),
      })) || [],
    [chapters, getLecturesWithCompletion]
  )

  // Combine all lectures from all chapters
  const allLectures = React.useMemo(
    () =>
      allLecturesQueries.flatMap(({ query }) =>
        query.data?.map((lecture) => ({
          ...lecture,
          chapter_title:
            chapters?.find((c) => c.id === lecture.chapter_id)?.title ||
            'Unknown Chapter',
          chapter_mode:
            chapters?.find((c) => c.id === lecture.chapter_id)?.chapter_mode ||
            'THEORETICAL',
        })) || []
      ),
    [allLecturesQueries, chapters]
  )

  const isLoading = isLoadingChapters || allLecturesQueries.some((q) => q.query.isLoading)

  const toggleMode = () => {
    setMode(mode === 'THEORETICAL' ? 'PRACTICAL' : 'THEORETICAL')
  }

  const handleSearchChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setSearchQuery(e.nativeEvent.text)
  }

  const lecturesFilteredBySearchAndMode = useMemo(() => {
    return allLectures.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        item.chapter_mode === mode
    )
  }, [allLectures, searchQuery, mode])

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
              
              <View paddingHorizontal="$4">
                <Input
                  placeholder="Suchen..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  paddingHorizontal="$4"
                  borderRadius="$12"
                  borderWidth={2}
                  borderColor="$borderColor"
                  backgroundColor="$background"
                  placeholderTextColor="$gray10"
                  color="$color"
                  flex={1}
                />
              </View>
              
              <XStack
                hoverStyle={{
                  cursor: 'pointer',
                }}
                mx="$2"
                mt="$3"
                mb="$5"
                gap="$4"
                onPress={toggleMode}
              >
                <Switch checked={mode === 'THEORETICAL'} onCheckedChange={toggleMode} size="$2">
                  <Switch.Thumb borderColor="$color1" animation="200ms" />
                </Switch>
                <SizableText>{mode === 'THEORETICAL' ? 'Vorlesung' : 'Blockpraktikum'}</SizableText>
              </XStack>
              
              <YStack gap="$3">
                {isLoading ? (
                  <FullscreenSpinner />
                ) : lecturesFilteredBySearchAndMode?.length ? (
                  lecturesFilteredBySearchAndMode.map((item, index) => {
                    const isLastItem = index === lecturesFilteredBySearchAndMode.length - 1
                    const isNotFirstItem = index > 0
                    const isFirstOccurrence =
                      index === 0 ||
                      lecturesFilteredBySearchAndMode[index - 1].chapter_title !==
                        item.chapter_title

                    return (
                      <React.Fragment key={`${item.lecture_id}-${index}`}>
                        {isFirstOccurrence && (
                          <H2 mt={isNotFirstItem ? '$12' : undefined}>{item.chapter_title}</H2>
                        )}
                        <Row lecture={item} isLastItem={isLastItem} />
                      </React.Fragment>
                    )
                  })
                ) : (
                  <Text>Keine Lektionen gefunden</Text>
                )}
              </YStack>
            </YStack>
          </ScrollToTopTabBarContainer>
        </ScrollView>
      </XStack>
    </>
  )
}

const SizeableText = styled(Text, {
  variants: {
    size: {
      '...fontSize': (val, { font }) => ({
        ...(font && {
          fontSize: font.size[val],
          lineHeight: font.lineHeight[val],
          fontWeight: font.weight[val],
        }),
      }),
    },
  },
})

const Row = ({
  lecture,
  isLastItem,
}: {
  lecture: LectureType
  isLastItem: boolean
}) => {
  const router = useRouter()
  
  return (
    <View
      justifyContent="space-between"
      paddingVertical="$4"
      alignItems="flex-start"
      flexDirection="column"
      borderTopWidth={3}
      borderColor={isLastItem ? 'transparent' : '$borderColor'}
      $xs={{
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <XStack w="100%" justifyContent="space-between" alignItems="center">
        <SizeableText
          size="$6"
          $xs={{
            color: '$gray5',
          }}
        >
          {lecture.title}
        </SizeableText>
        <Button
          size="$3"
          circular
          onPress={() => router.push(`/lecture/${lecture.id}`)}
        >
          <Button.Icon>
            <Eye />
          </Button.Icon>
        </Button>
      </XStack>

      {parseMarkdown(truncateContent(lecture.content ?? ''), 14)}
    </View>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
