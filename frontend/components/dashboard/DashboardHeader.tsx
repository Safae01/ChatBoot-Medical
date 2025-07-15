interface DashboardHeaderProps {
  onLogout?: () => void
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Logique de déconnexion par défaut
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">🏥 Dashboard Médical</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </header>
  )
}
