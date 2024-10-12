import { validToken, Button, H4, XStack, YStack } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { useRouter } from 'solito/router'

import ListOfModules from './list-of-modules'
import { ScrollAdapt } from './scroll-adapt'

const halfMinusSpace = validToken(
  Platform.select({
    web: 'calc(50% - 12px)',
    native: '53%',
  })
)

const quarterMinusSpace = validToken(
  Platform.select({
    web: 'calc(25% - 12px)',
    native: '21%',
  })
)

export const AchievementsSection = () => {
  const router = useRouter()

  return (
    <YStack>
      <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
        <H4 theme="alt1" fow="400">
          Modules
        </H4>
        <Button
          theme="alt2"
          size="$2"
          chromeless
          iconAfter={ArrowRight}
          onPress={() => {
            router.push('/modules')
          }}
        >
          See all modules
        </Button>
      </XStack>

      <ScrollAdapt>
        <XStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfModules limit={4} />
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}
