import React, { useState } from "react"
import { MessageSquare, Plus, Edit, Trash2, Search, User } from "lucide-react"
import { AddQuestionModal } from "./AddQuestionModal"

// Données d'exemple pour les questions du médecin
const initialQuestionsData = [
  { 
    id: 1, 
    question: "Depuis combien de temps ressentez-vous ces symptômes ?", 
    medecin: "Dr. Martin",
    categorie: "Symptômes",
    dateCreation: "10/01/2024",
    utilise: 45
  },
  { 
    id: 2, 
    question: "Avez-vous des antécédents familiaux de maladies cardiaques ?", 
    medecin: "Dr. Martin",
    categorie: "Antécédents",
    dateCreation: "08/01/2024",
    utilise: 32
  },
  { 
    id: 3, 
    question: "Prenez-vous des médicaments actuellement ?", 
    medecin: "Dr. Martin",
    categorie: "Médicaments",
    dateCreation: "05/01/2024",
    utilise: 67
  },
  { 
    id: 4, 
    question: "Avez-vous des allergies connues ?", 
    medecin: "Dr. Martin",
    categorie: "Allergies",
    dateCreation: "03/01/2024",
    utilise: 28
  }
]

interface MedecinQuestionsTabProps {}

export function MedecinQuestionsTab({}: MedecinQuestionsTabProps) {
  const [questions, setQuestions] = useState(initialQuestionsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.question.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "" || question.categorie === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setShowAddModal(true)
  }

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question)
    setShowAddModal(true)
  }

  const handleDeleteQuestion = (questionToDelete: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette question ?\n\n"${questionToDelete.question}"`)) {
      setQuestions(prev => prev.filter(q => q.id !== questionToDelete.id))
    }
  }

  const handleSaveQuestion = (questionData: any) => {
    if (editingQuestion) {
      // Modification
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionData, id: editingQuestion.id }
          : q
      ))
    } else {
      // Ajout
      const newQuestion = {
        ...questionData,
        id: Math.max(...questions.map(q => q.id)) + 1,
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        utilise: 0
      }
      setQuestions(prev => [...prev, newQuestion])
    }
  }

  const uniqueCategories = Array.from(new Set(questions.map(q => q.categorie)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Questions Chatbot</h2>
          <p className="text-gray-600 mt-1">
            {questions.length} question{questions.length > 1 ? 's' : ''} créée{questions.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleAddQuestion}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une question</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Questions</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{questions.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Catégories</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">{uniqueCategories.length}</p>
        </div>
      </div>

      {/* Liste des questions */}
      <div className="grid gap-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      {question.categorie}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {question.question}
                </h3>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    <span>Créée le {question.dateCreation}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEditQuestion(question)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question trouvée</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter 
              ? "Essayez de modifier vos critères de recherche"
              : "Commencez par ajouter votre première question"
            }
          </p>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      <AddQuestionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveQuestion}
        editingQuestion={editingQuestion}
      />
    </div>
  )
}
