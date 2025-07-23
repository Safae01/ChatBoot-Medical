// Script de test pour vérifier la connexion avec le backend
import { chatbotService } from './services/api'

// Données de test simulant une réponse complète du chatbot
const testPatientData = {
  nom: 'Dupont',
  prenom: 'Jean',
  dateNaissance: '1988-05-15', // Changé de 'age' vers 'dateNaissance'
  sexe: 'Masculin',
  telephone: '0123456789',
  email: 'jean.dupont@email.com',
  cin: 'AB123456',
  adresse: '123 Rue de la Santé, Paris',
  symptomes: 'Maux de tête persistants',
  dureeSymptomes: '3 jours',
  intensiteDouleur: '7/10',
  antecedentsMedicaux: ['Hypertension'],
  traitement: 'Paracétamol 1g', // Changé de 'medicamentsActuels' vers 'traitement'
  allergies: ['Pénicilline'],
  antecedensFamiliaux: ['Diabète'],
  autresInfos: 'Stress au travail récent',
  specialite: 'Cardiologie',
  medecin_id: 1
}

// Fonction de test
export async function testChatbotBackend() {
  console.log('🧪 Test de connexion avec le backend ChatBot...')
  console.log('📤 Données à envoyer:', testPatientData)
  
  try {
    const response = await chatbotService.savePatientData(testPatientData)
    console.log('✅ Succès! Réponse du backend:', response)
    return response
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
    throw error
  }
}

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testChatbotBackend = testChatbotBackend
}
