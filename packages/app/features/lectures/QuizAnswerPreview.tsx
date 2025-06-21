import { YStack, XStack, Button, Text, TextArea } from '@my/ui'
import React, { useState } from 'react'

interface QuizAnswerPreviewProps {
  lectureId: number | undefined
  questionId: number
  questionType: 'OPEN' | 'MULTIPLE_CHOICE'
  referenceAnswer?: string
  options?: { option_id: number; option_text: string; is_correct: boolean }[]
}

/**
 * Component that lets admins test their quiz questions by simulating student answers
 * and showing validation results
 */
export const QuizAnswerPreview: React.FC<QuizAnswerPreviewProps> = ({
  lectureId,
  questionId,
  questionType,
  referenceAnswer,
  options,
}) => {
  const [testAnswer, setTestAnswer] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])
  const [validationResult, setValidationResult] = useState<{
    isCorrect: boolean
    feedback: string
    matchPercentage?: number
  } | null>(null)

  const handleValidate = () => {
    if (questionType === 'OPEN') {
      // For open questions, validate the text answer
      if (!testAnswer.trim()) {
        setValidationResult({
          isCorrect: false,
          feedback: 'Bitte geben Sie eine Antwort ein.',
        })
        return
      }

      // Create a mock question answer in the format expected by validateAnswer
      const mockQuestionAnswer = {
        question_id: questionId,
        question_type: 'OPEN' as const,
        reference_answer: referenceAnswer,
      }

      // Use the validation logic directly since we have the reference answer
      const referenceAnswerText = referenceAnswer?.toLowerCase() || ''
      const userAnswer = testAnswer.toLowerCase()

      // Check if user answer contains key phrases from reference answer
      const referenceWords = referenceAnswerText.split(/\s+/).filter((w) => w.length > 3)
      const matchingWords = referenceWords.filter((word) => userAnswer.includes(word))

      if (matchingWords.length > 0 && referenceWords.length > 0) {
        const matchPercentage = matchingWords.length / referenceWords.length
        setValidationResult({
          isCorrect: matchPercentage >= 0.5,
          matchPercentage,
          feedback:
            matchPercentage >= 0.5 ? 'Gute Antwort!' : 'Überprüfe deine Antwort noch einmal.',
        })
      } else {
        setValidationResult({
          isCorrect: false,
          matchPercentage: 0,
          feedback: 'Überprüfe deine Antwort noch einmal.',
        })
      }
    } else {
      // For multiple choice questions, validate the selected options
      if (selectedOptions.length === 0) {
        setValidationResult({
          isCorrect: false,
          feedback: 'Bitte wählen Sie mindestens eine Option aus.',
        })
        return
      }

      // Get correct option IDs
      const correctOptionIds = options?.filter((o) => o.is_correct)?.map((o) => o.option_id) || []

      // Check if arrays have the same elements (ignoring order)
      const isCorrect =
        selectedOptions.length === correctOptionIds.length &&
        selectedOptions.every((id) => correctOptionIds.includes(id))

      setValidationResult({
        isCorrect,
        feedback: isCorrect ? 'Richtig!' : 'Nicht ganz richtig. Versuche es noch einmal.',
      })
    }
  }

  const toggleOption = (optionId: number) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId))
    } else {
      setSelectedOptions([...selectedOptions, optionId])
    }
  }

  return (
    <YStack gap="$3" p="$3" borderWidth={1} borderColor="$gray3" borderRadius="$2">
      <Text fontWeight="bold">Antwort-Vorschau</Text>

      {questionType === 'OPEN' ? (
        <>
          <Text fontSize="$2">Geben Sie eine Testantwort ein:</Text>
          <TextArea
            value={testAnswer}
            onChangeText={setTestAnswer}
            height={100}
            placeholder="Testantwort eingeben..."
          />
        </>
      ) : (
        <>
          <Text fontSize="$2">Wählen Sie Optionen aus:</Text>
          <YStack gap="$2">
            {options?.map((option) => (
              <XStack key={option.option_id} gap="$2" alignItems="center">
                <Button
                  size="$2"
                  themeInverse={selectedOptions.includes(option.option_id)}
                  onPress={() => toggleOption(option.option_id)}
                >
                  {selectedOptions.includes(option.option_id) ? '✓' : ''}
                </Button>
                <Text>{option.option_text}</Text>
              </XStack>
            ))}
          </YStack>
        </>
      )}

      <Button onPress={handleValidate} themeInverse>
        Antwort überprüfen
      </Button>

      {validationResult && (
        <YStack
          p="$3"
          borderRadius="$2"
          backgroundColor={validationResult.isCorrect ? '$green2' : '$red2'}
        >
          <Text fontWeight="bold" color={validationResult.isCorrect ? '$green9' : '$red9'}>
            {validationResult.feedback}
          </Text>

          {questionType === 'OPEN' && validationResult.matchPercentage !== undefined && (
            <Text fontSize="$2" color={validationResult.isCorrect ? '$green9' : '$red9'}>
              Übereinstimmung: {Math.round(validationResult.matchPercentage * 100)}%
            </Text>
          )}
        </YStack>
      )}
    </YStack>
  )
}
