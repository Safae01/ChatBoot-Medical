import React, { useState } from "react"
import { X, User, Mail, Phone, Stethoscope } from "lucide-react"
import { useMedecins, NewMedecin } from "../../hooks/useMedecins"
import { Medecin } from "../../data/medical-data"

interface AddMedecinModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingMedecin?: Medecin | null
}

export function AddMedecinModal({ isOpen, onClose, onSuccess, editingMedecin }: AddMedecinModalProps) {
  const { addMedecin, updateMedecin, specialites, loading } = useMedecins()
  
  const [formData, setFormData] = useState<NewMedecin>({
    nom: editingMedecin?.nom || "",
    prenom: editingMedecin?.prenom || "",
    email: editingMedecin?.email || "",
    telephone: editingMedecin?.telephone || "",
    specialiteId: editingMedecin?.specialiteId || specialites[0]?.id || 1
  })
  
  const [errors, setErrors] = useState<Partial<NewMedecin>>({})

  React.useEffect(() => {
    if (editingMedecin) {
      setFormData({
        nom: editingMedecin.nom,
        prenom: editingMedecin.prenom,
        email: editingMedecin.email,
        telephone: editingMedecin.telephone,
        specialiteId: editingMedecin.specialiteId
      })
    } else {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialiteId: specialites[0]?.id || 1
      })
    }
    setErrors({})
  }, [editingMedecin, specialites, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Partial<NewMedecin> = {}

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis"
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis"
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (editingMedecin) {
        await updateMedecin(editingMedecin.id, formData)
      } else {
        await addMedecin(formData)
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleChange = (field: keyof NewMedecin, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingMedecin ? "Modifier le médecin" : "Ajouter un médecin"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nom *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nom de famille"
              />
              {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.prenom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Prénom"
              />
              {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="email@exemple.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Téléphone *
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.telephone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="01.23.45.67.89"
            />
            {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Stethoscope className="w-4 h-4 inline mr-1" />
              Spécialité *
            </label>
            <select
              value={formData.specialiteId}
              onChange={(e) => handleChange('specialiteId', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {specialites.map(specialite => (
                <option key={specialite.id} value={specialite.id}>
                  {specialite.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : (editingMedecin ? "Modifier" : "Ajouter")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
