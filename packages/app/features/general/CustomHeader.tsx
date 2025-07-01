import { XStack, SizableText } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/router'

const CustomHeader = () => {
  const router = useRouter()
  return (
    <XStack ai="center" gap="$2" px="$4" bg="white" onPress={() => router.back()}>
      <ArrowLeft />
      <SizableText size="$5">Zurück</SizableText>
    </XStack>
  )
}

export default CustomHeader
