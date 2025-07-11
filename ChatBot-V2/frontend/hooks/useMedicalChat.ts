"use client"

import { useState, useCallback } from "react"
import type { ChatMessage, PatientData, Question } from "../types/medical"
import { MEDICAL_QUESTIONS, WELCOME_MESSAGE, COMPLETION_MESSAGE } from "../data/questions"

export function useMedicalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: WELCOME_MESSAGE,
      isBot: true,
      timestamp: new Date(),
    },
  ])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [patientData, setPatientData] = useState<Partial<PatientData>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  const addMessage = useCallback((text: string, isBot: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const startQuestionnaire = useCallback(() => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    const firstQuestion = MEDICAL_QUESTIONS[0]
    setCurrentQuestion(firstQuestion)
    addMessage(firstQuestion.text, true)
  }, [addMessage])

  const handleAnswer = useCallback(
    (answer: string | string[]) => {
      if (!currentQuestion) return

      // Ajouter la réponse de l'utilisateur
      const answerText = Array.isArray(answer) ? answer.join(", ") : answer
      addMessage(answerText, false)

      // Sauvegarder la réponse
      setPatientData((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }))

      // Passer à la question suivante
      const nextIndex = currentQuestionIndex + 1

      if (nextIndex < MEDICAL_QUESTIONS.length) {
        setCurrentQuestionIndex(nextIndex)
        const nextQuestion = MEDICAL_QUESTIONS[nextIndex]
        setCurrentQuestion(nextQuestion)

        // Délai pour simuler la réflexion du bot
        setTimeout(() => {
          addMessage(nextQuestion.text, true)
        }, 1000)
      } else {
        // Questionnaire terminé
        setIsCompleted(true)
        setCurrentQuestion(null)
        setTimeout(() => {
          addMessage(COMPLETION_MESSAGE, true)
        }, 1000)
      }
    },
    [currentQuestion, currentQuestionIndex, addMessage],
  )

  const handleUserMessage = useCallback(
    (message: string) => {
      if (!isStarted) {
        if (message.toLowerCase().includes("oui") || message.toLowerCase().includes("commenc")) {
          startQuestionnaire()
        } else {
          addMessage("Parfait ! Dites-moi quand vous êtes prêt à commencer.", true)
        }
      }
    },
    [isStarted, startQuestionnaire, addMessage],
  )

  return {
    messages,
    currentQuestion,
    patientData,
    isCompleted,
    isStarted,
    handleAnswer,
    handleUserMessage,
    addMessage,
  }
}
