"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, User, Stethoscope } from "lucide-react"
import type { RendezVous } from "../types/medical"
import { SPECIALITES, getMedecinsBySpecialite, getSpecialiteById, getMedecinById } from "../data/medical-data"

interface AppointmentBookingProps {
  onBookAppointment: (appointment: RendezVous) => void
}

export function AppointmentBooking({ onBookAppointment }: AppointmentBookingProps) {
  const [selectedSpecialite, setSelectedSpecialite] = useState<number | null>(null)
  const [selectedMedecin, setSelectedMedecin] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [motif, setMotif] = useState("Consultation suite au questionnaire médical")
  const [isBooked, setIsBooked] = useState(false)

  const availableTimes = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedSpecialite && selectedMedecin) {
      const appointment: RendezVous = {
        date: selectedDate,
        heure: selectedTime,
        motif,
        confirme: true,
        specialiteId: selectedSpecialite,
        medecinId: selectedMedecin,
      }
      onBookAppointment(appointment)
      setIsBooked(true)
    }
  }

  const handleSpecialiteChange = (value: string) => {
    const specialiteId = parseInt(value)
    setSelectedSpecialite(specialiteId)
    setSelectedMedecin(null) // Reset médecin selection when specialité changes
  }

  const availableMedecins = selectedSpecialite ? getMedecinsBySpecialite(selectedSpecialite) : []

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (isBooked) {
    const specialite = selectedSpecialite ? getSpecialiteById(selectedSpecialite) : null
    const medecin = selectedMedecin ? getMedecinById(selectedMedecin) : null

    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Rendez-vous confirmé !</h3>
          <div className="text-green-700 space-y-1">
            <p>📅 Le {new Date(selectedDate).toLocaleDateString("fr-FR")} à {selectedTime}</p>
            <p>🏥 Spécialité: {specialite?.nom}</p>
            <p>👨‍⚕️ Médecin: Dr. {medecin?.prenom} {medecin?.nom}</p>
          </div>
          <p className="text-sm text-green-600 mt-2">Vous recevrez une confirmation par email/SMS</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <Calendar className="w-5 h-5" />
          Prise de Rendez-vous
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Spécialité médicale
          </label>
          <Select onValueChange={handleSpecialiteChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choisissez une spécialité" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALITES.map((specialite) => (
                <SelectItem key={specialite.id} value={specialite.id.toString()}>
                  {specialite.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSpecialite && (
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Médecin
            </label>
            <Select onValueChange={(value) => setSelectedMedecin(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un médecin" />
              </SelectTrigger>
              <SelectContent>
                {availableMedecins.map((medecin) => (
                  <SelectItem key={medecin.id} value={medecin.id.toString()}>
                    Dr. {medecin.prenom} {medecin.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedMedecin && (
          <div>
            <label className="block text-sm font-medium mb-2">Date souhaitée</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
            />
          </div>
        )}

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium mb-2">Heure disponible</label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Motif de consultation</label>
          <Input value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Motif de la consultation" />
        </div>

        <Button
          onClick={handleBooking}
          disabled={!selectedSpecialite || !selectedMedecin || !selectedDate || !selectedTime}
          className="w-full"
        >
          <Clock className="w-4 h-4 mr-2" />
          Confirmer le rendez-vous
        </Button>
      </CardContent>
    </Card>
  )
}
