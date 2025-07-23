import axios from "axios"

// Configuration de l'API - Utilise le proxy Vite pour éviter CORS
const API_BASE_URL = "/api"

// ✅ Types pour les réponses API
export interface LoginResponse {
  token: string
  user?: {
    id: string
    email: string
    roles: string[] // <-- corrigé
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// ✅ Service d'authentification
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      })

      console.log("Réponse complète :", response.data)

      const token = response.data.token
      if (!token) {
        throw new Error("Le serveur n'a pas renvoyé de token.")
      }

      // Adapter la réponse backend à la structure frontend
      const role = response.data.role
      const roles = role ? [role] : []

      return {
        token,
        user: {
          id: response.data.id,
          email: email, // On utilise l'email de la requête
          roles: roles, // Convertir le rôle unique en tableau
        }
      }
    } catch (err: any) {
      console.error("Erreur login :", err)

      if (err.response) {
        throw new Error(
          "Erreur serveur : " + (err.response.data.message || "Login échoué")
        )
      } else if (err.request) {
        throw new Error("Le serveur ne répond pas.")
      } else {
        throw new Error("Une erreur est survenue.")
      }
    }
  },

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    const token = localStorage.getItem("token")
    if (token) {
      axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }).catch(error => {
        console.log("Logout API non disponible:", error.message)
      })
    }
  },

  async getCurrentUser() {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Pas de token")
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw new Error("Token invalide")
    }
  }
}

// ✅ Requêtes authentifiées
export const apiRequest = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem("token")

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await axios(`${API_BASE_URL}${endpoint}`, config)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
      throw new Error("Session expirée")
    }

    throw new Error(error.response?.data?.message || "Erreur API")
  }
}

// ✅ Service Chatbot pour envoyer les données au backend
export const chatbotService = {
  async savePatientData(patientData: any): Promise<any> {
    try {
      // Adapter les données du frontend au format attendu par le backend
      const backendData = {
        nom: patientData.nom || '',
        prenom: patientData.prenom || '',
        telephone: patientData.telephone || '',
        cin: patientData.cin || '',
        sexe: patientData.sexe || '',
        adresse: patientData.adresse || '',
        dateNaissance: patientData.date_naissance || '2000-01-01',
        symptomes: patientData.symptomes || '',
        antecedents: formatAntecedents(patientData),
        traitement: patientData.traitement || '',
        notes: formatNotes(patientData),
        // Assurer que medecin_id est un nombre ou null
        medecin_id: patientData.medecin_id ? Number(patientData.medecin_id) : null,
        // Assurer que specialite est une string ou null
        specialite: patientData.specialite || null,
      }

      console.log('📤 Données envoyées au backend:', backendData)
      console.log('🔍 Détail des champs:')
      Object.entries(backendData).forEach(([key, value]) => {
        console.log(`  ${key}:`, value, `(${typeof value})`)
      })

      const response = await axios.post(`${API_BASE_URL}/chatbot/patient`, backendData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('Réponse du backend:', response)
      return response
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde des données patient:', error)

      if (error.response) {
        console.error('📊 Status:', error.response.status)
        console.error('📋 Headers:', error.response.headers)
        console.error('📦 Data:', error.response.data)

        // Erreur 500 = problème serveur
        if (error.response.status === 500) {
          throw new Error(`Erreur serveur (500): ${error.response.data?.message || 'Erreur interne du serveur'}`)
        }

        // Erreur 400 = données invalides
        if (error.response.status === 400) {
          throw new Error(`Données invalides (400): ${error.response.data?.error || error.response.data?.message || 'Données incorrectes'}`)
        }

        throw new Error(`Erreur ${error.response.status}: ${error.response.data?.message || error.message}`)
      }

      throw new Error(error.message || 'Erreur lors de la sauvegarde')
    }
  }
}

// Fonctions utilitaires pour adapter les données

function formatAntecedents(patientData: any): string {
  const antecedents = []

  // Vérifier tous les noms possibles pour les antécédents médicaux
  const antecedentsMedicaux = patientData.antecedentsMedicaux || patientData.antecedents_medicaux || patientData.antecedents || []
  if (Array.isArray(antecedentsMedicaux) && antecedentsMedicaux.length > 0) {
    antecedents.push(`Antécédents médicaux: ${antecedentsMedicaux.join(', ')}`)
  } else if (typeof antecedentsMedicaux === 'string' && antecedentsMedicaux.trim()) {
    antecedents.push(`Antécédents médicaux: ${antecedentsMedicaux}`)
  }

  // Antécédents familiaux
  const antecedensFamiliaux = patientData.antecedensFamiliaux || patientData.antecedents_familiaux || []
  if (Array.isArray(antecedensFamiliaux) && antecedensFamiliaux.length > 0) {
    antecedents.push(`Antécédents familiaux: ${antecedensFamiliaux.join(', ')}`)
  } else if (typeof antecedensFamiliaux === 'string' && antecedensFamiliaux.trim()) {
    antecedents.push(`Antécédents familiaux: ${antecedensFamiliaux}`)
  }

  // Allergies
  const allergies = patientData.allergies || []
  if (Array.isArray(allergies) && allergies.length > 0) {
    antecedents.push(`Allergies: ${allergies.join(', ')}`)
  } else if (typeof allergies === 'string' && allergies.trim()) {
    antecedents.push(`Allergies: ${allergies}`)
  }

  console.log('🔍 Formatage antécédents:', {
    input: patientData,
    antecedentsMedicaux,
    antecedensFamiliaux,
    allergies,
    result: antecedents.join(' | ')
  })

  return antecedents.join(' | ')
}

function formatNotes(patientData: any): string {
  const notes = []

  if (patientData.dureeSymptomes) {
    notes.push(`Durée des symptômes: ${patientData.dureeSymptomes}`)
  }

  if (patientData.intensiteDouleur) {
    notes.push(`Intensité douleur: ${patientData.intensiteDouleur}`)
  }

  if (patientData.autresInfos) {
    notes.push(`Autres informations: ${patientData.autresInfos}`)
  }

  return notes.join(' | ')
}

// Données de fallback en cas de problème avec l'API
const FALLBACK_SPECIALITES = [
  { id: 1, nom: "Cardiologie", description: "Spécialité médicale qui traite les maladies du cœur et des vaisseaux sanguins" },
  { id: 2, nom: "Dermatologie", description: "Spécialité médicale qui traite les maladies de la peau, des cheveux et des ongles" },
  { id: 3, nom: "Neurologie", description: "Spécialité médicale qui traite les maladies du système nerveux" },
  { id: 4, nom: "Orthopédie", description: "Spécialité médicale qui traite les maladies de l'appareil locomoteur" },
  { id: 5, nom: "Gynécologie", description: "Spécialité médicale qui traite les maladies de l'appareil génital féminin" },
]

const FALLBACK_MEDECINS = [
  { id: 1, nom: "Martin", prenom: "Jean", email: "j.martin@hopital.fr", telephone: "01.23.45.67.89", specialite: { id: 1, nom: "Cardiologie" } },
  { id: 2, nom: "Dubois", prenom: "Marie", email: "m.dubois@hopital.fr", telephone: "01.23.45.67.90", specialite: { id: 1, nom: "Cardiologie" } },
  { id: 3, nom: "Leroy", prenom: "Pierre", email: "p.leroy@hopital.fr", telephone: "01.23.45.67.91", specialite: { id: 2, nom: "Dermatologie" } },
  { id: 4, nom: "Moreau", prenom: "Sophie", email: "s.moreau@hopital.fr", telephone: "01.23.45.67.92", specialite: { id: 2, nom: "Dermatologie" } },
  { id: 5, nom: "Petit", prenom: "Marc", email: "m.petit@hopital.fr", telephone: "01.23.45.67.93", specialite: { id: 3, nom: "Neurologie" } },
]

// ✅ Service pour récupérer les spécialités depuis le backend
export const specialiteService = {
  async getAll(): Promise<any[]> {
    try {
      console.log('Tentative de récupération des spécialités...')

      // Requête directe vers le backend
      console.log('🚀 Tentative de connexion directe au backend...')
      const response = await axios.get(`${API_BASE_URL}/specialites`)

      console.log('✅ Réponse reçue!')
      console.log('📊 Status:', response.status)
      console.log('📦 Data:', response.data)
      console.log('🔍 Type:', typeof response.data)
      console.log('📏 Longueur:', Array.isArray(response.data) ? response.data.length : 'N/A')

      // Vérifier le format des données
      if (Array.isArray(response.data)) {
        console.log('🎯 Format tableau direct détecté')
        return response.data
      }

      // Format ApiPlatform avec "member"
      if (response.data && typeof response.data === 'object' && response.data.member) {
        console.log('🎯 Format ApiPlatform détecté avec "member"')
        console.log('📋 Spécialités trouvées:', response.data.member.length)
        return response.data.member
      }

      // Format ApiPlatform avec "hydra:member" (ancien format)
      if (response.data && typeof response.data === 'object' && response.data['hydra:member']) {
        console.log('🎯 Format ApiPlatform détecté avec "hydra:member"')
        return response.data['hydra:member']
      }

      console.log('⚠️ Format non reconnu, retour des données brutes')
      return response.data || []

    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des spécialités:', error)
      throw error
    }
  }
}

// ✅ Service pour récupérer les médecins depuis le backend
export const medecinService = {
  async getAll(): Promise<any[]> {
    try {
      console.log('🚀 Tentative de récupération des médecins...')
      const response = await axios.get(`${API_BASE_URL}/medecins`)

      console.log('✅ Médecins récupérés!')
      console.log('📦 Data:', response.data)

      // Format ApiPlatform avec "member"
      if (response.data && typeof response.data === 'object' && response.data.member) {
        console.log('🎯 Format ApiPlatform détecté pour médecins')
        console.log('👨‍⚕️ Médecins trouvés:', response.data.member.length)
        return response.data.member
      }

      // Format ApiPlatform avec "hydra:member" (ancien format)
      if (response.data && typeof response.data === 'object' && response.data['hydra:member']) {
        return response.data['hydra:member']
      }

      // Format tableau direct
      if (Array.isArray(response.data)) {
        return response.data
      }

      console.log('⚠️ Format médecins non reconnu')
      return response.data || []

    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des médecins:', error)
      throw error
    }
  },

  async getBySpecialite(specialiteId: number): Promise<any[]> {
    try {
      const allMedecins = await this.getAll()
      // Filtrer les médecins par spécialité
      return allMedecins.filter(medecin =>
        medecin.specialite && medecin.specialite.id === specialiteId
      )
    } catch (error: any) {
      console.error('Erreur lors de la récupération des médecins par spécialité:', error)
      // En cas d'erreur, filtrer les données de fallback
      return FALLBACK_MEDECINS.filter(medecin =>
        medecin.specialite && medecin.specialite.id === specialiteId
      )
    }
  }
}

// ✅ Service pour créer des rendez-vous via ApiPlatform
export const rendezVousService = {
  async createRendezVous(appointmentData: any, patientData: any): Promise<any> {
    try {
      console.log('🗓️ Création du patient + rendez-vous via ApiPlatform...')
      console.log('📋 Données du patient reçues:', patientData)
      console.log('📋 Type de patientData:', typeof patientData)
      console.log('📋 Structure des clés du patient:', Object.keys(patientData || {}))
      console.log('📋 Données du rendez-vous reçues:', appointmentData)

      // Vérifier que patientData existe
      if (!patientData || typeof patientData !== 'object') {
        throw new Error('Aucune donnée patient trouvée. Veuillez d\'abord compléter le questionnaire.')
      }

      // ÉTAPE 1 : Adapter les données du chatbot au format attendu
      const adaptedPatientData = {
        nom: (patientData.nom_patient || patientData.nom || '').toString(),
        prenom: (patientData.prenom_patient || patientData.prenom || '').toString(),
        telephone: (patientData.telephone || patientData.phone || '').toString(),
        cin: (patientData.cin || patientData.carte_identite || '').toString(),
        sexe: (patientData.sexe || patientData.genre || '').toString(),
        adresse: (patientData.adresse || patientData.address || '').toString(),
        dateNaissance: (patientData.date_naissance || patientData.dateNaissance || '2000-01-01').toString(),
        symptomes: (patientData.symptomes || patientData.symptoms || '').toString(),
        specialite: (patientData.specialite || '').toString(),
        medecin_id: patientData.medecin_id || null
      }

      console.log('🔄 Données adaptées pour le backend:', adaptedPatientData)

      // ÉTAPE 2 : Récupérer le patient via l'endpoint /api/chatbot/patient
      console.log('👤 Récupération du patient via /api/chatbot/patient...')

      // Utiliser l'endpoint existant pour traiter les données patient et récupérer l'ID
      const patientResponse = await axios.post(`${API_BASE_URL}/chatbot/patient`, adaptedPatientData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('✅ Réponse complète du backend patient:', patientResponse.data)
      console.log('✅ Structure des clés de la réponse:', Object.keys(patientResponse.data || {}))

      // Récupérer le patient_id de la réponse
      const actualPatientId = patientResponse.data.patient_id || patientResponse.data.id
      if (!actualPatientId) {
        throw new Error('Aucun patient_id retourné par l\'endpoint /api/chatbot/patient')
      }
      console.log('🔑 Patient ID récupéré:', actualPatientId)

      // ÉTAPE 3 : Créer le rendez-vous avec le patient_id obtenu
      console.log('🗓️ Création du rendez-vous...')
      const apiData = {
        date: `${appointmentData.date}T${appointmentData.heure}:00`, // Format ISO DateTime
        motif: appointmentData.motif,
        statut: 'Confirmé',
        disponible: false, // Le champ existe dans l'entité mais pas en DB
        // Relations ApiPlatform (IRI format) - Utiliser les IDs si disponibles
        patient: `/api/patients/${actualPatientId}`, // Patient obligatoire
        ...(appointmentData.medecinId && { medecin: `/api/medecins/${appointmentData.medecinId}` })
      }

      console.log('📤 Données ApiPlatform pour le rendez-vous:', apiData)

      // URL correcte ApiPlatform pour RendezVous
      const response = await axios.post(`${API_BASE_URL}/rendez_vouses`, apiData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('✅ Rendez-vous créé avec succès!')
      console.log('📦 Réponse ApiPlatform:', response.data)

      return {
        patient: patientResponse.data,
        rendezvous: response.data,
        message: 'Patient traité et rendez-vous créé avec succès!'
      }

    } catch (error: any) {
      console.error('❌ Erreur lors de la création du rendez-vous:', error)

      if (error.response) {
        console.error('📊 Status:', error.response.status)
        console.error('📦 Data:', error.response.data)

        // Erreurs ApiPlatform
        if (error.response.status === 400) {
          const violations = error.response.data?.violations || []
          const errorMessages = violations.map((v: any) => `${v.propertyPath}: ${v.message}`).join(', ')
          throw new Error(`Données invalides: ${errorMessages || error.response.data?.detail || 'Erreur de validation'}`)
        }

        if (error.response.status === 404) {
          throw new Error(`Ressource introuvable: ${error.response.data?.detail || 'Patient ou médecin introuvable'}`)
        }

        throw new Error(`Erreur ${error.response.status}: ${error.response.data?.detail || error.message}`)
      }

      throw new Error(error.message || 'Erreur lors de la création du rendez-vous')
    }
  }
}
