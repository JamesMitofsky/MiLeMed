import { createSeedClient } from '@snaplet/seed'

type ContentLecturesType = {
  chapter_id: number
  content: string
  created_at: string | null
  id: number
  sort_order: number
  title: string
  updated_at: string | null
}

type ContentChaptersType = {
  created_at: string | null
  description: string | null
  id: number
  mode: 'THEORETICAL' | 'PRACTICAL'
  sort_order: number
  title: string
  updated_at: string | null
}

type QuizQuestionsType = {
  created_at: string | null
  id: number
  lecture_id: number
  question_text: string
  question_type: 'OPEN' | 'MULTIPLE_CHOICE'
  updated_at: string | null
}

type QuizOptionsType = {
  id: number
  option_text: string
  question_id: number
}

async function generateFakeChapters(count: number): Promise<ContentChaptersType[]> {
  const chapters: ContentChaptersType[] = []
  for (let i = 1; i <= count; i++) {
    chapters.push({
      id: i,
      title: `Chapter ${i}`,
      description: `Description for Chapter ${i}`,
      mode: i % 2 === 0 ? 'THEORETICAL' : 'PRACTICAL',
      sort_order: i,
      created_at: new Date().toISOString(),
      updated_at: null,
    })
  }
  return chapters
}

async function generateFakeLectures(
  chapters: ContentChaptersType[],
  lecturesPerChapter: number
): Promise<ContentLecturesType[]> {
  const lectures: ContentLecturesType[] = []

  for (const chapter of chapters) {
    for (let i = 1; i <= lecturesPerChapter; i++) {
      const imageUrl = 'https://picsum.photos/200/300'
      const markdownContent = `
**Lecture ${i} of ${chapter.title}**

This is the markdown content for Lecture ${i} in ${chapter.title}.

- **Key Point 1**: Introduction to the topic
- **Key Point 2**: Deep dive into the subject
- **Key Point 3**: Practical examples and case studies

**Lecture Image**
![Lecture Image]( ${imageUrl} )

**Conclusion**
This lecture concludes with a summary of the key points and actionable insights.
      `

      lectures.push({
        id: lectures.length + 1,
        chapter_id: chapter.id,
        title: `Lecture ${i} of ${chapter.title}`,
        content: markdownContent.trim(),
        sort_order: i,
        created_at: new Date().toISOString(),
        updated_at: null,
      })
    }
  }
  return lectures
}

async function generateFakeQuizQuestions(
  lectures: ContentLecturesType[],
  questionsPerLecture: number
): Promise<QuizQuestionsType[]> {
  const quizQuestions: QuizQuestionsType[] = []
  for (const lecture of lectures) {
    for (let i = 1; i <= questionsPerLecture; i++) {
      const isMultipleChoice = i % 2 !== 0 // Alternate between MULTIPLE_CHOICE and OPEN
      quizQuestions.push({
        id: quizQuestions.length + 1,
        lecture_id: lecture.id,
        question_text: `Question ${i} for ${lecture.title}`,
        question_type: isMultipleChoice ? 'MULTIPLE_CHOICE' : 'OPEN',
        created_at: new Date().toISOString(),
        updated_at: null,
      })
    }
  }
  return quizQuestions
}

async function generateFakeQuizQuestionOptions(
  quizQuestions: QuizQuestionsType[],
  optionsPerQuestion: number
): Promise<QuizOptionsType[]> {
  const quizOptions: QuizOptionsType[] = []
  for (const question of quizQuestions) {
    if (question.question_type === 'MULTIPLE_CHOICE') {
      const correctAnswerIndex = Math.floor(Math.random() * optionsPerQuestion) // Ensure one correct answer
      for (let i = 1; i <= optionsPerQuestion; i++) {
        quizOptions.push({
          id: quizOptions.length + 1,
          question_id: question.id,
          option_text: `Option ${i} for ${question.question_text}`,
        })
      }
    } else {
      // For OPEN questions, add a single correct answer as a text-based option
      quizOptions.push({
        id: quizOptions.length + 1,
        question_id: question.id,
        option_text: `The correct long answer for ${question.question_text}`, // Provide a detailed answer
      })
    }
  }
  return quizOptions
}

async function run() {
  const seed = await createSeedClient({
    dryRun: true, // Set to `false` to persist changes to the database
  })

  // Reset the database
  await seed.$resetDatabase()

  // Generate fake data
  const chapters = await generateFakeChapters(5) // Adjust the number of chapters
  const lectures = await generateFakeLectures(chapters, 3) // Adjust the number of lectures per chapter
  const quizQuestions = await generateFakeQuizQuestions(lectures, 2) // Adjust the number of questions per lecture
  const quizQuestionOptions = await generateFakeQuizQuestionOptions(quizQuestions, 4) // Adjust the number of options per question

  // Seed chapters
  await seed.content_chapters((x) =>
    chapters.map((chapter) => ({
      ...chapter,
      created_at: chapter.created_at || new Date().toISOString(),
      updated_at: chapter.updated_at || null,
    }))
  )

  // Seed lectures
  await seed.content_lectures((x) =>
    lectures.map((lecture) => ({
      ...lecture,
      created_at: lecture.created_at || new Date().toISOString(),
      updated_at: lecture.updated_at || null,
    }))
  )

  // Seed quiz questions
  await seed.quiz_questions((x) =>
    quizQuestions.map((question) => ({
      ...question,
      created_at: question.created_at || new Date().toISOString(),
      updated_at: question.updated_at || null,
    }))
  )

  // Seed quiz options
  await seed.quiz_options((x) =>
    quizQuestionOptions.map((option) => ({
      ...option
    }))
  )

  process.exit()
}

run().catch((error) => {
  console.error('Error seeding data:', error)
  process.exit(1)
})
