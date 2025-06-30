// utils/supabase/updateQuizQuestion.ts

import {
  QuizQuestionFormData,
  QuizQuestionOption,
} from '../../../features/lectures/QuizQuestionForm'

// Define interfaces for our update operations
interface OptionUpdate {
  id: number
  optionData: QuizQuestionOption
}

interface OptionInsert {
  question_id: number
  option_text: string
}

interface ReferenceAnswer {
  question_id: number
  answer_type: string
  option_id: number | null
  answer_text: string | null
}

interface DbOption {
  id: number
  question_id: number
  option_text: string
}

export const updateQuizQuestion = async (
  supabase,
  questionId: number,
  questionData: QuizQuestionFormData
) => {
  console.log('Updating question ID:', questionId)
  console.log('With data:', questionData)

  try {
    // 1. Update the quiz question text and type
    const { data: updatedQuestion, error: updateError } = await supabase
      .from('quiz_questions')
      .update({
        question_text: questionData.question_text,
        question_type: questionData.question_type === 'OPEN' ? 'OPEN' : 'MULTIPLE_CHOICE',
      })
      .eq('id', questionId)
      .select()

    if (updateError) throw new Error(`Error updating question: ${updateError.message}`)
    console.log('Updated question:', updatedQuestion)

    // 2. Handle options - first get existing options
    const { data: existingOptions, error: getOptionsError } = await supabase
      .from('quiz_options')
      .select('id, option_text')
      .eq('question_id', questionId)

    if (getOptionsError)
      throw new Error(`Error fetching existing options: ${getOptionsError.message}`)
    console.log('Existing options:', existingOptions)

    // Process each option in the form data
    if (questionData.options && questionData.options.length > 0) {
      const optionUpdates: OptionUpdate[] = []
      const optionInserts: OptionInsert[] = []

      // Determine which options to update vs. insert
      // We're assuming options don't have IDs in the form, so we match by text
      questionData.options.forEach((option) => {
        const existingOption = existingOptions?.find((eo) => eo.option_text === option.option_text)

        if (existingOption) {
          // Option exists, no need to update since text matches
          optionUpdates.push({
            id: existingOption.id,
            optionData: option,
          })
        } else {
          // New option to insert
          optionInserts.push({
            question_id: questionId,
            option_text: option.option_text,
          })
        }
      })

      console.log('Option updates:', optionUpdates)
      console.log('Option inserts:', optionInserts)

      // Insert new options if any
      let insertedOptions: DbOption[] = []
      if (optionInserts.length > 0) {
        const { data, error } = await supabase.from('quiz_options').insert(optionInserts).select()

        if (error) throw new Error(`Error inserting new options: ${error.message}`)
        insertedOptions = data || []
        console.log('Inserted new options:', insertedOptions)
      }

      // Delete options that are no longer in the form
      const optionTextsInForm = questionData.options.map((o) => o.option_text)
      const optionsToDelete =
        existingOptions?.filter((o) => !optionTextsInForm.includes(o.option_text)) || []

      if (optionsToDelete.length > 0) {
        const optionIdsToDelete = optionsToDelete.map((o) => o.id)
        console.log('Deleting options with IDs:', optionIdsToDelete)

        const { error } = await supabase.from('quiz_options').delete().in('id', optionIdsToDelete)

        if (error) throw new Error(`Error deleting obsolete options: ${error.message}`)
        console.log('Deleted obsolete options')
      }

      // 3. Handle reference answers - delete existing and add new ones
      // First delete existing reference answers for this question
      const { error: deleteRefError } = await supabase
        .from('quiz_reference_answers')
        .delete()
        .eq('question_id', questionId)

      if (deleteRefError)
        throw new Error(`Error deleting existing reference answers: ${deleteRefError.message}`)
      console.log('Deleted existing reference answers for question')

      // Now add new reference answers
      if (questionData.question_type === 'MULTIPLE_CHOICE') {
        // For multiple choice, create reference answers for correct options
        const correctOptions: ReferenceAnswer[] = []

        // Process existing options
        optionUpdates.forEach(({ id, optionData }) => {
          if (optionData.is_correct) {
            correctOptions.push({
              question_id: questionId,
              answer_type: 'OPTION',
              option_id: id,
              answer_text: null,
            })
          }
        })

        // Process newly inserted options
        insertedOptions.forEach((option) => {
          const correctOption = questionData.options.find(
            (o) => o.option_text === option.option_text
          )
          if (correctOption && correctOption.is_correct) {
            correctOptions.push({
              question_id: questionId,
              answer_type: 'OPTION',
              option_id: option.id,
              answer_text: null,
            })
          }
        })

        console.log('Adding reference answers for correct options:', correctOptions)

        if (correctOptions.length > 0) {
          const { error: refInsertError } = await supabase
            .from('quiz_reference_answers')
            .insert(correctOptions)

          if (refInsertError)
            throw new Error(`Error inserting reference answers: ${refInsertError.message}`)
          console.log('Added reference answers for correct options')
        }
      } else if (questionData.question_type === 'OPEN') {
        // For open questions, create text-based reference answers
        // This could be implemented later if needed
        console.log('Open-ended question - no reference answers needed')
      }
    }

    return { success: true, message: 'Quiz question updated successfully' }
  } catch (error) {
    console.error('Error updating quiz question:', error)
    return { success: false, message: error instanceof Error ? error.message : String(error) }
  }
}
