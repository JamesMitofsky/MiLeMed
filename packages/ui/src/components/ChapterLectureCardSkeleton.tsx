import { Button, Card, Progress, SizableText, XStack, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { Skeleton } from '../../../app/features/general/Skeleton'

export const ChapterLectureCardSkeleton = ({
  lockCardWidth,
  isDense,
}: {
  lockCardWidth?: boolean
  isDense?: boolean
}) => {
  return (
    <Card w={lockCardWidth ? 300 : '100%'} br="$0" chromeless>
      <Card.Header my="auto" padded gap="$3">
        <YStack gap="$2">
          {isDense ? (
            <Skeleton width="70%" height={15} />
          ) : (
            <>
              <Skeleton width="20%" height={15} />
              <Skeleton width="100%" height={15} />
            </>
          )}
          {!isDense && (
            <>
              <XStack o={0.5} ai="center" mb="$3">
                <Skeleton width={13} height={13} />
                <SizableText size="$2">
                  {' '}
                  / <Skeleton width={13} height={13} /> <Skeleton width={30} height={13} />
                </SizableText>
              </XStack>

              <Progress mt="$2" theme="alt2" value={0} bg="$color2" boc="$color5" bw={1}>
                <Progress.Indicator bc="$color7" />
              </Progress>
            </>
          )}
          <Button mt="$3" als="flex-end" size="$2">
            {'                '}
          </Button>
        </YStack>
      </Card.Header>
      <Card.Background>
        <LinearGradient
          br="$6"
          w="100%"
          h="100%"
          colors={['$color2', '$color3', '$color2']}
          start={[1, 1]}
          end={[0.85, 0]}
        />
      </Card.Background>
    </Card>
  )
}
