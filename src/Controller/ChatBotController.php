<?php
// insere patient jdid
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Patient;
use App\Entity\DossierMedical;
use App\Repository\PatientRepository;
use App\Repository\MedecinRepository;
use App\Repository\SpecialiteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ChatBotController extends AbstractController
{
    #[Route('/api/chatbot/patient', name: 'chatbot_patient', methods: ['POST'])]
    public function chatbotPatient(
        Request $request,
        EntityManagerInterface $em,
        PatientRepository $patientRepository,
        MedecinRepository $medecinRepository,
        SpecialiteRepository $specialiteRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $nom = $data['nom'] ?? null;
        $prenom = $data['prenom'] ?? null;
        $symptomes = $data['symptomes'] ?? null;
        $antecedents = $data['antecedents'] ?? null;
        $traitement = $data['traitement'] ?? null;
        $notes = $data['notes'] ?? null;
        $medecinId = $data['medecin_id'] ?? null;
        $specialiteNom = $data['specialite'] ?? null;

        if (!$nom || !$prenom) {
            return new JsonResponse(['error' => 'Nom et prénom sont requis.'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $patientRepository->findOneBy([
            'nom' => $nom,
            'prenom' => $prenom
        ]);

        if (!$patient) {
            $medecin = null;

            if ($medecinId) {
                $medecin = $medecinRepository->find($medecinId);
            } elseif ($specialiteNom) {
                $specialite = $specialiteRepository->findOneBy(['nom' => $specialiteNom]);

                if (!$specialite) {
                    return new JsonResponse(['error' => 'Spécialité introuvable.'], Response::HTTP_BAD_REQUEST);
                }

                $medecins = $specialite->getMedecins()->toArray();

                if (count($medecins) === 0) {
                    return new JsonResponse(['error' => 'Aucun médecin dans cette spécialité.'], Response::HTTP_BAD_REQUEST);
                }

                $medecin = $medecins[array_rand($medecins)];
            }

            if (!$medecin) {
                return new JsonResponse(['error' => 'Aucun médecin défini ou trouvé.'], Response::HTTP_BAD_REQUEST);
            }

            $patient = new Patient();
            $patient->setNom($nom);
            $patient->setPrenom($prenom);
            $patient->setTelephone($data['telephone'] ?? '');
            $patient->setCin($data['cin'] ?? '');
            $patient->setSexe($data['sexe'] ?? '');
            $patient->setAdresse($data['adresse'] ?? '');

            try {
                $date = new \DateTime($data['dateNaissance'] ?? '2000-01-01');
                $patient->setDateNaissance($date);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Date de naissance invalide.'], Response::HTTP_BAD_REQUEST);
            }

            $patient->setMedecinTraitant($medecin);
            $em->persist($patient);
        }

        if (!$patient->getDossierMedical()) {
            $dossier = new DossierMedical();
            $dossier->setSymptomes($symptomes ?? '');
            $dossier->setAntecedents($antecedents ?? '');
            $dossier->setTraitement($traitement ?? '');
            $dossier->setNotes($notes ?? '');
            $dossier->setPatient($patient);

            if ($patient->getMedecinTraitant()) {
                $dossier->addMedecin($patient->getMedecinTraitant());
            }

            $em->persist($dossier);
        }

        $em->flush();

        return new JsonResponse([
            'message' => 'Patient et dossier traités avec succès.',
            'patient_id' => $patient->getId(),
            'medecin_traitant' => $patient->getMedecinTraitant()->getNom(),
        ]);
    }
}
