// Données statiques pour les spécialités et médecins

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
  specialiteId: number
}

export const SPECIALITES: Specialite[] = [
  {
    id: 1,
    nom: "Cardiologie",
    description: "Spécialité médicale qui traite les maladies du cœur et des vaisseaux sanguins"
  },
  {
    id: 2,
    nom: "Dermatologie",
    description: "Spécialité médicale qui traite les maladies de la peau, des cheveux et des ongles"
  },
  {
    id: 3,
    nom: "Neurologie",
    description: "Spécialité médicale qui traite les maladies du système nerveux"
  },
  {
    id: 4,
    nom: "Orthopédie",
    description: "Spécialité médicale qui traite les maladies de l'appareil locomoteur"
  },
  {
    id: 5,
    nom: "Gynécologie",
    description: "Spécialité médicale qui traite les maladies de l'appareil génital féminin"
  },
  {
    id: 6,
    nom: "Pédiatrie",
    description: "Spécialité médicale qui traite les maladies des enfants"
  },
  {
    id: 7,
    nom: "Ophtalmologie",
    description: "Spécialité médicale qui traite les maladies des yeux"
  },
  {
    id: 8,
    nom: "ORL",
    description: "Spécialité médicale qui traite les maladies des oreilles, du nez et de la gorge"
  }
]

export const MEDECINS: Medecin[] = [
  // Cardiologie
  {
    id: 1,
    nom: "Martin",
    prenom: "Jean",
    email: "j.martin@hopital.fr",
    telephone: "01.23.45.67.89",
    specialiteId: 1
  },
  {
    id: 2,
    nom: "Dubois",
    prenom: "Marie",
    email: "m.dubois@hopital.fr",
    telephone: "01.23.45.67.90",
    specialiteId: 1
  },
  
  // Dermatologie
  {
    id: 3,
    nom: "Leroy",
    prenom: "Pierre",
    email: "p.leroy@hopital.fr",
    telephone: "01.23.45.67.91",
    specialiteId: 2
  },
  {
    id: 4,
    nom: "Moreau",
    prenom: "Sophie",
    email: "s.moreau@hopital.fr",
    telephone: "01.23.45.67.92",
    specialiteId: 2
  },
  
  // Neurologie
  {
    id: 5,
    nom: "Petit",
    prenom: "Marc",
    email: "m.petit@hopital.fr",
    telephone: "01.23.45.67.93",
    specialiteId: 3
  },
  {
    id: 6,
    nom: "Roux",
    prenom: "Claire",
    email: "c.roux@hopital.fr",
    telephone: "01.23.45.67.94",
    specialiteId: 3
  },
  
  // Orthopédie
  {
    id: 7,
    nom: "Blanc",
    prenom: "Paul",
    email: "p.blanc@hopital.fr",
    telephone: "01.23.45.67.95",
    specialiteId: 4
  },
  {
    id: 8,
    nom: "Garnier",
    prenom: "Anne",
    email: "a.garnier@hopital.fr",
    telephone: "01.23.45.67.96",
    specialiteId: 4
  },
  
  // Gynécologie
  {
    id: 9,
    nom: "Faure",
    prenom: "Isabelle",
    email: "i.faure@hopital.fr",
    telephone: "01.23.45.67.97",
    specialiteId: 5
  },
  {
    id: 10,
    nom: "Girard",
    prenom: "Nathalie",
    email: "n.girard@hopital.fr",
    telephone: "01.23.45.67.98",
    specialiteId: 5
  },
  
  // Pédiatrie
  {
    id: 11,
    nom: "Andre",
    prenom: "Thomas",
    email: "t.andre@hopital.fr",
    telephone: "01.23.45.67.99",
    specialiteId: 6
  },
  {
    id: 12,
    nom: "Michel",
    prenom: "Julie",
    email: "j.michel@hopital.fr",
    telephone: "01.23.45.68.00",
    specialiteId: 6
  },
  
  // Ophtalmologie
  {
    id: 13,
    nom: "Bernard",
    prenom: "François",
    email: "f.bernard@hopital.fr",
    telephone: "01.23.45.68.01",
    specialiteId: 7
  },
  {
    id: 14,
    nom: "Durand",
    prenom: "Sylvie",
    email: "s.durand@hopital.fr",
    telephone: "01.23.45.68.02",
    specialiteId: 7
  },
  
  // ORL
  {
    id: 15,
    nom: "Robert",
    prenom: "Alain",
    email: "a.robert@hopital.fr",
    telephone: "01.23.45.68.03",
    specialiteId: 8
  },
  {
    id: 16,
    nom: "Simon",
    prenom: "Valérie",
    email: "v.simon@hopital.fr",
    telephone: "01.23.45.68.04",
    specialiteId: 8
  }
]

// Fonction utilitaire pour obtenir les médecins d'une spécialité
export const getMedecinsBySpecialite = (specialiteId: number): Medecin[] => {
  return MEDECINS.filter(medecin => medecin.specialiteId === specialiteId)
}

// Fonction utilitaire pour obtenir une spécialité par ID
export const getSpecialiteById = (id: number): Specialite | undefined => {
  return SPECIALITES.find(specialite => specialite.id === id)
}

// Fonction utilitaire pour obtenir un médecin par ID
export const getMedecinById = (id: number): Medecin | undefined => {
  return MEDECINS.find(medecin => medecin.id === id)
}
