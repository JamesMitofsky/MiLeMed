import { useContext, useEffect, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { marked } from 'marked'
import RenderHtml from 'react-native-render-html'
import { YStack, SizableText, Button } from 'tamagui'
import * as WebBrowser from 'expo-web-browser'

import { ThemeContext } from '../../provider/theme/UniversalThemeProvider.native'
import { Database } from '@my/supabase/types'

interface IndividualLectureProps {
  lectureId: string
}

// Function to convert markdown to HTML using marked
const markdownToHtml = async (markdown: string): Promise<string> => {
  return marked.parse(markdown)
}

const VersionUpdateInfo = ({
  remoteVersionInfo,
}: {
  remoteVersionInfo: Database['public']['Tables']['db_version']['Row'] | null
}) => {
  // Keep router for potential future use with commented functions
  // const router = useRouter()
  const { width } = useWindowDimensions()

  // Convert markdown to HTML
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    if (remoteVersionInfo?.description) {
      markdownToHtml(remoteVersionInfo?.description)
        .then((html) => setHtmlContent(html))
        .catch((error) => console.error('Error converting markdown to HTML:', error))
    }
  }, [remoteVersionInfo?.description])

  const context = useContext(ThemeContext)

  // function handleNavigateToQuiz() {
  //   router.push(`/lectures/${id}/quiz`)
  // }

  const styles = useMemo(
    () => ({
      body: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 16,
      },
      h1: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 26,
        marginTop: 8,
        marginBottom: 8,
      },
      h2: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 24,
        marginTop: 8,
        marginBottom: 8,
      },
      h3: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 22,
        marginTop: 8,
        marginBottom: 8,
      },
      p: {
        color: context?.current === 'dark' ? '#fff' : '#000',
        fontSize: 20,
        marginTop: 8,
        marginBottom: 8,
      },
    }),
    [context?.current]
  )

  return (
    <YStack flex={1} px="$5" mt="$-15" alignItems="center" justifyContent="center" gap="$4">
      <SizableText pt="$5" pb="$2" size="$11">
        {remoteVersionInfo?.title}
      </SizableText>
      <RenderHtml
        contentWidth={width - 32} // Accounting for padding
        source={{ html: htmlContent }}
        tagsStyles={styles}
      />
      <Button
        onPress={() => WebBrowser.openBrowserAsync('https://www.milemed.de/app')}
        size="$6"
        theme="brandPrimary"
        mt="$8"
      >
        Los geht’s! 🚀
      </Button>
    </YStack>
  )
}

export default VersionUpdateInfo
