import { useState, useEffect } from "react"
import { Button } from "./ui/Button"
import { specialiteService, medecinService } from "../services/api"
import type { Specialite, Medecin } from "../types/medical"

interface SpecialiteMedecinSelectorProps {
  questionType: "specialite" | "medecin_id"
  selectedSpecialite?: string
  onAnswer: (answer: string | number) => void
}

export function SpecialiteMedecinSelector({ 
  questionType, 
  selectedSpecialite, 
  onAnswer 
}: SpecialiteMedecinSelectorProps) {
  const [specialites, setSpecialites] = useState<Specialite[]>([])
  const [medecins, setMedecins] = useState<Medecin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState<string>("")

  // Charger les spécialités au montage du composant
  useEffect(() => {
    if (questionType === "specialite") {
      loadSpecialites()
    }
  }, [questionType])

  // Charger les médecins quand une spécialité est sélectionnée
  useEffect(() => {
    if (questionType === "medecin_id" && selectedSpecialite) {
      loadMedecinsBySpecialite(selectedSpecialite)
    }
  }, [questionType, selectedSpecialite])

  const loadSpecialites = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await specialiteService.getAll()
      // Vérifier que data est bien un tableau
      if (Array.isArray(data)) {
        setSpecialites(data)
      } else {
        console.error('Les données reçues ne sont pas un tableau:', data)
        setError('Format de données invalide reçu du serveur')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erreur lors du chargement des spécialités:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMedecinsBySpecialite = async (specialiteNom: string) => {
    setLoading(true)
    setError(null)
    try {
      // Trouver l'ID de la spécialité par son nom
      const specialite = specialites.find(s => s.nom === specialiteNom)
      if (!specialite) {
        // Si on n'a pas encore les spécialités, les charger d'abord
        const allSpecialites = await specialiteService.getAll()
        setSpecialites(allSpecialites)
        const foundSpecialite = allSpecialites.find(s => s.nom === specialiteNom)
        if (foundSpecialite) {
          const data = await medecinService.getBySpecialite(foundSpecialite.id)
          setMedecins(data)
        }
      } else {
        const data = await medecinService.getBySpecialite(specialite.id)
        setMedecins(data)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Erreur lors du chargement des médecins:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (selectedValue) {
      if (questionType === "specialite") {
        onAnswer(selectedValue) // Nom de la spécialité
      } else {
        onAnswer(parseInt(selectedValue)) // ID du médecin
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">
            {questionType === "specialite" ? "Chargement des spécialités..." : "Chargement des médecins..."}
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="text-red-600 text-sm mb-2">
          ❌ Erreur: {error}
        </div>
        <Button 
          onClick={questionType === "specialite" ? loadSpecialites : () => loadMedecinsBySpecialite(selectedSpecialite!)}
          className="text-sm"
        >
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm space-y-3">
      {questionType === "specialite" ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Sélectionnez une spécialité :</p>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {specialites.map((specialite) => (
              <label key={specialite.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="specialite"
                  value={specialite.nom}
                  checked={selectedValue === specialite.nom}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium">{specialite.nom}</div>
                  <div className="text-xs text-gray-500">{specialite.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium">Sélectionnez un médecin :</p>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {medecins.map((medecin) => (
              <label key={medecin.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="medecin"
                  value={medecin.id.toString()}
                  checked={selectedValue === medecin.id.toString()}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium">Dr. {medecin.nom} {medecin.prenom}</div>
                  <div className="text-xs text-gray-500">{medecin.email}</div>
                  <div className="text-xs text-gray-500">{medecin.telephone}</div>
                </div>
              </label>
            ))}
          </div>
          {medecins.length === 0 && !loading && (
            <p className="text-gray-500 text-sm">Aucun médecin disponible pour cette spécialité.</p>
          )}
        </div>
      )}
      
      <Button 
        onClick={handleSubmit} 
        disabled={!selectedValue}
        className="w-full"
      >
        Confirmer
      </Button>
    </div>
  )
}
