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
          {mode === 'PRACTICAL' ? (
            <Stethoscope size="$2" color="$brandPrimary" />
          ) : (
            <BookOpen size="$2" color="$brandSecondary" />
          )}
          <H2 color="$accent0" fow="400">
            {' '}
            Kapitel
          </H2>
        </XStack>
        <Button
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
        <Theme name={mode === 'PRACTICAL' ? 'brandPrimary' : 'brandSecondary'}>
          <Switch
            id="mode-switch"
            checked={mode === 'PRACTICAL'}
            onCheckedChange={(checked) => setMode(checked ? 'PRACTICAL' : 'THEORETICAL')}
            size="$4"
            theme={mode === 'PRACTICAL' ? 'brandPrimary' : 'brandSecondary'}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
          <SizableText color={mode === 'PRACTICAL' ? '$brandPrimary' : '$brandSecondary'}>
            {mode === 'PRACTICAL' ? 'Blockpraktikum' : 'Vorlesung'}
          </SizableText>
        </Theme>
      </XStack>
      <ScrollAdapt>
        <XStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfChapters
            lockCardWidth
            limit={4}
            mode={mode === 'PRACTICAL' ? 'PRACTICAL' : 'THEORETICAL'}
          />
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}
