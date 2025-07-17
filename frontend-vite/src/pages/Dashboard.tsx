import React, { useState } from "react"
import { Sidebar } from "../components/dashboard/Sidebar"
import { DashboardHeader } from "../components/dashboard/DashboardHeader"
import { StatsCards } from "../components/dashboard/StatsCards"
import { RendezVousTab } from "../components/dashboard/RendezVousTab"
import { QuestionsTab } from "../components/dashboard/QuestionsTab"
import { PatientsTab } from "../components/dashboard/PatientsTab"
import { DossierModal } from "../components/dashboard/DossierModal"
import { MedicalChatbot } from "../components/MedicalChatbot"

// Données d'exemple simples
const rendezVousData = [
  { id: 1, patient: "Paul Dupont", date: "15/01/2024", heure: "09:00", statut: "Confirmé", motif: "Consultation cardiologie" },
  { id: 2, patient: "Julie Moreau", date: "15/01/2024", heure: "10:30", statut: "En attente", motif: "Dermatologie" },
  { id: 3, patient: "Marc Petit", date: "16/01/2024", heure: "14:00", statut: "Confirmé", motif: "Neurologie" },
]

const initialQuestionsData = [
  { id: 1, question: "Depuis combien de temps ressentez-vous ces symptômes ?", medecin: "Dr. Martin" },
  { id: 2, question: "Avez-vous des antécédents familiaux ?", medecin: "Dr. Dubois" },
  { id: 3, question: "Prenez-vous des médicaments actuellement ?", medecin: "Dr. Leroy" },
]

const patientsData = [
  { id: 1, nom: "Paul Dupont", age: 38, email: "paul.dupont@email.com", telephone: "06.12.34.56.78" },
  { id: 2, nom: "Julie Moreau", age: 33, email: "julie.moreau@email.com", telephone: "06.12.34.56.79" },
  { id: 3, nom: "Marc Petit", age: 45, email: "marc.petit@email.com", telephone: "06.12.34.56.80" },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("rendez-vous")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [questions, setQuestions] = useState(initialQuestionsData)

  const handleViewDossier = (patient: any) => {
    setSelectedPatient(patient)
    setShowModal(true)
  }

  const tabs = [
    { id: "rendez-vous", label: "Rendez-vous", count: rendezVousData.length },
    { id: "questions", label: " Questions Chatbot", count: questions.length },
    { id: "patients", label: " Patients", count: patientsData.length }
  ]

  const getPageTitle = () => {
    switch (activeTab) {
      case "rendez-vous":
        return "Rendez-vous"
      case "questions":
        return "Questions Chatbot"
      case "patients":
        return "Patients"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      
      <DashboardHeader title={getPageTitle()} />

      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 mt-6">
            <StatsCards
              totalPatients={patientsData.length}
              totalRendezVous={rendezVousData.length}
              rendezVousAujourdhui={2}
              totalQuestions={questions.length}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              {activeTab === "rendez-vous" && (
                <RendezVousTab
                  rendezVous={rendezVousData}
                  onViewDossier={handleViewDossier}
                />
              )}

              {activeTab === "questions" && (
                <QuestionsTab
                  questions={questions}
                  onQuestionsChange={setQuestions}
                />
              )}

              {activeTab === "patients" && (
                <PatientsTab
                  patients={patientsData}
                  onViewDossier={handleViewDossier}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <DossierModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedPatient={selectedPatient}
      />
    </div>
  )
}
