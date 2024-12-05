import { type CardProps, Card, H6, YStack, Button, Paragraph, Theme, XStack, H3 } from 'tamagui'

export type OverviewCardTypes = {
  title: string
  value: string
  badgeText?: string
  badgeAfter?: string
  badgeState?: 'success' | 'failure' | 'indifferent'
  progress?: {
    current: number
    full: number
  }
} & CardProps

export const OverviewCard = ({
  title,
  value,
  badgeText,
  badgeState,
  badgeAfter,
  progress,
  ...props
}: OverviewCardTypes) => {
  return (
    <Card
      br="$0"
      backgroundColor="transparent"
      miw={180}
      $gtMd={{ miw: 220, f: 1, fb: 0 }}
      {...props}
    >
      <Card.Header
        f={1}
        jc="flex-start"
        pl="$0"
        pt="$1"
        $platform-native={{ pb: '$0' }}
        ai="flex-start"
      >
        <YStack f={1} jc="flex-start" ai="flex-start">
          <H6 size="$4" fow="$1" theme="alt2">
            {title}
          </H6>
          <H3 mt="$2">{value}</H3>
          {/* {progress && (
            <Progress
              w={50}
              mt="$2"
              theme="alt2"
              value={(progress.current / progress.full) * 100}
              bg="$color2"
              boc="$color5"
              bw={1}
            >
              <Progress.Indicator bc="$color7" />
            </Progress>
          )} */}
        </YStack>
        <XStack mt="$4">
          {!!badgeText && (
            <Theme
              name={
                badgeState === 'success'
                  ? 'green_alt1'
                  : badgeState === 'failure'
                  ? 'red_alt1'
                  : undefined
              }
            >
              <Button size="$2" disabled>
                {badgeText}
              </Button>
            </Theme>
          )}
          {badgeAfter && <Paragraph>{badgeAfter}</Paragraph>}
        </XStack>
      </Card.Header>
    </Card>
  )
}
