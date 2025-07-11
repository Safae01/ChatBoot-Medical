"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, CheckCircle } from "lucide-react"
import type { RendezVous } from "../types/medical"

interface AppointmentBookingProps {
  onBookAppointment: (appointment: RendezVous) => void
}

export function AppointmentBooking({ onBookAppointment }: AppointmentBookingProps) {
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
    if (selectedDate && selectedTime) {
      const appointment: RendezVous = {
        date: selectedDate,
        heure: selectedTime,
        motif,
        confirme: true,
      }
      onBookAppointment(appointment)
      setIsBooked(true)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (isBooked) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Rendez-vous confirmé !</h3>
          <p className="text-green-700">
            Le {new Date(selectedDate).toLocaleDateString("fr-FR")} à {selectedTime}
          </p>
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
          <label className="block text-sm font-medium mb-2">Date souhaitée</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getMinDate()}
          />
        </div>

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

        <Button onClick={handleBooking} disabled={!selectedDate || !selectedTime} className="w-full">
          <Clock className="w-4 h-4 mr-2" />
          Confirmer le rendez-vous
        </Button>
      </CardContent>
    </Card>
  )
}
