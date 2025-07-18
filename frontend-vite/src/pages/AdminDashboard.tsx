import React, { useState } from "react"
import { AdminSidebar } from "../components/dashboard/AdminSidebar"
import { AdminHeader } from "../components/dashboard/AdminHeader"
import { MedecinsTab } from "../components/dashboard/MedecinsTab"
import { AdminRendezVousTab } from "../components/dashboard/AdminRendezVousTab"
import { AdminQuestionsTab } from "../components/dashboard/AdminQuestionsTab"
import { AdminPatientsTab } from "../components/dashboard/AdminPatientsTab"
import { AddMedecinModal } from "../components/dashboard/AddMedecinModal"
import { ConfirmDeleteModal } from "../components/dashboard/ConfirmDeleteModal"
import { DossierMedicalModal } from "../components/dashboard/DossierMedicalModal"
import { useMedecins } from "../hooks/useMedecins"
import { Medecin } from "../data/medical-data"
import { Users, Activity, Calendar, MessageSquare, UserCheck } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDossierModal, setShowDossierModal] = useState(false)
  const [editingMedecin, setEditingMedecin] = useState<Medecin | null>(null)
  const [deletingMedecin, setDeletingMedecin] = useState<Medecin | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const { medecins } = useMedecins()

  // Données d'exemple pour les autres sections
  const rendezVousCount = 12
  const questionsCount = 8
  const patientsCount = 25

  const handleAddMedecin = () => {
    setEditingMedecin(null)
    setShowAddModal(true)
  }

  const handleEditMedecin = (medecin: Medecin) => {
    setEditingMedecin(medecin)
    setShowAddModal(true)
  }

  const handleDeleteMedecin = (medecin: Medecin) => {
    setDeletingMedecin(medecin)
    setShowDeleteModal(true)
  }

  const handleModalSuccess = () => {
    // Rafraîchir les données si nécessaire
    console.log('Opération réussie')
  }

  const handleViewDossier = (patient: any) => {
    setSelectedPatient(patient)
    setShowDossierModal(true)
  }

  const tabs = [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "rendez-vous", label: "Rendez-vous", count: rendezVousCount },
    { id: "questions", label: "Questions Chatbot", count: questionsCount },
    { id: "patients", label: "Patients", count: patientsCount },
    { id: "medecins", label: "Médecins", count: medecins.length }
  ]

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Tableau de bord"
      case "rendez-vous":
        return "Gestion des Rendez-vous"
      case "questions":
        return "Questions Chatbot"
      case "patients":
        return "Gestion des Patients"
      case "medecins":
        return "Gestion des Médecins"
      default:
        return "Administration"
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
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Médecins</p>
            <p className="text-2xl font-bold text-gray-900">{medecins.length}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderDashboardContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord administrateur</h2>
        <p className="text-gray-600">Vue d'ensemble du système médical</p>
      </div>

      {renderStatsCards()}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par spécialité</h3>
        <div className="space-y-3">
          {Array.from(new Set(medecins.map(m => m.specialiteId))).map(specialiteId => {
            const count = medecins.filter(m => m.specialiteId === specialiteId).length
            const percentage = Math.round((count / medecins.length) * 100)
            return (
              <div key={specialiteId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Spécialité {specialiteId}</span>
                  <span className="text-gray-500">{count} médecins</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      
      <AdminHeader title={getPageTitle()} />

      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mt-6">
            {activeTab === "dashboard" && renderDashboardContent()}

            {activeTab === "rendez-vous" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <AdminRendezVousTab onViewDossier={handleViewDossier} />
              </div>
            )}

            {activeTab === "questions" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <AdminQuestionsTab />
              </div>
            )}

            {activeTab === "patients" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <AdminPatientsTab onViewDossier={handleViewDossier} />
              </div>
            )}

            {activeTab === "medecins" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <MedecinsTab
                  onAddMedecin={handleAddMedecin}
                  onEditMedecin={handleEditMedecin}
                  onDeleteMedecin={handleDeleteMedecin}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddMedecinModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleModalSuccess}
        editingMedecin={editingMedecin}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleModalSuccess}
        medecin={deletingMedecin}
      />

      <DossierMedicalModal
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        patient={selectedPatient}
      />
    </div>
  )
}
