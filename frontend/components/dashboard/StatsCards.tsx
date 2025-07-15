interface StatsCardsProps {
  totalPatients: number
  totalRendezVous: number
  rendezVousAujourdhui: number
  totalQuestions: number
}

export function StatsCards({ 
  totalPatients, 
  totalRendezVous, 
  rendezVousAujourdhui, 
  totalQuestions 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Patients</p>
            <p className="text-3xl font-bold text-blue-600">{totalPatients}</p>
          </div>
          <div className="text-blue-500 text-2xl">👥</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Rendez-vous</p>
            <p className="text-3xl font-bold text-green-600">{totalRendezVous}</p>
          </div>
          <div className="text-green-500 text-2xl">📅</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Aujourd'hui</p>
            <p className="text-3xl font-bold text-orange-600">{rendezVousAujourdhui}</p>
          </div>
          <div className="text-orange-500 text-2xl">⏰</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Questions</p>
            <p className="text-3xl font-bold text-purple-600">{totalQuestions}</p>
          </div>
          <div className="text-purple-500 text-2xl">💬</div>
        </div>
      </div>
    </div>
  )
}
