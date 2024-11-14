import { Check } from '@tamagui/lucide-icons'
import { useFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Checkbox, CheckboxProps, CheckedState, Fieldset, Label, Theme, XStack } from 'tamagui'

import { FieldError } from '../FieldError'

export const BooleanCheckboxField = (
  props: Pick<CheckboxProps, 'size' | 'native'> & { customLabel?: JSX.Element }
) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<CheckedState>()
  const { label, isOptional } = useFieldInfo()
  const id = useId()
  const disabled = isSubmitting

  return (
    <Theme name={error ? 'red' : null} forceClassName>
      <Fieldset>
        <XStack width="100%" gap="$4" alignItems="center">
          {!!label && (
            <Label theme="alt1" size={props.size || '$3'} htmlFor={id}>
              {label} {isOptional && `(Optional)`}
            </Label>
          )}
          {!!props.customLabel && props.customLabel}
          <Checkbox
            disabled={disabled}
            native
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
            ref={field.ref}
            id={id}
            {...props}
          >
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        </XStack>
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
