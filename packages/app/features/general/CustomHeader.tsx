import { XStack, SizableText } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'

const CustomHeader = ({ onBack }: { onBack: () => void }) => {
  return (
    <XStack ai="center" gap="$2" px="$4" pt="$6" bg="white" onPress={onBack}>
      <ArrowLeft />
      <SizableText size="$5">Zurück</SizableText>
    </XStack>
  )
}

export default CustomHeader
