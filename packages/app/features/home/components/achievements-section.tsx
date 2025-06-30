import { Button, H2, SizableText, Switch, Theme, XStack, YStack } from '@my/ui'
import { ArrowRight, BookOpen, Stethoscope } from '@tamagui/lucide-icons'
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
      <XStack px="$4.5" ai="center" jc="space-between" mb="$5">
        <XStack ai="center" gap="$2">
          {mode === 'THEORETICAL' ? (
            <BookOpen size="$2" color="$blue10" />
          ) : (
            <Stethoscope size="$2" color="$green10" />
          )}
          <H2 theme="alt1" fow="400">
            {' '}
            Kapitel
          </H2>
        </XStack>
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

      <XStack mx="$5" mb="$5" gap="$4" ai="center" onPress={toggleMode}>
        <Theme name={mode === 'PRACTICAL' ? 'green' : 'light_blue_active'}>
          <Switch
            id="mode-switch"
            checked={mode === 'PRACTICAL'}
            onCheckedChange={(checked) => setMode(checked ? 'PRACTICAL' : 'THEORETICAL')}
            size="$4"
            theme={mode === 'PRACTICAL' ? 'green' : 'blue'}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
          <SizableText color={mode === 'THEORETICAL' ? '$blue10' : '$green10'}>
            {mode === 'THEORETICAL' ? 'Vorlesung' : 'Blockpraktikum'}
          </SizableText>
        </Theme>
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
