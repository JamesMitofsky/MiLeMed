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
  Separator,
  SizableText,
  Accordion,
} from '@my/ui'
import { ArrowLeft, BookOpen, Check, Pen, Plus, Save, Stethoscope, X } from '@tamagui/lucide-icons'
import { useQueryClient } from '@tanstack/react-query'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import { useSessionContext } from 'app/utils/supabase/useSessionContext'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'solito/navigation'

import { NextPageWithLayout } from './_app'
import QuizQuestionForm, {
  QuizQuestionFormData,
} from '../../../packages/app/features/lectures/QuizQuestionForm'
import { addQuizQuestion } from '../../../packages/app/utils/supabase/simpleQueries/addQuizQuestion'

export const Page: NextPageWithLayout = () => {
  const router = useRouter()
  const { supabaseClient } = useSessionContext()
  const queryClient = useQueryClient()

  // State for form fields
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [chapterId, setChapterId] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<number>() // Default to 1 as the starting sort order
  const [mode, setMode] = useState<'THEORETICAL' | 'PRACTICAL'>('THEORETICAL')

  // State for quiz questions
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionFormData[]>([])
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string[]>([])
  const lectureIdRef = useRef<number | null>(null)

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

  // Fetch the highest sort order for the selected chapter
  const fetchHighestSortOrder = async (selectedChapterId: number) => {
    try {
      const { data, error } = await supabaseClient
        .from('content_lectures')
        .select('sort_order')
        .eq('chapter_id', selectedChapterId)
        .order('sort_order', { ascending: false })
        .limit(1)

      if (error) throw error

      // If there are lectures in this chapter, set sort order to highest + 1, otherwise start at 1
      const nextSortOrder = data && data.length > 0 ? data[0].sort_order + 1 : 1
      setSortOrder(nextSortOrder)
    } catch (err) {
      console.error('Error fetching highest sort order:', err)
    }
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
      const { data, error } = await supabaseClient
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

      // Store the lecture ID for quiz question creation
      if (data && data.length > 0) {
        lectureIdRef.current = data[0].id
      }

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['all-chapters-and-lectures', mode],
      })

      setSuccess(true)

      // If there are quiz questions, save them and then redirect
      if (quizQuestions.length > 0 && lectureIdRef.current) {
        try {
          // Save all quiz questions
          const savePromises = quizQuestions.map((question) =>
            addQuizQuestion(supabaseClient, lectureIdRef.current!, question)
          )

          await Promise.all(savePromises)
          console.log('All quiz questions saved successfully')
        } catch (err) {
          console.error('Error saving quiz questions:', err)
          setError(
            'Lektion wurde erstellt, aber es gab ein Problem beim Speichern der Quiz-Fragen.'
          )
        } finally {
          setIsSubmitting(false)
        }
      }

      // Reset form
      setTitle('')
      setContent('')
      setChapterId(null)
      setSortOrder(1) // Reset to default sort order of 1

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
                    <Stethoscope size="$3" color="$green10" />
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
                            icon={Stethoscope}
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
                            onValueChange={(value) => {
                              const selectedChapterId = parseInt(value, 10)
                              setChapterId(selectedChapterId)
                              fetchHighestSortOrder(selectedChapterId)
                            }}
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

                      {/* Sort order input - automatically calculated but can be overridden */}
                      <YStack gap="$2">
                        <Text fontWeight="bold">Sortierreihenfolge</Text>
                        <Input
                          placeholder="Sortierreihenfolge (z.B. 1, 2, 3)"
                          value={sortOrder?.toString() || ''}
                          editable={false}
                          opacity={0.7}
                        />
                        <Text fontSize="$2" color="$gray10">
                          Wird automatisch gesetzt, kann aber überschrieben werden
                        </Text>
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

                      {/* Quiz Questions Section */}
                      <YStack gap="$2">
                        <Text fontWeight="bold">Quiz Fragen</Text>
                        <Accordion
                          type="multiple"
                          value={accordionValue}
                          onValueChange={setAccordionValue}
                        >
                          <Accordion.Item value="quiz-questions">
                            <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                              <SizableText>Quiz Fragen hinzufügen</SizableText>
                              <Pen size={16} />
                            </Accordion.Trigger>
                            <Accordion.Content>
                              <YStack gap="$4" pt="$2">
                                <Text fontSize="$2" color="$gray10">
                                  Fügen Sie Quiz-Fragen zu dieser Lektion hinzu. Sie können
                                  Multiple-Choice-Fragen oder offene Fragen erstellen.
                                </Text>

                                {/* Show quiz questions that have been added */}
                                {quizQuestions.length > 0 && (
                                  <YStack gap="$4" pb="$4">
                                    <Text fontWeight="bold">Erstellte Fragen:</Text>
                                    {quizQuestions.map((question, index) => (
                                      <YStack
                                        key={index}
                                        p="$3"
                                        borderWidth={1}
                                        borderColor="$gray3"
                                        borderRadius="$2"
                                        gap="$2"
                                      >
                                        <Text fontWeight="bold">{question.question_text}</Text>
                                        <Text fontSize="$2" color="$gray10">
                                          {question.question_type === 'MULTIPLE_CHOICE'
                                            ? 'Multiple Choice'
                                            : 'Offene Frage'}
                                        </Text>

                                        {/* Display options for multiple choice questions */}
                                        {question.question_type === 'MULTIPLE_CHOICE' &&
                                          question.options && (
                                            <YStack gap="$1">
                                              <Text fontSize="$2" fontWeight="bold">
                                                Optionen:
                                              </Text>
                                              {question.options.map((option, optIndex) => (
                                                <XStack key={optIndex} gap="$2" alignItems="center">
                                                  {option.is_correct ? (
                                                    <Check color="$green9" />
                                                  ) : (
                                                    <X color="$gray9" />
                                                  )}
                                                  <Text
                                                    fontSize="$2"
                                                    color={
                                                      option.is_correct ? '$green9' : '$gray10'
                                                    }
                                                  >
                                                    {option.option_text}
                                                  </Text>
                                                </XStack>
                                              ))}
                                            </YStack>
                                          )}

                                        {/* Display reference answer for open questions */}
                                        {question.question_type === 'OPEN' && (
                                          <YStack gap="$1">
                                            <Text fontSize="$2" fontWeight="bold">
                                              Referenzantwort:
                                            </Text>
                                            <Text fontSize="$2" color="$green9">
                                              {question.options &&
                                              question.options[0] &&
                                              question.options[0].option_text
                                                ? question.options[0].option_text
                                                : 'Keine Referenzantwort angegeben'}
                                            </Text>
                                          </YStack>
                                        )}
                                      </YStack>
                                    ))}
                                  </YStack>
                                )}

                                {/* Button to add a new quiz question or show quiz form */}
                                <YStack gap="$4" mt="$4">
                                  {showQuizForm ? (
                                    <YStack gap="$4">
                                      <QuizQuestionForm
                                        onSubmitSuccess={(questionData) => {
                                          if (questionData) {
                                            setQuizQuestions([...quizQuestions, questionData])
                                          }
                                          setShowQuizForm(false)
                                        }}
                                        tempQuestion
                                      />
                                      <Button themeShallow onPress={() => setShowQuizForm(false)}>
                                        <Button.Text>Abbrechen</Button.Text>
                                      </Button>
                                    </YStack>
                                  ) : (
                                    <Button
                                      themeShallow
                                      icon={Plus}
                                      onPress={() => setShowQuizForm(true)}
                                    >
                                      <Button.Text>Quiz Frage hinzufügen</Button.Text>
                                    </Button>
                                  )}
                                </YStack>
                              </YStack>
                            </Accordion.Content>
                          </Accordion.Item>
                        </Accordion>
                      </YStack>

                      <Separator />

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

Page.getLayout = (page: React.ReactElement) => <HomeLayout>{page}</HomeLayout>

export default Page
