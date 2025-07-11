"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Send, User } from "lucide-react"
import { useMedicalChat } from "../hooks/useMedicalChat"
import { QuestionInput } from "../components/QuestionInput"
import { PatientSummary } from "../components/PatientSummary"
import { AppointmentBooking } from "../components/AppointmentBooking"
import type { RendezVous } from "../types/medical"

export default function MedicalChatbot() {
  const {
    messages,
    currentQuestion,
    patientData,
    isCompleted,
    isStarted,
    handleAnswer,
    handleUserMessage,
    addMessage,
  } = useMedicalChat()

  const [userInput, setUserInput] = useState("")
  const [appointment, setAppointment] = useState<RendezVous | null>(null)

  const handleSendMessage = () => {
    if (userInput.trim()) {
      addMessage(userInput, false)
      handleUserMessage(userInput)
      setUserInput("")
    }
  }

  const handleBookAppointment = (newAppointment: RendezVous) => {
    setAppointment(newAppointment)
    addMessage(
      `Parfait ! Votre rendez-vous est confirmé pour le ${new Date(newAppointment.date).toLocaleDateString("fr-FR")} à ${newAppointment.heure}.`,
      true,
    )
  }

  const getProgressPercentage = () => {
    const totalQuestions = 14
    const answeredQuestions = Object.keys(patientData).length
    return Math.min((answeredQuestions / totalQuestions) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interface de Chat */}
        <div className="lg:col-span-2">
          <Card className="h-[85vh] flex flex-col">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Assistant Médical - Questionnaire
              </CardTitle>
              <div className="flex items-center gap-2 text-blue-100">
                <div className="flex-1 bg-blue-500 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <span className="text-sm">{Math.round(getProgressPercentage())}%</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="border-t p-4">
              {currentQuestion ? (
                <QuestionInput question={currentQuestion} onAnswer={handleAnswer} />
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
                <div className="w-full text-center text-gray-500">
                  <p>Questionnaire terminé ! Consultez votre dossier médical ci-contre.</p>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Résumé du patient */}
          <PatientSummary patientData={patientData} />

          {/* Prise de rendez-vous */}
          {isCompleted && !appointment && <AppointmentBooking onBookAppointment={handleBookAppointment} />}

          {/* Confirmation de rendez-vous */}
          {appointment && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Rendez-vous confirmé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString("fr-FR")}
                  </p>
                  <p>
                    <strong>Heure:</strong> {appointment.heure}
                  </p>
                  <p>
                    <strong>Motif:</strong> {appointment.motif}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-800 mb-2">Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Répondez à chaque question avec précision</li>
                <li>• Toutes les informations sont confidentielles</li>
                <li>• Vous pouvez donner des détails supplémentaires</li>
                <li>• Un rendez-vous sera proposé à la fin</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
