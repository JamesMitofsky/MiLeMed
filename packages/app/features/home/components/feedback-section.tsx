import { zodResolver } from '@hookform/resolvers/zod'
import { Stack, Text, View, Button, TextArea, YStack, useToastController, H2, XStack } from '@my/ui'
import { Info, Rocket } from '@tamagui/lucide-icons'
import { useForm, Controller } from 'react-hook-form'
import { Keyboard } from 'react-native'
import { z } from 'zod'

import { useSupabase } from '../../../utils/supabase/useSupabase'

const feedbackSchema = z.object({
  feedback: z.string().min(1, 'Feedback ist erforderlich'),
})

type FeedbackFormType = z.infer<typeof feedbackSchema>

type FeedbackSectionProps = {
  onSubmitSuccess?: () => void
}

export const FeedbackSection = ({ onSubmitSuccess }: FeedbackSectionProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<FeedbackFormType>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { feedback: '' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const supabase = useSupabase()
  const toast = useToastController()

  const onSubmit = async ({ feedback }: FeedbackFormType) => {
    try {
      const { error } = await supabase.from('user_feedback').insert({
        description: feedback,
      })

      if (error) {
        console.error('Error submitting feedback:', error)
        toast.show('Fehler beim Absenden des Feedbacks')
      } else {
        toast.show('Danke für dein Feedback!')
        Keyboard.dismiss()
        reset()
        if (onSubmitSuccess) {
          onSubmitSuccess()
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.show('Fehler beim Absenden des Feedbacks')
    }
  }

  return (
    <View>
      <XStack px="$4.5" ai="center" gap="$2" mb="$3">
        <H2 theme="alt1" fow="400">
          <Rocket size={25} />
        </H2>
        <H2 theme="alt1" fow="400">
          {' '}
          Feedback
        </H2>
      </XStack>

      <Stack maxWidth={1070} gap="$3" mx="$3.5">
        <YStack flexDirection="column" width="100%" gap="$1">
          <Controller
            name="feedback"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextArea
                id="feedback-content"
                size="$3"
                fontWeight="300"
                height={180}
                placeholder="Teilen Sie uns Ihr Feedback mit"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.feedback && isSubmitted && <Text color="red">{errors.feedback.message}</Text>}
          <View flexDirection="row" theme="alt1" marginTop="$2.5" alignItems="center" gap="$2">
            <Info size={15} />
            <Text fontWeight="300" theme="alt2" fontSize="$2">
              Wir freuen uns über Ihr Feedback zu Funktionen, die Sie lieben oder vermissen, oder zu
              etwas, das Sie frustrierend finden.
            </Text>
          </View>

          <Button themeInverse marginTop="$3" onPress={handleSubmit(onSubmit)}>
            <Button.Text>Absenden</Button.Text>
          </Button>
        </YStack>
      </Stack>
    </View>
  )
}
