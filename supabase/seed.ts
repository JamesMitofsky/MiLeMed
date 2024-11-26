// read this: https://snaplet-seed.netlify.app/seed/integrations/supabase

import { createSeedClient } from '@snaplet/seed'

// Fetch a random photo for demonstration purposes (e.g., hero image URLs for lectures/chapters).
// async function fetchRandomPhoto(): Promise<string> {
//   const response = await fetch('https://picsum.photos/200/300')
//   const data = await response.json()
//   return data.urls.small // Adjust this to the photo size you prefer
// }

type LecturesType = {
  chapter_id: number
  content: string
  created_at: string | null
  id: number
  sort_order: number
  title: string
  updated_at: string | null
}

type ChaptersType = {
  created_at: string | null
  description: string | null
  id: number
  mode: 'THEORETICAL' | 'PRACTICAL'
  sort_order: number
  title: string
  updated_at: string | null
}

async function generateFakeChapters(count: number): Promise<ChaptersType[]> {
  const chapters: ChaptersType[] = []
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
  chapters: ChaptersType[],
  lecturesPerChapter: number
): Promise<LecturesType[]> {
  const lectures: LecturesType[] = []
  for (const chapter of chapters) {
    for (let i = 1; i <= lecturesPerChapter; i++) {
      // const randomPhotoUrl = await fetchRandomPhoto()
      lectures.push({
        id: lectures.length + 1,
        chapter_id: chapter.id,
        title: `Lecture ${i} of ${chapter.title}`,
        content: `Content for Lecture ${i} in ${chapter.title}.`,
        sort_order: i,
        created_at: new Date().toISOString(),
        updated_at: null,
      })
    }
  }
  return lectures
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

  // Seed chapters
  await seed.chapters((x) =>
    chapters.map((chapter) => ({
      ...chapter,
      created_at: chapter.created_at || new Date().toISOString(),
      updated_at: chapter.updated_at || null,
    }))
  )

  // Seed lectures
  await seed.lectures((x) =>
    lectures.map((lecture) => ({
      ...lecture,
      created_at: lecture.created_at || new Date().toISOString(),
      updated_at: lecture.updated_at || null,
    }))
  )

  process.exit()
}

run().catch((error) => {
  console.error('Error seeding data:', error)
  process.exit(1)
})
