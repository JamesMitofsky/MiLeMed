import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React from 'react'
import type { SelectProps } from 'tamagui'
import { Adapt, Select, Sheet, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

type CustomSelectProps = SelectProps & {
  placeholder: string
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void // Callback to pass selected value to parent
}

export function CustomSelect({ placeholder, items, value, onChange }: CustomSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disablePreventBodyScroll>
      <Select.Trigger iconAfter={ChevronDown}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>{placeholder}</Select.Label>
            {React.useMemo(
              () =>
                items.map((item, i) => (
                  <Select.Item index={i} key={item.value} value={item.value}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    {value === item.value && (
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    )}
                  </Select.Item>
                )),
              [items, value]
            )}
          </Select.Group>

          {/* <YStack
            position="absolute"
            right={0}
            top={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
            width="$4"
            pointerEvents="none"
          >
            <ChevronDown />
          </YStack> */}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}
