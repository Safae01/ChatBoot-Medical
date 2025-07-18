import React, { useState } from "react"
import { Plus, Edit, Trash2, Mail, Phone, User } from "lucide-react"
import { useMedecins } from "../../hooks/useMedecins"
import { Medecin } from "../../data/medical-data"

interface MedecinsTabProps {
  onAddMedecin: () => void
  onEditMedecin: (medecin: Medecin) => void
  onDeleteMedecin: (medecin: Medecin) => void
}

export function MedecinsTab({ onAddMedecin, onEditMedecin, onDeleteMedecin }: MedecinsTabProps) {
  const { medecins, getSpecialiteName, loading } = useMedecins()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialite, setSelectedSpecialite] = useState<number | null>(null)

  const filteredMedecins = medecins.filter(medecin => {
    const matchesSearch = 
      medecin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medecin.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medecin.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialite = selectedSpecialite === null || medecin.specialiteId === selectedSpecialite
    
    return matchesSearch && matchesSpecialite
  })

  const specialites = Array.from(new Set(medecins.map(m => m.specialiteId)))
    .map(id => ({ id, nom: getSpecialiteName(id) }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Médecins</h2>
          <p className="text-gray-600 mt-1">
            {medecins.length} médecin{medecins.length > 1 ? 's' : ''} enregistré{medecins.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onAddMedecin}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un médecin</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedSpecialite || ""}
          onChange={(e) => setSelectedSpecialite(e.target.value ? Number(e.target.value) : null)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">Toutes les spécialités</option>
          {specialites.map(specialite => (
            <option key={specialite.id} value={specialite.id}>
              {specialite.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des médecins */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMedecins.map((medecin) => (
          <div key={medecin.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Dr. {medecin.prenom} {medecin.nom}
                  </h3>
                  <p className="text-sm text-gray-600">{getSpecialiteName(medecin.specialiteId)}</p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => onEditMedecin(medecin)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteMedecin(medecin)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{medecin.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{medecin.telephone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedecins.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun médecin trouvé</h3>
          <p className="text-gray-600">
            {searchTerm || selectedSpecialite 
              ? "Essayez de modifier vos critères de recherche"
              : "Commencez par ajouter votre premier médecin"
            }
          </p>
        </div>
      )}
    </div>
  )
}
