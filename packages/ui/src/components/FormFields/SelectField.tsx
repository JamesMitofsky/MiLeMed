import { Check, ChevronDown } from '@tamagui/lucide-icons'
import { useFieldInfo, useTsController } from '@ts-react/form'
import React, { useId } from 'react'
import { Adapt, Fieldset, Label, Select, type SelectProps, Sheet, Theme, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { FieldError } from '../FieldError'

type SelectItem = {
  value: string
  name: string
}

export const SelectField = ({
  options,
  placeholder = 'Choose an option',
  native = true,
  ...props
}: {
  options: SelectItem[]
  placeholder?: string
} & Pick<SelectProps, 'size' | 'native'>) => {
  const {
    field: { value, onChange },
    error,
  } = useTsController<string>()
  const { label, isOptional } = useFieldInfo()
  const id = useId()

  const items = options
  return (
    <Theme name={error ? 'red' : null} forceClassName>
      {!!label && (
        <Label theme="alt1" size={props.size || '$3'} htmlFor={id}>
          {label} {isOptional && `(Optional)`}
        </Label>
      )}
      <Fieldset>
        <Select
          value={value}
          onValueChange={onChange}
          disablePreventBodyScroll
          {...props}
          native={!!native}
        >
          <Select.Trigger minWidth="100%" $md={{ maxWidth: 220 }}>
            <Select.Value placeholder={placeholder} />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet
              zIndex={1000}
              native={!!native}
              dismissOnSnapToBottom
              modal
              animationConfig={{
                type: 'spring',
                damping: 20,
                mass: 1.2,
                stiffness: 250,
              }}
              snapPointsMode="fit"
            >
              <Sheet.Frame marginBottom="$12">
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay
                opacity={0.5}
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                zIndex={0}
              />
            </Sheet>
          </Adapt>

          <Select.Content>
            <Select.Viewport minWidth={200}>
              <Select.Group>
                <Select.Label>Connected Module</Select.Label>
                {React.useMemo(
                  () =>
                    items.map((item, i) => (
                      <Select.Item index={i} key={item.name} value={item.value}>
                        <Select.ItemText>{item.name}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    )),
                  [items]
                )}
              </Select.Group>
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
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
