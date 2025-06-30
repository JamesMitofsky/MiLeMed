// utils/supabase/quizQuestions.ts

import { QuizQuestionFormData } from '../../../features/lectures/QuizQuestionForm'

export const addQuizQuestion = async (
  supabase, // Accept supabase as a parameter here
  lectureId: number,
  questionData: QuizQuestionFormData
) => {
  console.log('Adding quiz question:', questionData)

  try {
    // 1. Insert question first
    const { data: question, error: questionError } = await supabase
      .from('quiz_questions')
      .insert([
        {
          lecture_id: lectureId,
          question_text: questionData.question_text,
          question_type: questionData.question_type === 'OPEN' ? 'OPEN' : 'MULTIPLE_CHOICE',
        },
      ])
      .select()
      .single()

    if (questionError) throw new Error(`Error inserting quiz question: ${questionError.message}`)
    if (!question) throw new Error('No question data returned after insertion')

    console.log('Created question with ID:', question.id)

    // 2. Insert options if the question has any
    if (questionData.options && questionData.options.length > 0) {
      // First insert all options without is_correct field
      const optionsForInsert = questionData.options.map((option) => ({
        question_id: question.id,
        option_text: option.option_text,
      }))

      const { data: insertedOptions, error: optionsError } = await supabase
        .from('quiz_options') // Using the correct table name
        .insert(optionsForInsert)
        .select()

      if (optionsError) throw new Error(`Error inserting options: ${optionsError.message}`)
      if (!insertedOptions) throw new Error('No options data returned after insertion')

      console.log('Inserted options:', insertedOptions)

      // 3. Handle reference answers based on question type
      if (questionData.question_type === 'MULTIPLE_CHOICE') {
        // For multiple choice, create reference answers for correct options
        // We need to map each original option to its inserted option ID
        for (let i = 0; i < questionData.options.length; i++) {
          const originalOption = questionData.options[i]
          const insertedOption = insertedOptions[i]

          if (!insertedOption) {
            console.error(`Could not find inserted option at index ${i}`)
            continue
          }

          // Only create reference answers for the options marked as correct
          if (originalOption.is_correct) {
            const { error } = await supabase.from('quiz_reference_answers').insert({
              question_id: question.id,
              answer_type: 'OPTION',
              option_id: insertedOption.id,
              answer_text: null,
            })

            if (error) {
              console.error(
                `Error creating reference answer for option ${insertedOption.id}:`,
                error
              )
            }
          }
        }

        console.log('Added reference answers for correct options')
      } else if (questionData.question_type === 'OPEN' && questionData.options[0]) {
        // For open questions, add the reference answer text
        const { error: refAnswerError } = await supabase.from('quiz_reference_answers').insert({
          question_id: question.id,
          answer_type: 'TEXT',
          option_id: null,
          answer_text: questionData.options[0].option_text,
        })

        if (refAnswerError)
          throw new Error(`Error inserting reference answer: ${refAnswerError.message}`)
        console.log('Added reference answer for open question')
      }
    }

    return question
  } catch (err) {
    console.error('Error in addQuizQuestion:', err)
    throw err
  }
}
