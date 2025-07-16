"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMedicalChat } from "../hooks/useMedicalChat"
import { QuestionInput } from "../components/QuestionInput"
import { PatientSummary } from "../components/PatientSummary"
import { AppointmentBooking } from "../components/AppointmentBooking"
import type { RendezVous } from "../types/medical"

export default function MedicalChatbot() {
  const [userInput, setUserInput] = useState("")
  const [appointment, setAppointment] = useState<RendezVous | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)

  const handleQuestionnaireComplete = () => {
    setShowAppointmentForm(true)
  }

  const {
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
  } = useMedicalChat(handleQuestionnaireComplete)



  const handleSendMessage = () => {
    if (userInput.trim()) {
      addMessage(userInput, false)
      handleUserMessage(userInput)

      // Afficher le formulaire de rendez-vous dans le chatbot pour patient existant
      if (awaitingPatientFirstName) {
        // Après avoir saisi le prénom pour patient existant
        setTimeout(() => {
          setShowAppointmentForm(true)
        }, 1000)
      }

      setUserInput("")
    }
  }

  const handleBookAppointment = (newAppointment: RendezVous) => {
    setAppointment(newAppointment)

    // Import des données médicales pour afficher les détails
    import("../data/medical-data").then(({ getSpecialiteById, getMedecinById }) => {
      const specialite = newAppointment.specialiteId ? getSpecialiteById(newAppointment.specialiteId) : null
      const medecin = newAppointment.medecinId ? getMedecinById(newAppointment.medecinId) : null

      let confirmationMessage = `Parfait ! Votre rendez-vous est confirmé pour le ${new Date(newAppointment.date).toLocaleDateString("fr-FR")} à ${newAppointment.heure}`

      if (specialite && medecin) {
        confirmationMessage += ` en ${specialite.nom} avec Dr. ${medecin.prenom} ${medecin.nom}.`
      } else {
        confirmationMessage += `.`
      }

      addMessage(confirmationMessage, true)
    })
  }

  const getProgressPercentage = () => {
    const totalQuestions = 14
    const answeredQuestions = Object.keys(patientData).length
    return Math.min((answeredQuestions / totalQuestions) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      {/* Bouton flottant pour ouvrir le chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogTrigger asChild>
            <button
              aria-label="Ouvrir le chatbot"
              className="p-0 m-0 border-none bg-transparent shadow-none focus:outline-none focus:ring-0 animate-bounce"
              style={{ boxShadow: 'none', background: 'transparent' }}
            >
              <img
                src="/robot.png"
                alt="Chatbot Robot"
                className="w-20 h-20 object-contain"
                draggable="false"
              />
            </button>
          </DialogTrigger>
      {/* Animation bounce si non présente dans Tailwind ou le projet */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite;
        }
      `}</style>
          <DialogContent className="max-w-2xl p-0 overflow-hidden">
            <div className="flex flex-col h-[80vh] w-full">
              {/* Header du chatbot */}
              <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-2">
                <img
                  src="/robot.png"
                  alt="Chatbot Robot"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-semibold text-lg">Assistant Médical</span>
              </div>

              {/* Contenu des messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"}`}>
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Formulaire de RDV si déclenché */}
                {showAppointmentForm && !appointment && (
                  <div className="mt-4">
                    <AppointmentBooking onBookAppointment={handleBookAppointment} />
                  </div>
                )}
              </div>

              {/* Zone de réponse utilisateur */}
              <div className="border-t bg-gray-50 px-6 py-4">
                {currentQuestion ? (
                  <QuestionInput question={currentQuestion} onAnswer={handleAnswer} />
                ) : awaitingDossierResponse ? (
                  <div className="flex w-full space-x-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Répondez par 'oui' ou 'non'..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                ) : awaitingPatientName ? (
                  <div className="flex w-full space-x-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Entrez votre nom de famille..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                ) : awaitingPatientFirstName ? (
                  <div className="flex w-full space-x-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Entrez votre prénom..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                ) : !isStarted ? (
                  <div className="flex w-full space-x-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Tapez 'oui' pour commencer..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center gap-2">
                    <p className="text-gray-500">Questionnaire terminé ! Ne quittez pas avant de prendre votre rendez-vous</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Section avec résumé */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <PatientSummary patientData={patientData} />
        </div>
      </div>
    </div>
  )
}
