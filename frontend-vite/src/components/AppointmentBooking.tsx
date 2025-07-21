import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { SPECIALITES, MEDECINS, getMedecinsBySpecialite } from "../data/medical-data"
import type { RendezVous } from "../types/medical"

interface AppointmentBookingProps {
  onBookAppointment: (appointment: RendezVous) => void
}

export function AppointmentBooking({ onBookAppointment }: AppointmentBookingProps) {
  const [selectedSpecialite, setSelectedSpecialite] = useState<number | null>(null)
  const [selectedMedecin, setSelectedMedecin] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [motif, setMotif] = useState("")

  const availableMedecins = selectedSpecialite ? getMedecinsBySpecialite(selectedSpecialite) : []

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTime || !motif) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const appointment: RendezVous = {
      date: selectedDate,
      heure: selectedTime,
      motif,
      confirme: true,
      specialiteId: selectedSpecialite || undefined,
      medecinId: selectedMedecin || undefined
    }

    onBookAppointment(appointment)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">🗓️ Prendre Rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Spécialité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spécialité (optionnel)
            </label>
            <select
              value={selectedSpecialite || ""}
              onChange={(e) => {
                setSelectedSpecialite(e.target.value ? Number(e.target.value) : null)
                setSelectedMedecin(null)
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Consultation générale</option>
              {SPECIALITES.map((specialite) => (
                <option key={specialite.id} value={specialite.id}>
                  {specialite.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Médecin */}
          {selectedSpecialite && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médecin (optionnel)
              </label>
              <select
                value={selectedMedecin || ""}
                onChange={(e) => setSelectedMedecin(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Aucune préférence</option>
                {availableMedecins.map((medecin) => (
                  <option key={medecin.id} value={medecin.id}>
                    Dr. {medecin.prenom} {medecin.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {/* Submit */}
          <Button type="submit" className="w-full">
            Confirmer le rendez-vous
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
