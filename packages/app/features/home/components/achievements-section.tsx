import { Button, SizableText, Switch, Theme, XStack, YStack } from '@my/ui'
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
        <XStack ai="center" gap="$3">
          {mode === 'PRACTICAL' ? (
            <Stethoscope size="$3" color="$brandPrimary" />
          ) : (
            <BookOpen size="$3" color="$brandSecondary" />
          )}

          <SizableText size="$8" color={mode === 'PRACTICAL' ? '$brandPrimary' : '$brandSecondary'}>
            {mode === 'PRACTICAL' ? 'Blockpraktikum' : 'Vorlesung'}
          </SizableText>
        </XStack>
      </XStack>

      <Theme name={mode === 'PRACTICAL' ? 'brandPrimary' : 'brandSecondary'}>
        <XStack mx="$5" mb="$5" gap="$4" ai="center" onPress={toggleMode}>
          <Switch
            id="mode-switch"
            checked={mode === 'PRACTICAL'}
            onCheckedChange={(checked) => setMode(checked ? 'PRACTICAL' : 'THEORETICAL')}
            size="$3"
            theme={mode === 'PRACTICAL' ? 'brandPrimary' : 'brandSecondary'}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
          <SizableText color="$black8">Lernmodus</SizableText>
        </XStack>
      </Theme>
      <ScrollAdapt>
        <XStack px="$4" fw="wrap" f={1} gap="$3">
          <ListOfChapters
            lockCardWidth
            limit={4}
            mode={mode === 'PRACTICAL' ? 'PRACTICAL' : 'THEORETICAL'}
          />
        </XStack>
      </ScrollAdapt>
      <XStack mt="$6" mr="$3" ai="center" jc="flex-end">
        <Button
          size="$3"
          chromeless
          iconAfter={ArrowRight}
          onPress={() => {
            router.push('/chapters')
          }}
        >
          Alle Kapitel
        </Button>
      </XStack>
    </YStack>
  )
}
