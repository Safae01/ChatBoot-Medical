import React, { useState } from "react"
import { User, Eye, Phone, Mail, Calendar, MapPin, Search } from "lucide-react"

// Données d'exemple pour les patients
const patientsData = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Paul",
    age: 45,
    sexe: "Masculin",
    telephone: "01.23.45.67.89",
    email: "paul.dupont@email.com",
    adresse: "123 Rue de la Paix, Paris",
    dernierRdv: "10/01/2024",
    prochainRdv: "15/01/2024",
    medecin: "Dr. Martin"
  },
  {
    id: 2,
    nom: "Moreau",
    prenom: "Julie",
    age: 32,
    sexe: "Féminin",
    telephone: "01.23.45.67.90",
    email: "julie.moreau@email.com",
    adresse: "456 Avenue des Champs, Lyon",
    dernierRdv: "08/01/2024",
    prochainRdv: "15/01/2024",
    medecin: "Dr. Dubois"
  },
  {
    id: 3,
    nom: "Petit",
    prenom: "Marc",
    age: 58,
    sexe: "Masculin",
    telephone: "01.23.45.67.91",
    email: "marc.petit@email.com",
    adresse: "789 Boulevard Saint-Michel, Marseille",
    dernierRdv: "05/01/2024",
    prochainRdv: "16/01/2024",
    medecin: "Dr. Leroy"
  },
  {
    id: 4,
    nom: "Bernard",
    prenom: "Sophie",
    age: 28,
    sexe: "Féminin",
    telephone: "01.23.45.67.92",
    email: "sophie.bernard@email.com",
    adresse: "321 Rue Victor Hugo, Toulouse",
    dernierRdv: "20/12/2023",
    prochainRdv: null,
    medecin: "Dr. Moreau"
  },
  {
    id: 5,
    nom: "Durand",
    prenom: "Pierre",
    age: 67,
    sexe: "Masculin",
    telephone: "01.23.45.67.93",
    email: "pierre.durand@email.com",
    adresse: "654 Place de la République, Nice",
    dernierRdv: "02/01/2024",
    prochainRdv: "17/01/2024",
    medecin: "Dr. Petit"
  }
]

interface AdminPatientsTabProps {
  onViewDossier: (patient: any) => void
}

export function AdminPatientsTab({ onViewDossier }: AdminPatientsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [medecinFilter, setMedecinFilter] = useState<string>("")

  const filteredPatients = patientsData.filter(patient => {
    const matchesSearch =
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.telephone.includes(searchTerm)

    const matchesMedecin = medecinFilter === "" || patient.medecin === medecinFilter

    return matchesSearch && matchesMedecin
  })

  const uniqueMedecins = Array.from(new Set(patientsData.map(p => p.medecin)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Patients</h2>
          <p className="text-gray-600 mt-1">
            {patientsData.length} patient{patientsData.length > 1 ? 's' : ''} enregistré{patientsData.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={medecinFilter}
            onChange={(e) => setMedecinFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Tous les médecins</option>
            {uniqueMedecins.map(medecin => (
              <option key={medecin} value={medecin}>{medecin}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Patients</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{patientsData.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">RDV à venir</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {patientsData.filter(p => p.prochainRdv).length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Médecins</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {uniqueMedecins.length}
          </p>
        </div>
      </div>

      {/* Liste des patients */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {patient.prenom} {patient.nom}
                  </h3>
                  <p className="text-sm text-gray-600">{patient.age} ans • {patient.sexe}</p>
                </div>
              </div>
              
              <button
                onClick={() => onViewDossier(patient)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Voir le dossier médical"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{patient.telephone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{patient.adresse}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500">Médecin traitant</p>
                  <p className="font-medium text-gray-900">{patient.medecin}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Dernier RDV</p>
                  <p className="font-medium text-gray-900">{patient.dernierRdv}</p>
                </div>
              </div>
              
              {patient.prochainRdv && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Prochain RDV: {patient.prochainRdv}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient trouvé</h3>
          <p className="text-gray-600">
            {searchTerm || medecinFilter
              ? "Essayez de modifier vos critères de recherche"
              : "Aucun patient enregistré pour le moment"
            }
          </p>
        </div>
      )}
    </div>
  )
}
