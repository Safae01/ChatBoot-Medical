import React, { useState } from "react"

interface Patient {
  id: number
  nom: string
  age: number
  email: string
  telephone: string
}

interface PatientsTabProps {
  patients: Patient[]
  onViewDossier: (patient: Patient) => void
}

export function PatientsTab({ patients, onViewDossier }: PatientsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liste des Patients</h2>
        <input 
          type="text" 
          placeholder="🔍 Rechercher un patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{patient.nom}</h3>
              <p className="text-gray-600">👤 {patient.age} ans</p>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-gray-600">📧 {patient.email}</p>
              <p className="text-sm text-gray-600">📞 {patient.telephone}</p>
            </div>
            <button 
              onClick={() => onViewDossier(patient)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              👁️ Voir dossier
            </button>
          </div>
        ))}
      </div>
      
      {filteredPatients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun patient trouvé pour "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}
