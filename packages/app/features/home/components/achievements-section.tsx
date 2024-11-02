import { Button, H4, SizableText, Switch, XStack, YStack } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/router'

import ListOfChapters from './list-of-chapters'
import { ScrollAdapt } from './scroll-adapt'
import { useMode } from '../../../provider/modeProvider'

export const ChaptersPreviewList = () => {
  const router = useRouter()
  const { mode, setMode } = useMode()

  const toggleMode = () => {
    setMode(mode === 'THEORETICAL' ? 'PRACTICAL' : 'THEORETICAL')
  }

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

      <XStack mx="$5" mt="$3" mb="$5" gap="$4" onPress={toggleMode}>
        <Switch checked={mode === 'THEORETICAL'} onCheckedChange={toggleMode} size="$2">
          <Switch.Thumb borderColor="$color1" animation="200ms" />
        </Switch>
        <SizableText>{mode === 'THEORETICAL' ? 'Theoretisch' : 'Praktisch'}</SizableText>
      </XStack>
      <ScrollAdapt>
        <XStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfChapters
            lockCardWidth
            limit={4}
            mode={mode === 'THEORETICAL' ? 'THEORETICAL' : 'PRACTICAL'}
          />
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}
