export interface Question {
  id: string
  text: string
  type: "text" | "select" | "multiselect" | "date" | "file"
  options?: string[]
  required: boolean
  category: string
  accept?:string
}

export interface PatientData {
  nom: string
  prenom: string
  dateNaissance: string // Changé de 'age' vers 'dateNaissance' pour correspondre à la DB
  sexe: string
  telephone: string
  email: string
  cin?: string
  adresse?: string
  symptomes: string
  dureeSymptomes: string
  intensiteDouleur: string
  antecedentsMedicaux: string[]
  traitement: string // Changé de 'medicamentsActuels' vers 'traitement' pour correspondre à la DB
  allergies: string[]
  antecedensFamiliaux: string[]
  autresInfos: string
  specialite?: string // Nom de la spécialité sélectionnée
  medecin_id?: number // ID du médecin sélectionné
}

// Types pour les données du backend
export interface Specialite {
  id: number
  nom: string
  description: string
}

export interface Medecin {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  specialite: Specialite
}

export interface FileData {
    name: string
    type: string
    size: number
    url: string
    uploadDate: Date
  }


export interface ChatMessage {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  files?: FileData[]
}

export interface RendezVous {
  date: string
  heure: string
  motif: string
  confirme: boolean
  specialiteId?: number
  medecinId?: number
}
