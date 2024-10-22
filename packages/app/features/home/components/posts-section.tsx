import { H4, Stack, Text, View, XStack, Card, isWeb, validToken, Button, TextArea } from '@my/ui'
import { Info } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'

const feedCardWidthMd = validToken(
  Platform.select({
    web: 'calc(33.33% - 12px)',
    native: '32%',
  })
)

export const PostsSection = () => {
  return (
    <View>
      <XStack
        paddingHorizontal="$4.5"
        alignItems="center"
        gap="$2"
        justifyContent="space-between"
        marginBottom="$4"
      >
        <H4 theme="alt1" fontWeight="400">
          Feedback
        </H4>
      </XStack>
      <Stack
        maxWidth={1070}
        gap="$3"
        $platform-native={{ marginBottom: '$0', marginLeft: '$1', marginRight: '$2.5' }}
        justifyContent="flex-start"
        flexWrap="wrap"
        flexDirection={isWeb ? 'row' : 'column'}
        $gtMd={{
          gap: '$4',
        }}
      >
        <Card
          br="$3"
          bordered
          overflow="hidden"
          padding="$4"
          marginBottom="$3"
          $gtMd={{ width: feedCardWidthMd, marginBottom: '1%', minWidth: '32.333%' }}
        >
          <View
            flexDirection="column"
            width={400}
            maxWidth="100%"
            gap="$1"
            $sm={{
              paddingVertical: '$3',
            }}
          >
            <TextArea
              id="feedback-content"
              size="$3"
              fontWeight="300"
              height={180}
              placeholder="Teilen Sie uns Ihr Feedback mit"
            />
            <View flexDirection="row" theme="alt1" marginTop="$2.5" alignItems="center" gap="$2">
              <Info size={15} />
              <Text fontWeight="300" theme="alt2" fontSize="$2">
                Wir freuen uns über Ihr Feedback zu Funktionen, die Sie lieben oder vermissen, oder
                zu etwas, das Sie frustrierend finden.
              </Text>
            </View>

            <Button themeInverse marginTop="$3">
              <Button.Text>Absenden</Button.Text>
            </Button>
          </View>
        </Card>
      </Stack>
    </View>
  )
}
