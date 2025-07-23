import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import type { RendezVous } from "../types/medical"
import { rendezVousService } from "../services/api"

interface AppointmentBookingProps {
  onBookAppointment: (appointment: RendezVous) => void
  patientData?: any // Pour récupérer les données du chatbot
}

export function AppointmentBooking({ onBookAppointment, patientData }: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [motif, setMotif] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false) // Éviter la double soumission

  // Récupérer la spécialité et médecin depuis les données du chatbot
  const selectedSpecialite = patientData?.specialite
  const selectedMedecinId = patientData?.medecin_id

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    // Éviter la double soumission
    if (isSubmitting || hasSubmitted) {
      console.log('Soumission déjà en cours ou terminée, ignorée')
      return
    }

    if (!selectedDate || !selectedTime || !motif) {
      setSubmitError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)
    setHasSubmitted(true)

    try {
      // Créer l'objet rendez-vous pour l'affichage local
      const appointment: RendezVous = {
        date: selectedDate,
        heure: selectedTime,
        motif,
        confirme: true,
        specialiteId: selectedSpecialite ? Number(selectedSpecialite) : undefined,
        medecinId: selectedMedecinId ? Number(selectedMedecinId) : undefined
      }

      // Sauvegarder en base de données via ApiPlatform
      await rendezVousService.createRendezVous(appointment, patientData)

      setSubmitSuccess(true)

      // Appeler le callback parent pour l'affichage
      onBookAppointment(appointment)

    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error)
      setSubmitError(error.message || 'Erreur lors de la création du rendez-vous')
      setHasSubmitted(false) // Permettre une nouvelle tentative en cas d'erreur
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">🗓️ Prendre Rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Heure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-sm"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif de consultation *
            </label>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Décrivez brièvement le motif de votre consultation..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Messages d'erreur et de succès */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">❌ {submitError}</p>
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">✅ Rendez-vous créé et sauvegardé avec succès !</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || hasSubmitted}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Création en cours...
              </div>
            ) : hasSubmitted ? (
              '✅ Rendez-vous créé'
            ) : (
              'Confirmer le rendez-vous'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
