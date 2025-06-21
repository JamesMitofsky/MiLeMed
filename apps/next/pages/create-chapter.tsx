import {
  H2,
  ScrollView,
  XStack,
  YStack,
  SizableText,
  Button,
  Input,
  TextArea,
  Form,
  Card,
  Spinner,
  Switch,
  Label,
  Theme,
} from '@my/ui'
import { ArrowLeft, BookOpen, Stethoscope, Save } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import { useSessionContext } from 'app/utils/supabase/useSessionContext'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'solito/navigation'

import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { supabaseClient } = useSessionContext()
  const queryClient = useQueryClient()

  // State for form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [mode, setMode] = useState<'THEORETICAL' | 'PRACTICAL'>('THEORETICAL')
  const [isLoadingSortOrder, setIsLoadingSortOrder] = useState(true)

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch the highest sort order when the component loads or mode changes
  useEffect(() => {
    const fetchHighestSortOrder = async () => {
      setIsLoadingSortOrder(true)
      try {
        // Get the highest sort order from existing chapters with the same mode
        const { data, error } = await supabaseClient
          .from('content_chapters')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)

        if (error) throw error

        // Set the sort order to one more than the highest, or 1 if no chapters exist
        const highestSortOrder = data && data.length > 0 ? data[0].sort_order : 0
        setSortOrder(highestSortOrder + 1)
      } catch (err) {
        console.error('Error fetching highest sort order:', err)
        // Default to 1 if there's an error
        setSortOrder(1)
      } finally {
        setIsLoadingSortOrder(false)
      }
    }

    fetchHighestSortOrder()
  }, [mode, supabaseClient])

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      setError('Titel ist erforderlich')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Insert new chapter
      const { error } = await supabaseClient
        .from('content_chapters')
        .insert([
          {
            title,
            description,
            sort_order: sortOrder,
            mode,
          },
        ])
        .select()

      if (error) throw error

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['all-chapters-and-lectures', mode],
      })

      setSuccess(true)

      // Reset form
      setTitle('')
      setDescription('')
      setSortOrder(0)

      // Redirect after short delay
      setTimeout(() => {
        router.push('/manage-lectures')
      }, 1500)
    } catch (err) {
      console.error('Error creating chapter:', err)
      setError('Failed to create chapter')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Neues Kapitel erstellen</title>
      </Head>

      <XStack maw={1480} width={800} m="auto" f={1}>
        <ScrollView f={4} fb={0}>
          <ScrollToTopTabBarContainer>
            <YStack gap="$7" pb="$10" pt="$5">
              <XStack>
                <Button icon={ArrowLeft} chromeless onPress={() => router.push('/manage-lectures')}>
                  <Button.Text>Zurück</Button.Text>
                </Button>
              </XStack>

              <XStack jc="space-between" ai="center" mt="$3">
                <XStack ai="center" gap="$2" ml="$3">
                  {mode === 'THEORETICAL' ? (
                    <BookOpen size="$3" color="$blue10" />
                  ) : (
                    <Stethoscope size="$3" color="$green10" />
                  )}
                  <H2>Neues Kapitel erstellen</H2>
                </XStack>
              </XStack>

              <YStack p="$4" gap="$6">
                <Card bordered padding="$5">
                  <Form onSubmit={handleSubmit}>
                    <YStack gap="$4">
                      {/* Mode selection */}
                      <YStack gap="$2">
                        <SizableText fontWeight="bold">Modus</SizableText>
                        <XStack alignItems="center" gap="$4">
                          <Theme name={mode === 'PRACTICAL' ? 'green' : 'light_blue_active'}>
                            <Switch
                              id="mode-switch"
                              checked={mode === 'PRACTICAL'}
                              onCheckedChange={(checked) =>
                                setMode(checked ? 'PRACTICAL' : 'THEORETICAL')
                              }
                              size="$4"
                              theme={mode === 'PRACTICAL' ? 'green' : 'blue'}
                            >
                              <Switch.Thumb animation="quick" />
                            </Switch>
                          </Theme>
                          <Label htmlFor="mode-switch" size="$6" fontWeight="bold">
                            {mode === 'THEORETICAL' ? 'Vorlesung' : 'Blockpraktikum'}
                          </Label>
                          {mode === 'THEORETICAL' ? (
                            <BookOpen size="$1" color="$blue10" />
                          ) : (
                            <Stethoscope size="$1" color="$green10" />
                          )}
                        </XStack>
                      </YStack>

                      {/* Title input */}
                      <YStack gap="$2">
                        <SizableText fontWeight="bold">Titel</SizableText>
                        <Input
                          placeholder="Titel des Kapitels"
                          value={title}
                          onChangeText={setTitle}
                        />
                      </YStack>

                      {/* Sort order input - non-editable */}
                      <YStack gap="$2">
                        <SizableText fontWeight="bold">
                          Sortierreihenfolge (automatisch festgelegt)
                        </SizableText>
                        <Input
                          placeholder={
                            isLoadingSortOrder ? 'Wird geladen...' : 'Sortierreihenfolge'
                          }
                          value={sortOrder.toString()}
                          disabled={true}
                          opacity={0.7}
                        />
                        <SizableText size="$2" color="$gray10">
                          Die Sortierreihenfolge wird automatisch festgelegt
                        </SizableText>
                      </YStack>

                      {/* Description textarea */}
                      <YStack gap="$2">
                        <SizableText fontWeight="bold">Beschreibung (optional)</SizableText>
                        <TextArea
                          placeholder="Beschreibung des Kapitels"
                          value={description}
                          onChangeText={setDescription}
                          minHeight={100}
                        />
                      </YStack>

                      {/* Error message */}
                      {error && (
                        <SizableText color="$red10" textAlign="center">
                          {error}
                        </SizableText>
                      )}

                      {/* Success message */}
                      {success && (
                        <SizableText color="$green10" textAlign="center">
                          Kapitel erfolgreich erstellt! Sie werden weitergeleitet...
                        </SizableText>
                      )}

                      {/* Submit button */}
                      <Button
                        theme={mode === 'THEORETICAL' ? 'blue' : 'green'}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        icon={isSubmitting ? Spinner : Save}
                      >
                        <Button.Text>
                          {isSubmitting ? 'Wird gespeichert...' : 'Kapitel speichern'}
                        </Button.Text>
                      </Button>
                    </YStack>
                  </Form>
                </Card>
              </YStack>
            </YStack>
          </ScrollToTopTabBarContainer>
        </ScrollView>
      </XStack>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
