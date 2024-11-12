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
import { Eye } from '@tamagui/lucide-icons'
import { parseMarkdown } from 'app/features/general/markdownParser'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'

import { NextPageWithLayout } from './_app'
import useLecturesQuery from '../../../packages/app/utils/react-query/useLecturesQuery'

// Step 1: Define the type for the return value of useLecturesQuery
type UseLecturesQueryReturnType = ReturnType<typeof useLecturesQuery>

// Step 2: Define the type for the data property
type SingleLectureDataType = NonNullable<UseLecturesQueryReturnType['data']>[number]

const truncateContent = (content: string, sentenceCount: number = 2): string => {
  const sentences = content.match(/[^\.!\?]+[\.!\?]+/g)
  if (!sentences || sentences.length <= sentenceCount) {
    return content
  }
  return sentences.slice(0, sentenceCount).join(' ') + '...'
}

export const Page: NextPageWithLayout = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mode, setMode] = useState<'THEORETICAL' | 'PRACTICAL'>('THEORETICAL')
  const { data } = useLecturesQuery()

  const toggleMode = () => {
    setMode(mode === 'THEORETICAL' ? 'PRACTICAL' : 'THEORETICAL')
  }

  const handleSearchChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    // @ts-ignore
    setSearchQuery(e.target.value)
  }

  const lecturesFilteredBySearchAndMode = data?.filter(
    (item) =>
      item.lecture_title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.chapter_mode === mode
  )

  return (
    <>
      <Head>
        <title>Manage Lectures</title>
      </Head>
      <XStack maw={1480} width={800} m="auto" f={1}>
        <ScrollView f={4} fb={0}>
          <ScrollToTopTabBarContainer>
            <YStack gap="$7" pb="$10" pt="$5">
              {isWeb && <H2>Manage Lectures</H2>}
              <Input
                mx="$1"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
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
                {lecturesFilteredBySearchAndMode ? (
                  lecturesFilteredBySearchAndMode.map((item, index) => {
                    const isLastItem = index === lecturesFilteredBySearchAndMode.length - 1
                    const isNotFirstItem = index > 0
                    const isFirstOccurrence =
                      index === 0 ||
                      lecturesFilteredBySearchAndMode[index - 1].chapter_title !==
                        item.chapter_title

                    return (
                      <React.Fragment key={index}>
                        {isFirstOccurrence && (
                          <H2 mt={isNotFirstItem && '$12'}>{item.chapter_title}</H2>
                        )}
                        <Row isLastItem={isLastItem} lecture={item} />
                      </React.Fragment>
                    )
                  })
                ) : (
                  <FullscreenSpinner />
                )}
              </YStack>
            </YStack>
          </ScrollToTopTabBarContainer>
        </ScrollView>
      </XStack>
    </>
  )
}
Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page

const SizeableText = styled(Text, {
  variants: {
    size: {
      '...fontSize': (val, { font }) => {
        if (!font) return {}
        return {
          fontSize: font.size[val],
          lineHeight: font.lineHeight[val],
          fontWeight: font.weight[val],
        }
      },
    },
  },
})

const Row = ({ lecture, isLastItem }: { lecture: SingleLectureDataType; isLastItem: boolean }) => {
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
          {lecture.lecture_title}
        </SizeableText>
        <Button size="$3" circular onPress={() => router.push(`lecture/${lecture.lecture_id}`)}>
          <Button.Icon>
            <Eye />
          </Button.Icon>
        </Button>
      </XStack>

      {parseMarkdown(truncateContent(lecture.lecture_content ?? ''), 14)}
    </View>
  )
}
