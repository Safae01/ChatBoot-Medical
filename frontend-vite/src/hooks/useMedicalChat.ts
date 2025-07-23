import { useState, useCallback } from "react"
import type { ChatMessage, PatientData, Question } from "../types/medical"
import { MEDICAL_QUESTIONS, WELCOME_MESSAGE, COMPLETION_MESSAGE } from "../data/questions"
import { validateInput } from "../utils/validation"
import { chatbotService } from "../services/api"

export function useMedicalChat(onQuestionnaireComplete?: () => void) {
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
  const [isSavingToBackend, setIsSavingToBackend] = useState(false)
  const [backendSaveError, setBackendSaveError] = useState<string | null>(null)
  const [backendSaveSuccess, setBackendSaveSuccess] = useState(false)

  const addMessage = useCallback((text: string, isBot: boolean) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID unique avec timestamp + random
      text,
      isBot,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  // Fonction pour sauvegarder les données au backend
  const saveToBackend = useCallback(async (data: Partial<PatientData>) => {
    setIsSavingToBackend(true)
    setBackendSaveError(null)
    setBackendSaveSuccess(false)

    try {
      console.log('Sauvegarde des données patient au backend:', data)
      const response = await chatbotService.savePatientData(data)

      setBackendSaveSuccess(true)
      addMessage(`✅ Vos données ont été sauvegardées avec succès ! Patient ID: ${response.patient_id}`, true)

      // Sauvegarder le patient_id dans patientData pour l'utiliser dans le formulaire de RDV
      setPatientData(prev => ({
        ...prev,
        patient_id: response.patient_id
      }))

      console.log('Données sauvegardées avec succès:', response)
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      setBackendSaveError(error.message)
      addMessage(`❌ Erreur lors de la sauvegarde: ${error.message}`, true)
    } finally {
      setIsSavingToBackend(false)
    }
  }, [addMessage])

  // Ajout d'un mode "pré-question" pour le choix dossier médical
  const [awaitingDossierResponse, setAwaitingDossierResponse] = useState(true)
  // États pour la collecte d'identité des patients existants
  const [awaitingPatientName, setAwaitingPatientName] = useState(false)
  const [awaitingPatientFirstName, setAwaitingPatientFirstName] = useState(false)
  const [existingPatientData, setExistingPatientData] = useState<{nom?: string, prenom?: string}>({})

  const startQuestionnaire = useCallback(() => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    const firstQuestion = MEDICAL_QUESTIONS[0]
    setCurrentQuestion(firstQuestion)
    addMessage(firstQuestion.text, true)
  }, [addMessage])

  const handleAnswer = useCallback(
    (answer: string | string[] | import("../types/medical").FileData[] | number) => {
      if (!currentQuestion) return

      // Affichage du message utilisateur
      let answerText = ""
      if (Array.isArray(answer) && answer.length > 0 && typeof answer[0] === "object" && 'name' in answer[0]) {
        // C'est un tableau de fichiers
        answerText =` 📎 ${answer.length} fichier(s) envoyé(s)`
      } else if (typeof answer === "number") {
        // C'est un ID de médecin, on affiche juste l'ID pour l'instant
        answerText = `Médecin sélectionné (ID: ${answer})`
      } else {
        answerText = Array.isArray(answer) ? answer.join(", ") : answer as string
      }
      addMessage(answerText, false)

      // Validation uniquement pour les réponses texte ou choix
      let isValid = true
      let errorMsg = ""
      if (!(Array.isArray(answer) && answer.length > 0 && typeof answer[0] === "object" && 'name' in answer[0])) {
        // Pas de validation pour les questions de spécialité et médecin (gérées par les composants)
        if (currentQuestion.id !== "specialite" && currentQuestion.id !== "medecin_id") {
          const validation = validateInput(currentQuestion.id, answer as string | string[])
          isValid = validation.isValid
          errorMsg = validation.error || ""
        }
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

          // Sauvegarder les données au backend
          setTimeout(async () => {
            // Récupérer les données actuelles avec la dernière réponse
            setPatientData((currentData) => {
              const finalData = {
                ...currentData,
                [currentQuestion.id]: answer,
              }

              // Sauvegarder au backend
              saveToBackend(finalData)

              return finalData
            })

            // Déclencher l'affichage du formulaire de rendez-vous après la sauvegarde
            setTimeout(() => {
              onQuestionnaireComplete?.()
            }, 2000) // Délai plus long pour laisser le temps à la sauvegarde
          }, 1000)
        }, 1000)
      }
    },
    [currentQuestion, currentQuestionIndex, addMessage, saveToBackend, onQuestionnaireComplete],
  )

  const handleUserMessage = useCallback(
    (message: string) => {
      if (awaitingDossierResponse) {
        if (message.toLowerCase().includes("oui")) {
          // Demander le nom du patient existant
          setAwaitingDossierResponse(false)
          setAwaitingPatientName(true)
          setTimeout(() => {
            addMessage("Parfait ! Pour retrouver votre dossier, quel est votre nom de famille ?", true)
          }, 500)
        } else if (message.toLowerCase().includes("non")) {
          setAwaitingDossierResponse(false)
          startQuestionnaire()
        } else {
          addMessage("Merci de répondre par 'oui' ou 'non'.", true)
        }
        return
      }

      if (awaitingPatientName) {
        // Sauvegarder le nom et demander le prénom
        setExistingPatientData(prev => ({ ...prev, nom: message.trim() }))
        setAwaitingPatientName(false)
        setAwaitingPatientFirstName(true)
        setTimeout(() => {
          addMessage("Et votre prénom ?", true)
        }, 500)
        return
      }

      if (awaitingPatientFirstName) {
        // Sauvegarder le prénom et aller aux rendez-vous
        setExistingPatientData(prev => ({ ...prev, prenom: message.trim() }))
        setAwaitingPatientFirstName(false)
        setIsStarted(false)
        setCurrentQuestion(null)
        setIsCompleted(true)
        setTimeout(() => {
          addMessage(`Merci ${existingPatientData.nom} ${message.trim()} ! Je vais maintenant vous afficher vos rendez-vous disponibles.`, true)
        }, 500)
        return
      }

      if (!isStarted) {
        addMessage("Parfait ! Dites-moi quand vous êtes prêt à commencer.", true)
      }
    },
    [isStarted, startQuestionnaire, addMessage, awaitingDossierResponse, awaitingPatientName, awaitingPatientFirstName, existingPatientData],
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
    awaitingPatientName,
    awaitingPatientFirstName,
    existingPatientData,
    isSavingToBackend,
    backendSaveError,
    backendSaveSuccess,
  }
}
