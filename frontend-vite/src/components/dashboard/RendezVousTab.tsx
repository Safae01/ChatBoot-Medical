import React from "react"

interface RendezVous {
  id: number
  patient: string
  date: string
  heure: string
  statut: string
  motif: string
}

interface RendezVousTabProps {
  rendezVous: RendezVous[]
  onViewDossier: (rdv: RendezVous) => void
}

export function RendezVousTab({ rendezVous, onViewDossier }: RendezVousTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Liste des Rendez-vous</h2>
      {rendezVous.map((rdv) => (
        <div key={rdv.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-semibold text-lg">{rdv.patient}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  rdv.statut === "Confirmé" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {rdv.statut}
                </span>
              </div>
              <p className="text-gray-600">📅 {rdv.date} à {rdv.heure}</p>
              <p className="text-gray-600">🏥 {rdv.motif}</p>
            </div>
            <button 
              onClick={() => onViewDossier(rdv)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              👁️ Voir dossier
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
