import React from "react"
import { X, AlertTriangle } from "lucide-react"
import { useMedecins } from "../../hooks/useMedecins"
import { Medecin } from "../../data/medical-data"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  medecin: Medecin | null
}

export function ConfirmDeleteModal({ isOpen, onClose, onSuccess, medecin }: ConfirmDeleteModalProps) {
  const { deleteMedecin, loading, getSpecialiteName } = useMedecins()

  const handleDelete = async () => {
    if (!medecin) return

    try {
      await deleteMedecin(medecin.id)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  if (!isOpen || !medecin) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirmer la suppression
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Supprimer le médecin ?
              </h3>
              <p className="text-sm text-gray-600">
                Cette action est irréversible
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-medium text-sm">
                  {medecin.prenom[0]}{medecin.nom[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Dr. {medecin.prenom} {medecin.nom}
                </p>
                <p className="text-sm text-gray-600">
                  {getSpecialiteName(medecin.specialiteId)}
                </p>
                <p className="text-sm text-gray-500">
                  {medecin.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Attention
                </p>
                <p className="text-sm text-yellow-700">
                  La suppression de ce médecin pourrait affecter les rendez-vous et dossiers associés.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
