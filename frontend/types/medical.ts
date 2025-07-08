export interface Question {
  id: string
  text: string
  type: "text" | "select" | "multiselect" | "date"
  options?: string[]
  required: boolean
  category: string
}

export interface PatientData {
  nom: string
  prenom: string
  age: string
  sexe: string
  telephone: string
  email: string
  symptomes: string
  dureeSymptomes: string
  intensiteDouleur: string
  antecedentsMedicaux: string[]
  medicamentsActuels: string
  allergies: string[]
  antecedensFamiliaux: string[]
  autresInfos: string
}

export interface ChatMessage {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

export interface RendezVous {
  date: string
  heure: string
  motif: string
  confirme: boolean
}
