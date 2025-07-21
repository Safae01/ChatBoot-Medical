import React, { useState } from "react"
import { Sidebar } from "../components/dashboard/Sidebar"
import { DashboardHeader } from "../components/dashboard/DashboardHeader"
import { MedecinRendezVousTab } from "../components/dashboard/MedecinRendezVousTab"
import { MedecinQuestionsTab } from "../components/dashboard/MedecinQuestionsTab"
import { MedecinPatientsTab } from "../components/dashboard/MedecinPatientsTab"
import { DossierMedicalModal } from "../components/dashboard/DossierMedicalModal"
import { Users, Calendar, MessageSquare } from "lucide-react"



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showDossierModal, setShowDossierModal] = useState(false)

  // Données d'exemple pour les statistiques
  const rendezVousCount = 4
  const questionsCount = 4
  const patientsCount = 5

  const handleViewDossier = (patient: any) => {
    setSelectedPatient(patient)
    setShowDossierModal(true)
  }

  const tabs = [
    { id: "dashboard", label: "Tableau de bord", count: 0 },
    { id: "rendez-vous", label: "Rendez-vous", count: rendezVousCount },
    { id: "questions", label: "Questions Chatbot", count: questionsCount },
    { id: "patients", label: "Patients", count: patientsCount }
  ]

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Tableau de bord"
      case "rendez-vous":
        return "Mes Rendez-vous"
      case "questions":
        return "Questions Chatbot"
      case "patients":
        return "Mes Patients"
      default:
        return "Dashboard"
    }
  }

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Rendez-vous</p>
            <p className="text-2xl font-bold text-gray-900">{rendezVousCount}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Questions</p>
            <p className="text-2xl font-bold text-gray-900">{questionsCount}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Patients</p>
            <p className="text-2xl font-bold text-gray-900">{patientsCount}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderDashboardContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord médecin</h2>
        <p className="text-gray-600">Vue d'ensemble de votre activité médicale</p>
      </div>

      {renderStatsCards()}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <DashboardHeader title={getPageTitle()} />

      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mt-6">
            {activeTab === "dashboard" && renderDashboardContent()}

            {activeTab === "rendez-vous" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <MedecinRendezVousTab onViewDossier={handleViewDossier} />
              </div>
            )}

            {activeTab === "questions" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <MedecinQuestionsTab />
              </div>
            )}

            {activeTab === "patients" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <MedecinPatientsTab onViewDossier={handleViewDossier} />
              </div>
            )}
          </div>
        </div>
      </main>

      <DossierMedicalModal
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        patient={selectedPatient}
      />
    </div>
  )
}
