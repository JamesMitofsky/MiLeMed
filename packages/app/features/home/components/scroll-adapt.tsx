import { ScrollView, useMedia } from '@my/ui'

export function ScrollAdapt({
  children,
  withSnap = false,
  itemWidth,
}: {
  children: React.ReactNode
  withSnap?: boolean
  itemWidth?: number
}) {
  const { md } = useMedia()

  console.log('is md', md)
  return md ? (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      {...(itemWidth && { snapToInterval: itemWidth })}
      snapToAlignment="start"
      {...(withSnap && { decelerationRate: 0.9 })}
    >
      {children}
    </ScrollView>
  ) : (
    <ScrollView horizontal>{children}</ScrollView>
  )
}
