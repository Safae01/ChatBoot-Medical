import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import type { PatientData } from "../types/medical"

interface PatientSummaryProps {
  patientData: Partial<PatientData>
  isSavingToBackend?: boolean
  backendSaveSuccess?: boolean
  backendSaveError?: string | null
}

export function PatientSummary({
  patientData,
  isSavingToBackend = false,
  backendSaveSuccess = false,
  backendSaveError = null
}: PatientSummaryProps) {
  const hasData = Object.keys(patientData).length > 0

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Résumé Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Aucune donnée patient disponible pour le moment.
            <br />
            Commencez le questionnaire pour voir les informations ici.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatFieldName = (key: string) => {
    const fieldNames: Record<string, string> = {
      nom: "Nom",
      prenom: "Prénom",
      date_naissance: "Date de naissance",
      sexe: "Sexe",
      telephone: "Téléphone",
      cin: "CIN",
      adresse: "Adresse",
      symptomes: "Symptômes",
      dureeSymptomes: "Durée des symptômes",
      antecedentsMedicaux: "Antécédents médicaux",
      medicamentsActuels: "Médicaments actuels",
      antecedensFamiliaux: "Antécédents familiaux"
    }
    return fieldNames[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      // Vérifier si c'est un tableau de fichiers
      if (value.length > 0 && typeof value[0] === "object" && 'name' in value[0]) {
        return value.map((file: any) => file.name).join(', ')
      }
      return value.join(', ')
    }
    return String(value)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type === "application/pdf") return "📄"
    if (type.includes("word")) return "📝"
    return "📎"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📋 Résumé Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(patientData).map(([key, value]) => (
            <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium text-gray-700 mb-1 sm:mb-0">
                  {formatFieldName(key)}:
                </span>
                <div className="text-gray-900 sm:text-right max-w-xs">
                  {/* Affichage spécial pour les fichiers */}
                  {Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && 'name' in value[0] ? (
                    <div className="space-y-1">
                      {value.map((file: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span>{getFileIcon(file.type)}</span>
                          <span>{file.name}</span>
                          <span className="text-gray-500">({formatFileSize(file.size)})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>{formatValue(value)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Statut de sauvegarde backend */}
        {(isSavingToBackend || backendSaveSuccess || backendSaveError) && (
          <div className="mt-4 p-3 rounded-lg border">
            {isSavingToBackend && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Sauvegarde au backend en cours...</span>
              </div>
            )}

            {backendSaveSuccess && !isSavingToBackend && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-sm font-medium">✅ Données sauvegardées dans le backend !</span>
              </div>
            )}

            {backendSaveError && !isSavingToBackend && (
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-sm font-medium">❌ Erreur backend: {backendSaveError}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            ℹ️ Ces informations sont automatiquement collectées pendant votre conversation avec l'assistant médical.
            {backendSaveSuccess && (
              <>
                <br />
                <span className="font-medium">🔄 Les données sont maintenant synchronisées avec le backend.</span>
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
