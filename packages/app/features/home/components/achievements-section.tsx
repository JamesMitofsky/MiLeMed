import { Button, H4, XStack, YStack } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/router'

import ListOfChapters from './list-of-chapters'
import { ScrollAdapt } from './scroll-adapt'

export const ChaptersPreviewList = () => {
  const router = useRouter()

  return (
    <YStack>
      <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
        <H4 theme="alt1" fow="400">
          Kapitel
        </H4>
        <Button
          theme="alt2"
          size="$2"
          chromeless
          iconAfter={ArrowRight}
          onPress={() => {
            router.push('/chapters')
          }}
        >
          Alle Kapitel ansehen
        </Button>
      </XStack>

      <ScrollAdapt>
        <XStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfChapters lockCardWidth limit={4} />
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}
