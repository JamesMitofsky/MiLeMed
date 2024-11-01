import { Button, H4, Label, Switch, XStack, YStack } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useRouter } from 'solito/router'

import ListOfChapters from './list-of-chapters'
import { ScrollAdapt } from './scroll-adapt'

export const ChaptersPreviewList = () => {
  const router = useRouter()
  const [isTheoretical, setIsTheoretical] = useState(true)

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

      <Button
        flexDirection="row"
        justifyContent="flex-start"
        my="$2"
        maxWidth={200}
        animation="medium"
        onPress={() => setIsTheoretical(!isTheoretical)}
      >
        <Switch checked={isTheoretical} onCheckedChange={setIsTheoretical} size="$2">
          <Switch.Thumb borderColor="$color1" animation="200ms" />
        </Switch>
        <Label size="$1.5">{isTheoretical ? 'Theoretisch' : 'Praktisch'}</Label>
      </Button>

      <ScrollAdapt>
        <XStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfChapters
            lockCardWidth
            limit={4}
            mode={isTheoretical ? 'THEORETICAL' : 'PRACTICAL'}
          />
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}
