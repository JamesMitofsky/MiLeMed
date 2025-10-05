import { XStack, SizableText } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'

const CustomBackButton = ({ onBack }: { onBack: () => void }) => {
  return (
    <XStack ai="center" gap="$2" py="$4" bg="white" onPress={onBack}>
      <ArrowLeft />
      <SizableText size="$5">Zurück</SizableText>
    </XStack>
  )
}

export default CustomBackButton
