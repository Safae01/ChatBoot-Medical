import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Stethoscope, Pill, AlertTriangle, Users } from "lucide-react"
import type { PatientData } from "../types/medical"

interface PatientSummaryProps {
  patientData: Partial<PatientData>
}

export function PatientSummary({ patientData }: PatientSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <User className="w-5 h-5" />
          Dossier Médical
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations personnelles */}
        <div>
          <Badge variant="outline" className="mb-2">
            <User className="w-3 h-3 mr-1" />
            Identité
          </Badge>
          <div className="text-sm space-y-1">
            {patientData.nom && (
              <p>
                <strong>Nom:</strong> {patientData.nom}
              </p>
            )}
            {patientData.prenom && (
              <p>
                <strong>Prénom:</strong> {patientData.prenom}
              </p>
            )}
            {patientData.age && (
              <p>
                <strong>Âge:</strong> {patientData.age} ans
              </p>
            )}
            {patientData.sexe && (
              <p>
                <strong>Sexe:</strong> {patientData.sexe}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact */}
        <div>
          <Badge variant="outline" className="mb-2">
            <Phone className="w-3 h-3 mr-1" />
            Contact
          </Badge>
          <div className="text-sm space-y-1">
            {patientData.telephone && (
              <p>
                <strong>Téléphone:</strong> {patientData.telephone}
              </p>
            )}
            {patientData.email && (
              <p>
                <strong>Email:</strong> {patientData.email}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Symptômes */}
        <div>
          <Badge variant="outline" className="mb-2">
            <Stethoscope className="w-3 h-3 mr-1" />
            Symptômes
          </Badge>
          <div className="text-sm space-y-1">
            {patientData.symptomes && (
              <p>
                <strong>Description:</strong> {patientData.symptomes}
              </p>
            )}
            {patientData.dureeSymptomes && (
              <p>
                <strong>Durée:</strong> {patientData.dureeSymptomes}
              </p>
            )}
            {patientData.intensiteDouleur && (
              <p>
                <strong>Intensité douleur:</strong> {patientData.intensiteDouleur}/10
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Médicaments */}
        {patientData.medicamentsActuels && (
          <>
            <div>
              <Badge variant="outline" className="mb-2">
                <Pill className="w-3 h-3 mr-1" />
                Médicaments
              </Badge>
              <div className="text-sm">
                <p>{patientData.medicamentsActuels}</p>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Allergies */}
        {patientData.allergies && patientData.allergies.length > 0 && (
          <>
            <div>
              <Badge variant="outline" className="mb-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Allergies
              </Badge>
              <div className="text-sm">
                <p>{patientData.allergies.join(", ")}</p>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Antécédents familiaux */}
        {patientData.antecedensFamiliaux && patientData.antecedensFamiliaux.length > 0 && (
          <div>
            <Badge variant="outline" className="mb-2">
              <Users className="w-3 h-3 mr-1" />
              Antécédents familiaux
            </Badge>
            <div className="text-sm">
              <p>{patientData.antecedensFamiliaux.join(", ")}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
