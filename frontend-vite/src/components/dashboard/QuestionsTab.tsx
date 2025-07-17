import React, { useState } from "react"

interface Question {
  id: number
  question: string
  medecin: string
}

interface QuestionsTabProps {
  questions: Question[]
  onQuestionsChange: (questions: Question[]) => void
}

export function QuestionsTab({ questions, onQuestionsChange }: QuestionsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({ question: "" })

  const handleAddQuestion = () => {
    setFormData({ question: "" })
    setShowAddForm(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setFormData({ question: question.question })
    setShowEditForm(true)
  }

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.question.trim()) {
      const newQuestion: Question = {
        id: questions.length + 1,
        question: formData.question,
        medecin: "Dr. Généraliste"
      }
      onQuestionsChange([...questions, newQuestion])
      setShowAddForm(false)
      setFormData({ question: "" })
    }
  }

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.question.trim() && editingQuestion) {
      const updatedQuestions = questions.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, question: formData.question }
          : q
      )
      onQuestionsChange(updatedQuestions)
      setShowEditForm(false)
      setEditingQuestion(null)
      setFormData({ question: "" })
    }
  }

  const handleDeleteQuestion = (questionId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      onQuestionsChange(questions.filter(q => q.id !== questionId))
    }
  }

  const closeAllForms = () => {
    setShowAddForm(false)
    setShowEditForm(false)
    setEditingQuestion(null)
    setFormData({ question: "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Questions Chatbot</h2>
        <button 
          onClick={handleAddQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          ➕ Ajouter
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">➕ Ajouter une nouvelle question</h3>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question :
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Entrez votre question..."
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                ✅ Ajouter
              </button>
              <button
                type="button"
                onClick={closeAllForms}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {questions.map((question) => (
        <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          {/* Formulaire d'édition */}
          {showEditForm && editingQuestion?.id === question.id ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">✏️ Modifier la question</h3>
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question :
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    ✅ Sauvegarder
                  </button>
                  <button
                    type="button"
                    onClick={closeAllForms}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    ❌ Annuler
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Affichage normal de la question */
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium mb-2">{question.question}</p>
                <p className="text-gray-600">👨‍⚕️ {question.medecin}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditQuestion(question)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  ✏️ Modifier
                </button>
                <button 
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
