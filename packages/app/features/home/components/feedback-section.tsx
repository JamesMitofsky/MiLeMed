import { H4, Stack, Text, View, XStack, isWeb, Button, TextArea, YStack } from '@my/ui'
import { Info, Rocket } from '@tamagui/lucide-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const FeedbackSection = () => {
  return (
    <View>
      <XStack
        paddingHorizontal="$4.5"
        alignItems="center"
        gap="$2"
        justifyContent="space-between"
        marginBottom="$4"
      >
        <H4 theme="alt1" fow="400">
          <Rocket size={15} /> Feedback
        </H4>
      </XStack>
      <Stack
        maxWidth={1070}
        gap="$3"
        $platform-native={{ marginBottom: '$0', marginLeft: '$3.5', marginRight: '$3.5' }}
        justifyContent="flex-start"
        flexWrap="wrap"
        flexDirection={isWeb ? 'row' : 'column'}
        $gtMd={{
          gap: '$4',
        }}
      >
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardOpeningTime={0} // Reduces keyboard opening delay
          resetScrollToCoords={{ x: 0, y: 0 }}
        >
          <YStack flexDirection="column" width="100%" gap="$1">
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
          </YStack>
        </KeyboardAwareScrollView>
      </Stack>
    </View>
  )
}
