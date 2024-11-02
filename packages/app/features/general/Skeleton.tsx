import { YStack } from '@my/ui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { useRef, useEffect } from 'react'
import { Animated } from 'react-native'

const Skeleton = ({ width, height }: { width: any; height: any }) => {
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

export { Skeleton }
