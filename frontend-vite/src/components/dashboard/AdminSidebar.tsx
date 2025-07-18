import React from "react"
import { Users, Home, LogOut, Calendar, MessageSquare, UserCheck } from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Array<{
    id: string
    label: string
    count?: number
  }>
  onLogout?: () => void
}

export function AdminSidebar({ activeTab, onTabChange, tabs, onLogout }: AdminSidebarProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
  }

  const getIcon = (tabId: string) => {
    switch (tabId) {
      case "dashboard":
        return <Home className="w-5 h-5" />
      case "rendez-vous":
        return <Calendar className="w-5 h-5" />
      case "questions":
        return <MessageSquare className="w-5 h-5" />
      case "patients":
        return <UserCheck className="w-5 h-5" />
      case "medecins":
        return <Users className="w-5 h-5" />
      default:
        return <Home className="w-5 h-5" />
    }
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-20">
      {/* Logo et titre */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AdminDashboard</h1>
            <p className="text-sm text-gray-500">Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === tab.id
                ? "bg-red-50 text-red-700 border border-red-200"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-3">
              {getIcon(tab.id)}
              <span className="font-medium">{tab.label}</span>
            </div>
            {tab.count !== undefined && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer avec profil et déconnexion */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Administrateur</p>
            <p className="text-xs text-gray-500">Système médical</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  )
}
