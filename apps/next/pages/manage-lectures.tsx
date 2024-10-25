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
} from '@my/ui'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

import { NextPageWithLayout } from './_app'
import useLecturesQuery from '../../../packages/app/utils/react-query/useLecturesQuery'
import { LecturesType } from '../../../packages/app/utils/supabase/databaseTypes'

const truncateContent = (content: string, sentenceCount: number = 2): string => {
  const sentences = content.match(/[^\.!\?]+[\.!\?]+/g)
  if (!sentences || sentences.length <= sentenceCount) {
    return content
  }
  return sentences.slice(0, sentenceCount).join(' ') + '...'
}

export const Page: NextPageWithLayout = () => {
  const { data } = useLecturesQuery()
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
              <YStack gap="$3">
                {data ? (
                  data.map((item, index) => {
                    const isLastItem = index === data.length - 1
                    return <Row isLastItem={isLastItem} key={index} lecture={item} />
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

const Row = ({ lecture, isLastItem }: { lecture: LecturesType; isLastItem: boolean }) => {
  const router = useRouter()
  return (
    <View
      justifyContent="space-between"
      paddingVertical="$8"
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
        <Button onPress={() => router.push(`lecture/${lecture.id}`)}>View</Button>
      </XStack>
      <SizeableText
        size="$4"
        color="$gray11"
        $xs={{
          color: '$color',
        }}
      >
        <ReactMarkdown>{truncateContent(lecture.content)}</ReactMarkdown>
      </SizeableText>
    </View>
  )
}
