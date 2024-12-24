import { useState } from 'react'
import { Button, Sheet, YStack, SizableText } from 'tamagui'

type CustomSelectProps = {
  placeholder: string
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export function CustomSelect({ placeholder, items, value, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <YStack>
      <Button onPress={() => setOpen(true)} jc="flex-start">
        <SizableText>
          {value ? items.find((item) => item.value === value)?.label : placeholder}
        </SizableText>
      </Button>

      <Sheet open={open} onOpenChange={setOpen} modal dismissOnSnapToBottom>
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" justifyContent="flex-start" minHeight={300}>
          <YStack>
            {items.map((item) => (
              <Button
                key={item.value}
                onPress={() => {
                  onChange(item.value)
                  setOpen(false)
                }}
                backgroundColor={value === item.value ? '$backgroundHover' : 'transparent'}
              >
                <SizableText>{item.label}</SizableText>
              </Button>
            ))}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
