import React, { useState, useEffect } from "react"
import { X, MessageSquare, User, Tag } from "lucide-react"

interface Question {
  id?: number
  question: string
  medecin: string
  categorie: string
  dateCreation?: string
  utilise?: number
}

interface AddQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (question: Question) => void
  editingQuestion?: Question | null
}

const categories = [
  "Symptômes",
  "Antécédents",
  "Médicaments",
  "Allergies",
  "Douleur",
  "Habitudes",
  "Famille",
  "Général"
]

const medecins = [
  "Dr. Martin",
  "Dr. Dubois", 
  "Dr. Leroy",
  "Dr. Moreau",
  "Dr. Petit"
]

export function AddQuestionModal({ isOpen, onClose, onSave, editingQuestion }: AddQuestionModalProps) {
  const [formData, setFormData] = useState<Question>({
    question: "",
    medecin: medecins[0],
    categorie: categories[0]
  })
  
  const [errors, setErrors] = useState<Partial<Question>>({})

  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        question: editingQuestion.question,
        medecin: editingQuestion.medecin,
        categorie: editingQuestion.categorie
      })
    } else {
      setFormData({
        question: "",
        medecin: medecins[0],
        categorie: categories[0]
      })
    }
    setErrors({})
  }, [editingQuestion, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Partial<Question> = {}

    if (!formData.question.trim()) {
      newErrors.question = "La question est requise"
    } else if (formData.question.trim().length < 10) {
      newErrors.question = "La question doit contenir au moins 10 caractères"
    }

    if (!formData.medecin) {
      newErrors.medecin = "Le médecin est requis"
    }

    if (!formData.categorie) {
      newErrors.categorie = "La catégorie est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const questionData: Question = {
      ...formData,
      id: editingQuestion?.id,
      dateCreation: editingQuestion?.dateCreation || new Date().toLocaleDateString('fr-FR'),
      utilise: editingQuestion?.utilise || 0
    }

    onSave(questionData)
    onClose()
  }

  const handleChange = (field: keyof Question, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-red-600" />
            {editingQuestion ? "Modifier la question" : "Ajouter une question"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => handleChange('question', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                errors.question ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Saisissez votre question ici..."
            />
            {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Médecin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médecin *
              </label>
              <select
                value={formData.medecin}
                onChange={(e) => handleChange('medecin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {medecins.map(medecin => (
                  <option key={medecin} value={medecin}>{medecin}</option>
                ))}
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.categorie}
                onChange={(e) => handleChange('categorie', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map(categorie => (
                  <option key={categorie} value={categorie}>{categorie}</option>
                ))}
              </select>
            </div>
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
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {editingQuestion ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
