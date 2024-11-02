import { LinearGradient } from '@tamagui/linear-gradient'
import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { Button, Card, Progress, SizableText, XStack, YStack } from 'tamagui'

const PulsingGradientSkeleton = ({ width, height }: { width: any; height: any }) => {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )
    pulseAnimation.start()

    return () => {
      pulseAnimation.stop()
    }
  }, [opacity])

  return (
    <YStack width={width} height={height} borderRadius="$3">
      <Animated.View style={{ opacity, width: '100%', height: '100%' }}>
        <LinearGradient
          br="$3"
          w="100%"
          h="100%"
          colors={['grey', 'grey']}
          start={[1, 1]}
          end={[0.85, 0]}
        />
      </Animated.View>
    </YStack>
  )
}

export default PulsingGradientSkeleton

export const ChapterLectureCardSkeleton = ({ lockCardWidth }: { lockCardWidth?: boolean }) => {
  return (
    <Card w={lockCardWidth ? 300 : undefined} br="$0" chromeless>
      <Card.Header my="auto" padded gap="$3">
        <YStack gap="$2">
          <PulsingGradientSkeleton width="100%" height={15} />
          <PulsingGradientSkeleton width="20%" height={15} />

          <XStack o={0.5} ai="center" mb="$3">
            <PulsingGradientSkeleton width={13} height={13} />
            <SizableText size="$2">
              {' '}
              / <PulsingGradientSkeleton width={13} height={13} />{' '}
              <PulsingGradientSkeleton width={30} height={13} />
            </SizableText>
          </XStack>

          <Progress mt="$2" theme="alt2" value={0} bg="$color2" boc="$color5" bw={1}>
            <Progress.Indicator bc="$color7" />
          </Progress>
          <Button mt="$3" als="flex-end" size="$2">
            {'             '}
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
