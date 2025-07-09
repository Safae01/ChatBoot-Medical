"use client"

import { useState, useCallback } from "react"
import type { ChatMessage, PatientData, Question } from "../types/medical"
import { MEDICAL_QUESTIONS, WELCOME_MESSAGE, COMPLETION_MESSAGE } from "../data/questions"
import { validateInput } from "../utils/validation"

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

  // Ajout d'un mode "pré-question" pour le choix dossier médical
  const [awaitingDossierResponse, setAwaitingDossierResponse] = useState(true)

  const startQuestionnaire = useCallback(() => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    const firstQuestion = MEDICAL_QUESTIONS[0]
    setCurrentQuestion(firstQuestion)
    addMessage(firstQuestion.text, true)
  }, [addMessage])

  const handleAnswer = useCallback(
    (answer: string | string[] | import("../types/medical").FileData[]) => {
      if (!currentQuestion) return

      // Affichage du message utilisateur
      let answerText = ""
      if (Array.isArray(answer) && answer.length > 0 && typeof answer[0] === "object" && 'name' in answer[0]) {
        // C'est un tableau de fichiers
        answerText =` 📎 ${answer.length} fichier(s) envoyé(s)`
      } else {
        answerText = Array.isArray(answer) ? answer.join(", ") : answer as string
      }
      addMessage(answerText, false)

      // Validation uniquement pour les réponses texte ou choix
      let isValid = true
      let errorMsg = ""
      if (!(Array.isArray(answer) && answer.length > 0 && typeof answer[0] === "object" && 'name' in answer[0])) {
        const validation = validateInput(currentQuestion.id, answer as string | string[])
        isValid = validation.isValid
        errorMsg = validation.error || ""
      }
      if (!isValid) {
        addMessage(`❌ ${errorMsg}`, true)
        return // ❌ Bloque si invalide
      }
      // Sauvegarder la réponse (texte, tableau ou fichiers)
      setPatientData((prev) => {
        // Si c'est un upload de fichiers, on cumule les fichiers précédents
        if (Array.isArray(answer) && answer.length > 0 && typeof answer[0] === "object" && 'name' in answer[0]) {
          // @ts-ignore accès dynamique
          const prevFiles = Array.isArray((prev as any)[currentQuestion.id]) ? ((prev as any)[currentQuestion.id] as any[]) : []
          // On évite les doublons par nom de fichier
          const allFiles = [...prevFiles, ...answer].filter((file, idx, arr) =>
            arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
          )
          return {
            ...prev,
            [currentQuestion.id]: allFiles,
          }
        }
        // Sinon, comportement normal
        return {
          ...prev,
          [currentQuestion.id]: answer,
        }
      })

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
      if (awaitingDossierResponse) {
        if (message.toLowerCase().includes("oui")) {
          // Aller directement à la prise de rendez-vous
          setIsStarted(false)
          setCurrentQuestion(null)
          setIsCompleted(true)
          setAwaitingDossierResponse(false)
          setTimeout(() => {
            addMessage("Très bien, nous allons directement prendre rendez-vous.", true)
          }, 500)
        } else if (message.toLowerCase().includes("non")) {
          setAwaitingDossierResponse(false)
          startQuestionnaire()
        } else {
          addMessage("Merci de répondre par 'oui' ou 'non'.", true)
        }
        return
      }
      if (!isStarted) {
        addMessage("Parfait ! Dites-moi quand vous êtes prêt à commencer.", true)
      }
    },
    [isStarted, startQuestionnaire, addMessage, awaitingDossierResponse],
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
    awaitingDossierResponse,
  }
}