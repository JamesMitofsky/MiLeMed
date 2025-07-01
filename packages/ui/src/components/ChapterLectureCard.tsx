import { IconProps } from '@tamagui/helpers-icon'
import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronRight } from '@tamagui/lucide-icons'
import React from 'react'
import { Button, Card, CardProps, H4, Progress, SizableText, XStack, YStack } from 'tamagui'
import { useRouter } from 'solito/router'

export type AchievementCardProps = {
  icon?: React.FC<IconProps>
  title?: string
  progress?: {
    current: number
    full: number
    label?: string
  }
  action?: {
    text: string
    href?: string
  }
  dense?: boolean
  isDone?: boolean
  index?: number
  w?: string | number
} & CardProps

export const ChapterLectureCard = ({
  title,
  icon: Icon,
  progress,
  action,
  dense,
  isDone,
  index,
  w,
}: AchievementCardProps) => {
  const router = useRouter()

  return (
    <Card br="$0" chromeless w={w}>
      <Card.Header my="auto" padded gap={!dense ? '$3' : undefined}>
        {Icon && <Icon size="$3" o={0.6} />}
        <YStack gap={!dense ? '$2' : undefined}>
          <H4 size="$4" mt="$2">
            {title}
          </H4>

          {progress && (
            <XStack ai="center">
              <SizableText size="$3">{progress.current}</SizableText>
              <SizableText size="$2">
                /{progress.full} {progress.label}
              </SizableText>
            </XStack>
          )}

          {progress && (
            <Progress
              mt="$2"
              value={(progress.current / progress.full) * 100}
              bg="$color2"
              boc="$color5"
              bw={1}
            >
              <Progress.Indicator bc="$color7" />
            </Progress>
          )}

          {!!action && (
            <Button
              mt="$3"
              als="flex-end"
              size="$2"
              iconAfter={isDone ? <Check /> : <ChevronRight />}
              onPress={() => {
                if (!action?.href) return
                router.push(action.href)
              }}
            >
              {action.text}
            </Button>
          )}
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
