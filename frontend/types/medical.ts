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
}
