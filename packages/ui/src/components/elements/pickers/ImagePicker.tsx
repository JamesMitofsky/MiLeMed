import { X } from '@tamagui/lucide-icons'
import { useState, forwardRef } from 'react'
import { Button, Image, ScrollView, View, XStack } from 'tamagui'

import { useFilePicker } from './hooks/useFilePicker'

enum MediaTypeOptions {
  /**
   * Images and videos.
   */
  // All = 'All',
  /**
   * Only videos.
   */
  // Videos = 'Videos',
  /**
   * Only images.
   */
  Images = 'Images',
}

/** ------ REFACTORED IMAGE PICKER FOR NATIVE DEVICES ------ */
export const ImagePicker = forwardRef<
  // Adjust the ref type for native components, e.g., View or another native component
  React.ElementRef<typeof View>,
  {
    disabled: boolean
    value: { fileURL: string; path: string } | undefined
    onChangeText: (imageSource: { fileURL: string; path: string }) => void
    onBlur: () => void
    placeholder?: string
    [key: string]: any
  }
>(({ disabled, value, onChangeText, onBlur, placeholder, ...props }, ref) => {
  const [images, setImages] = useState<string[]>([])
  const { open, getRootProps, dragStatus } = useFilePicker({
    typeOfPicker: 'image',
    mediaTypes: [MediaTypeOptions.Images],
    multiple: true,

    onPick: ({ nativeFiles }) => {
      if (nativeFiles?.length) {
        const pickedImages = nativeFiles.map((file: any) => {
          return {
            fileURL: file.uri,
            path: file.path,
          }
        })
        onChangeText(pickedImages[0])
        setImages((images) => [...images, pickedImages[0].fileURL])
      }
    },
  })

  const { isDragActive } = dragStatus

  return (
    <View
      flexDirection="column"
      // Remove getRootProps as it's web-specific
      borderStyle="dashed"
      id="image-picker"
      maxWidth={600}
      width="100%"
      height={350}
      justifyContent="center"
      alignItems="center"
      borderWidth={isDragActive ? 2 : 1}
      borderColor={isDragActive ? '$gray11' : '$gray9'}
      gap="$2"
      borderRadius="$true"
      {...props}
      ref={ref}
    >
      {/* Removed the input element as it's web-specific */}

      <Button size="$3" onPress={open} disabled={disabled}>
        Pick image
      </Button>

      <ScrollView
        display={images.length ? 'flex' : 'none'}
        flexDirection="row"
        borderRightWidth={1}
        borderLeftWidth={1}
        borderColor="$gray4Light"
        minWidth="100%"
        themeInverse
        paddingBottom="$0"
        horizontal
        overflow="scroll"
        flexWrap="nowrap"
        maxHeight={110}
      >
        <XStack gap="$4" flexWrap="nowrap" minWidth="100%" maxHeight={110} px="$4" pt={10}>
          {images.map((image, i) => (
            <View key={image} maxHeight={110} position="relative">
              <Image borderRadius={10} width={100} height={100} source={{ uri: image }} />
              <Button
                onPress={() => {
                  setImages(images.filter((_, index) => index !== i))
                }}
                size="$1"
                circular
                position="absolute"
                top={-6}
                right={6}
              >
                <X size={12} />
              </Button>
            </View>
          ))}
        </XStack>
      </ScrollView>
    </View>
  )
})
