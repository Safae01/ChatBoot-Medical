interface DossierModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPatient: any
}

export function DossierModal({ isOpen, onClose, selectedPatient }: DossierModalProps) {
  if (!isOpen || !selectedPatient) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">📋 Dossier Médical</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">👤 Informations Patient</h4>
            <p><strong>Nom:</strong> {selectedPatient?.patient || selectedPatient?.nom}</p>
            <p><strong>Date:</strong> {selectedPatient?.date || "15/01/2024"}</p>
            <p><strong>Motif:</strong> {selectedPatient?.motif || "Consultation générale"}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🩺 Symptômes</h4>
            <p>Douleurs thoraciques, essoufflement lors d'efforts modérés, fatigue générale</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📋 Antécédents</h4>
            <p>Hypertension artérielle, antécédents familiaux cardiovasculaires</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💊 Traitement</h4>
            <p>Amlodipine 5mg/jour, Atorvastatine 20mg/jour, régime pauvre en sel</p>
          </div>
        </div>
      </div>
    </div>
  )
}
