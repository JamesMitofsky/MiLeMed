import {
  H2,
  ScrollView,
  XStack,
  YStack,
  Text,
  Button,
  Input,
  TextArea,
  Form,
  Select,
  Spinner,
  Card,
} from '@my/ui'
import { ArrowLeft, BookOpen, Beaker, Save } from '@tamagui/lucide-icons'
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
  const [content, setContent] = useState('')
  const [chapterId, setChapterId] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState(0)
  const [mode, setMode] = useState<'THEORETICAL' | 'PRACTICAL'>('THEORETICAL')

  // State for chapters
  const [chapters, setChapters] = useState<{ id: number; title: string }[]>([])
  const [isLoadingChapters, setIsLoadingChapters] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch chapters based on mode
  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoadingChapters(true)
      try {
        const { data, error } = await supabaseClient
          .from('content_chapters')
          .select('*')
          .eq('mode', mode)
          .order('sort_order', { ascending: true })

        if (error) throw error
        setChapters(data || [])
      } catch (err) {
        console.error('Error fetching chapters:', err)
        setError('Failed to load chapters')
      } finally {
        setIsLoadingChapters(false)
      }
    }

    fetchChapters()
  }, [mode, supabaseClient])

  // Handle mode toggle
  const handleModeToggle = (newMode: 'THEORETICAL' | 'PRACTICAL') => {
    setMode(newMode)
    setChapterId(null) // Reset chapter selection when mode changes
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      setError('Titel ist erforderlich')
      return
    }

    if (!chapterId) {
      setError('Bitte wählen Sie ein Kapitel aus')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Insert new lecture
      const { error } = await supabaseClient
        .from('content_lectures')
        .insert([
          {
            title,
            content,
            chapter_id: chapterId,
            sort_order: sortOrder,
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
      setContent('')
      setChapterId(null)
      setSortOrder(0)

      // Redirect after short delay
      setTimeout(() => {
        router.push('/manage-lectures')
      }, 1500)
    } catch (err) {
      console.error('Error creating lecture:', err)
      setError('Failed to create lecture')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Neue Lektion erstellen</title>
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
                    <Beaker size="$3" color="$green10" />
                  )}
                  <H2>Neue Lektion erstellen</H2>
                </XStack>
              </XStack>

              <YStack p="$4" gap="$6">
                <Card bordered padding="$5">
                  <Form onSubmit={handleSubmit}>
                    <YStack gap="$4">
                      {/* Mode selection */}
                      <YStack gap="$2">
                        <Text fontWeight="bold">Modus</Text>
                        <XStack gap="$4">
                          <Button
                            theme={mode === 'THEORETICAL' ? 'blue' : 'gray'}
                            onPress={() => handleModeToggle('THEORETICAL')}
                            icon={BookOpen}
                          >
                            <Button.Text>Vorlesung</Button.Text>
                          </Button>
                          <Button
                            theme={mode === 'PRACTICAL' ? 'green' : 'gray'}
                            onPress={() => handleModeToggle('PRACTICAL')}
                            icon={Beaker}
                          >
                            <Button.Text>Blockpraktikum</Button.Text>
                          </Button>
                        </XStack>
                      </YStack>

                      {/* Chapter selection */}
                      <YStack gap="$2">
                        <Text fontWeight="bold">Kapitel</Text>
                        {isLoadingChapters ? (
                          <XStack ai="center" gap="$2">
                            <Spinner size="small" />
                            <Text>Kapitel werden geladen...</Text>
                          </XStack>
                        ) : chapters.length > 0 ? (
                          <Select
                            value={chapterId?.toString() || ''}
                            onValueChange={(value) => setChapterId(parseInt(value, 10))}
                          >
                            <Select.Trigger>
                              <Select.Value placeholder="Kapitel auswählen" />
                            </Select.Trigger>
                            <Select.Content>
                              <Select.ScrollUpButton />
                              <Select.Viewport>
                                <Select.Group>
                                  <Select.Label>Kapitel</Select.Label>
                                  {chapters.map((chapter, index) => (
                                    <Select.Item
                                      key={chapter.id}
                                      value={chapter.id.toString()}
                                      index={index}
                                    >
                                      <Select.ItemText>{chapter.title}</Select.ItemText>
                                    </Select.Item>
                                  ))}
                                </Select.Group>
                              </Select.Viewport>
                              <Select.ScrollDownButton />
                            </Select.Content>
                          </Select>
                        ) : (
                          <Text color="$red10">
                            Keine Kapitel für diesen Modus gefunden. Bitte erstellen Sie zuerst ein
                            Kapitel.
                          </Text>
                        )}
                      </YStack>

                      {/* Title input */}
                      <YStack gap="$2">
                        <Text fontWeight="bold">Titel</Text>
                        <Input
                          placeholder="Titel der Lektion"
                          value={title}
                          onChangeText={setTitle}
                        />
                      </YStack>

                      {/* Sort order input */}
                      <YStack gap="$2">
                        <Text fontWeight="bold">Sortierreihenfolge</Text>
                        <Input
                          placeholder="Sortierreihenfolge (z.B. 1, 2, 3)"
                          value={sortOrder.toString()}
                          onChangeText={(text) => setSortOrder(parseInt(text, 10) || 0)}
                          keyboardType="numeric"
                        />
                      </YStack>

                      {/* Content textarea */}
                      <YStack gap="$2">
                        <Text fontWeight="bold">Inhalt</Text>
                        <TextArea
                          placeholder="Inhalt der Lektion"
                          value={content}
                          onChangeText={setContent}
                          minHeight={200}
                        />
                      </YStack>

                      {/* Error message */}
                      {error && (
                        <Text color="$red10" textAlign="center">
                          {error}
                        </Text>
                      )}

                      {/* Success message */}
                      {success && (
                        <Text color="$green10" textAlign="center">
                          Lektion erfolgreich erstellt! Sie werden weitergeleitet...
                        </Text>
                      )}

                      {/* Submit button */}
                      <Button
                        theme={mode === 'THEORETICAL' ? 'blue' : 'green'}
                        onPress={handleSubmit}
                        disabled={isSubmitting || !chapterId}
                        icon={isSubmitting ? Spinner : Save}
                      >
                        <Button.Text>
                          {isSubmitting ? 'Wird gespeichert...' : 'Lektion speichern'}
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
