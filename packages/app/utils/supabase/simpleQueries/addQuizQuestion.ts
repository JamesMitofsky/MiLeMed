// utils/supabase/quizQuestions.ts

import { QuizQuestionFormData } from '../../../features/lectures/QuizQuestionForm'

export const addQuizQuestion = async (
  supabase, // Accept supabase as a parameter here
  lectureId: number,
  questionData: QuizQuestionFormData
) => {
  // Insert question
  const { data: question, error: questionError } = await supabase
    .from('quiz_questions')
    .insert([
      {
        lecture_id: lectureId,
        question_text: questionData.question_text,
        question_type: questionData.question_type,
      },
    ])
    .select()
    .single()

  if (questionError) throw new Error(questionError.message)

  // Insert options if the question is multiple-choice
  if (questionData.question_type === 'MULTIPLE_CHOICE' && questionData.options.length) {
    const options = questionData.options.map((option) => ({
      question_id: question.id,
      option_text: option.option_text,
      is_correct: option.is_correct,
    }))

    const { error: optionsError } = await supabase.from('quiz_question_options').insert(options)

    if (optionsError) throw new Error(optionsError.message)
  }

  return question
}
