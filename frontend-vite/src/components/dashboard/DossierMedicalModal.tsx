import React from "react"
import { X, User, Calendar, Phone, Mail, MapPin, Heart, Pill, AlertTriangle, Users as FamilyIcon, FileText } from "lucide-react"

interface DossierMedicalModalProps {
  isOpen: boolean
  onClose: () => void
  patient: any
}

// Données d'exemple pour le dossier médical
const getDossierMedical = (patientId: number) => ({
  informationsPersonnelles: {
    nom: "Dupont",
    prenom: "Paul",
    age: 45,
    sexe: "Masculin",
    dateNaissance: "15/03/1979",
    telephone: "01.23.45.67.89",
    email: "paul.dupont@email.com",
    adresse: "123 Rue de la Paix, 75001 Paris"
  },
  informationsMedicales: {
    groupeSanguin: "O+",
    poids: "78 kg",
    taille: "175 cm",
    medecinTraitant: "Dr. Martin"
  },
  antecedentsMedicaux: [
    "Hypertension artérielle (2018)",
    "Fracture du poignet droit (2020)",
    "Appendicectomie (2015)"
  ],
  allergies: [
    "Pénicilline",
    "Pollen de bouleau",
    "Fruits de mer"
  ],
  medicamentsActuels: [
    {
      nom: "Lisinopril",
      dosage: "10mg",
      frequence: "1 fois par jour",
      depuis: "2018"
    },
    {
      nom: "Aspirine",
      dosage: "75mg",
      frequence: "1 fois par jour",
      depuis: "2019"
    }
  ],
  antecedensFamiliaux: [
    "Diabète type 2 (père)",
    "Maladie cardiaque (mère)",
    "Cancer du sein (tante maternelle)"
  ],
  derniersRendezVous: [
    {
      date: "10/01/2024",
      medecin: "Dr. Martin",
      motif: "Consultation de routine",
      diagnostic: "Tension artérielle stable",
      traitement: "Continuer le traitement actuel"
    },
    {
      date: "15/12/2023",
      medecin: "Dr. Dubois",
      motif: "Douleur thoracique",
      diagnostic: "Stress, pas de problème cardiaque",
      traitement: "Repos et gestion du stress"
    }
  ],
  examens: [
    {
      date: "05/01/2024",
      type: "Prise de sang",
      resultats: "Cholestérol légèrement élevé",
      medecin: "Dr. Martin"
    },
    {
      date: "20/12/2023",
      type: "ECG",
      resultats: "Normal",
      medecin: "Dr. Dubois"
    }
  ]
})

export function DossierMedicalModal({ isOpen, onClose, patient }: DossierMedicalModalProps) {
  if (!isOpen || !patient) return null

  const dossier = getDossierMedical(patient.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Dossier Médical - {dossier.informationsPersonnelles.prenom} {dossier.informationsPersonnelles.nom}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-8">
            {/* Informations personnelles */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations Personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Nom complet:</span>
                    <span>{dossier.informationsPersonnelles.prenom} {dossier.informationsPersonnelles.nom}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Date de naissance:</span>
                    <span>{dossier.informationsPersonnelles.dateNaissance} ({dossier.informationsPersonnelles.age} ans)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Sexe:</span>
                    <span>{dossier.informationsPersonnelles.sexe}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Téléphone:</span>
                    <span>{dossier.informationsPersonnelles.telephone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Email:</span>
                    <span>{dossier.informationsPersonnelles.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Adresse:</span>
                    <span>{dossier.informationsPersonnelles.adresse}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations médicales */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Informations Médicales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="font-medium text-green-800">Groupe sanguin:</span>
                  <p className="text-green-700">{dossier.informationsMedicales.groupeSanguin}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Poids:</span>
                  <p className="text-green-700">{dossier.informationsMedicales.poids}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Taille:</span>
                  <p className="text-green-700">{dossier.informationsMedicales.taille}</p>
                </div>
                <div>
                  <span className="font-medium text-green-800">Médecin traitant:</span>
                  <p className="text-green-700">{dossier.informationsMedicales.medecinTraitant}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Antécédents médicaux */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Antécédents Médicaux
                </h3>
                <ul className="space-y-2">
                  {dossier.antecedentsMedicaux.map((antecedent, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-yellow-800">{antecedent}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Allergies */}
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Allergies
                </h3>
                <ul className="space-y-2">
                  {dossier.allergies.map((allergie, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-red-800 font-medium">{allergie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Médicaments actuels */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <Pill className="w-5 h-5 mr-2" />
                Médicaments Actuels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dossier.medicamentsActuels.map((medicament, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900">{medicament.nom}</h4>
                    <p className="text-purple-700">Dosage: {medicament.dosage}</p>
                    <p className="text-purple-700">Fréquence: {medicament.frequence}</p>
                    <p className="text-purple-600 text-sm">Depuis: {medicament.depuis}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Antécédents familiaux */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <FamilyIcon className="w-5 h-5 mr-2" />
                Antécédents Familiaux
              </h3>
              <ul className="space-y-2">
                {dossier.antecedensFamiliaux.map((antecedent, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-indigo-800">{antecedent}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Derniers rendez-vous */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Derniers Rendez-vous
              </h3>
              <div className="space-y-4">
                {dossier.derniersRendezVous.map((rdv, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{rdv.date} - {rdv.medecin}</h4>
                      <span className="text-sm text-gray-600">{rdv.motif}</span>
                    </div>
                    <p className="text-gray-700 mb-1"><strong>Diagnostic:</strong> {rdv.diagnostic}</p>
                    <p className="text-gray-700"><strong>Traitement:</strong> {rdv.traitement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Examens récents */}
            <div className="bg-teal-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Examens Récents
              </h3>
              <div className="space-y-4">
                {dossier.examens.map((examen, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-teal-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-teal-900">{examen.type}</h4>
                      <span className="text-sm text-teal-600">{examen.date}</span>
                    </div>
                    <p className="text-teal-700 mb-1"><strong>Résultats:</strong> {examen.resultats}</p>
                    <p className="text-teal-600 text-sm">Prescrit par: {examen.medecin}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Fermer le dossier
          </button>
        </div>
      </div>
    </div>
  )
}
