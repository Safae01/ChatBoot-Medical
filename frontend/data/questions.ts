import type { Question } from "../types/medical"

export const MEDICAL_QUESTIONS: Question[] = [
  {
    id: "nom",
    text: "Bonjour ! Je vais vous aider à préparer votre dossier médical. Quel est votre nom de famille ?",
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
    options: ["Homme", "Femme", "Autre"],
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
    id: "dureeSymptomes",
    text: "Depuis combien de temps avez-vous ces symptômes ?",
    type: "select",
    options: ["Moins de 24h", "1-3 jours", "1 semaine", "2-4 semaines", "Plus d'un mois"],
    required: true,
    category: "symptomes",
  },

  {
    id: "antecedentsMedicaux",
    text: "Avez-vous des antécédents médicaux ? (Sélectionnez tous ceux qui s'appliquent)",
    type: "multiselect",
    options: [
      "Diabète",
      "Hypertension",
      "Maladie cardiaque",
      "Asthme",
      "Cancer",
      "Dépression/Anxiété",
      "Chirurgies antérieures",
      "Aucun",
      "Autre",
    ],
    required: true,
    category: "antecedents",
  },
  {
    id: "medicamentsActuels",
    text: "Prenez-vous actuellement des médicaments ? Si oui, lesquels ?",
    type: "text",
    required: false,
    category: "medicaments",
  },

  {
    id: "antecedensFamiliaux",
    text: "Y a-t-il des maladies importantes dans votre famille ? (Sélectionnez toutes celles qui s'appliquent)",
    type: "multiselect",
    options: [
      "Diabète",
      "Maladie cardiaque",
      "Cancer",
      "Hypertension",
      "Maladie mentale",
      "Maladie génétique",
      "Aucun antécédent connu",
      "Autre",
    ],
    required: false,
    category: "famille",
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
