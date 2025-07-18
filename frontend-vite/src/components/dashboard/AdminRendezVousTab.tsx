import React, { useState } from "react"
import { Calendar, Clock, User, Eye } from "lucide-react"

// Données d'exemple pour les rendez-vous
const rendezVousData = [
  {
    id: 1,
    patient: "Paul Dupont",
    medecin: "Dr. Martin",
    date: "15/01/2024",
    heure: "09:00",
    motif: "Consultation cardiologie",
    telephone: "01.23.45.67.89"
  },
  {
    id: 2,
    patient: "Julie Moreau",
    medecin: "Dr. Dubois",
    date: "15/01/2024",
    heure: "10:30",
    motif: "Dermatologie",
    telephone: "01.23.45.67.90"
  },
  {
    id: 3,
    patient: "Marc Petit",
    medecin: "Dr. Leroy",
    date: "16/01/2024",
    heure: "14:00",
    motif: "Neurologie",
    telephone: "01.23.45.67.91"
  },
  {
    id: 4,
    patient: "Sophie Bernard",
    medecin: "Dr. Moreau",
    date: "16/01/2024",
    heure: "15:30",
    motif: "Consultation générale",
    telephone: "01.23.45.67.92"
  },
  {
    id: 5,
    patient: "Pierre Durand",
    medecin: "Dr. Petit",
    date: "17/01/2024",
    heure: "11:00",
    motif: "Suivi neurologique",
    telephone: "01.23.45.67.93"
  }
]

interface AdminRendezVousTabProps {
  onViewDossier: (patient: any) => void
}

export function AdminRendezVousTab({ onViewDossier }: AdminRendezVousTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<string>("")

  const filteredRendezVous = rendezVousData.filter(rdv => {
    const matchesSearch =
      rdv.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.medecin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.motif.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = dateFilter === "" || rdv.date === dateFilter

    return matchesSearch && matchesDate
  })

  const uniqueDates = Array.from(new Set(rendezVousData.map(rdv => rdv.date)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Rendez-vous</h2>
          <p className="text-gray-600 mt-1">
            {rendezVousData.length} rendez-vous au total
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Rechercher par patient, médecin ou motif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Toutes les dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total RDV</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{rendezVousData.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">2</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Cette semaine</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">5</p>
        </div>
      </div>

      {/* Liste des rendez-vous */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRendezVous.map((rdv) => (
                <tr key={rdv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{rdv.patient}</div>
                        <div className="text-sm text-gray-500">{rdv.telephone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rdv.medecin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{rdv.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{rdv.heure}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{rdv.motif}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDossier({
                        id: rdv.id,
                        nom: rdv.patient.split(' ')[1] || rdv.patient,
                        prenom: rdv.patient.split(' ')[0] || rdv.patient,
                        telephone: rdv.telephone,
                        medecin: rdv.medecin
                      })}
                      className="text-red-600 hover:text-red-900 flex items-center space-x-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Dossier médical</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRendezVous.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
          <p className="text-gray-600">
            {searchTerm || dateFilter
              ? "Essayez de modifier vos critères de recherche"
              : "Aucun rendez-vous programmé pour le moment"
            }
          </p>
        </div>
      )}
    </div>
  )
}
