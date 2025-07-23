import type { Question } from "../types/medical"

export const MEDICAL_QUESTIONS: Question[] = [
  {
    id: "nom",
    text: "Je vais vous aider à préparer votre dossier médical. Quel est votre nom de famille ?",
    type: "text",
    required: true,
    category: "identite",
  },
  {
    id: "prenom",
    text: "Et votre prénom ?",
    type: "text",
    required: true,
    category: "identite",
  },
    {
    id: "specialite",
    text: "Quelle spécialité médicale souhaitez-vous consulter ?",
    type: "select",
    options: [], // Sera rempli dynamiquement depuis le backend
    required: true,
    category: "consultation",
  },
  {
    id: "medecin_id",
    text: "Quel médecin souhaitez-vous consulter ?",
    type: "select",
    options: [], // Sera rempli dynamiquement selon la spécialité choisie
    required: true,
    category: "consultation",
  },
  {
    id: "date_naissance",
    text: "Quel est votre date de naissance ?",
    type: "date",
    required: true,
    category: "identite",
  },
  {
    id: "sexe",
    text: "Quel est votre sexe ?",
    type: "select",
    options: ["Homme", "Femme"],
    required: true,
    category: "identite",
  },
  {
    id: "telephone",
    text: "Quel est votre numéro de téléphone ?",
    type: "text",
    required: true,
    category: "contact",
  },
  {
    id: "cin",
    text: "votre numéro de Cin s'il vous plait ",
    type: "text",
    required: true,
    category: "identite",
  },
  {
    id: "adresse",
    text: "votre adresse s'il vous plait",
    type: "text",
    required: true,
    category: "contact",
  },
  {
    id: "symptomes",
    text: "Quels sont vos symptômes actuels ? Décrivez-les en détail.",
    type: "text",
    required: true,
    category: "symptomes",
  },
  {
    id: "traitement",
    text: "Prenez-vous actuellement des médicaments ou suivez-vous un traitement ? Si oui, lesquels ?",
    type: "text",
    required: false,
    category: "medicaments",
  },
  {
    id: "antecedentsMedicaux",
    text: "Avez-vous des antécédents médicaux ? ",
    type: "text",
    required: true,
    category: "antecedents",
  }, 
  {
    id: "fichier externe",
    text: "Avez-vous des radios, analyses ou documents médicaux à partager ?",
    type: "file",
    required: false,
    category: "documents",
    accept: ".jpg,.jpeg,.png,.pdf,.doc,.docx",
  },


]

export const WELCOME_MESSAGE =
  "Est-ce que tu as déjà un dossier médical ?"

export const COMPLETION_MESSAGE =
  "Parfait ! J'ai collecté toutes les informations nécessaires. Votre dossier médical est maintenant prêt. Souhaitez-vous fixer un rendez-vous ?"
