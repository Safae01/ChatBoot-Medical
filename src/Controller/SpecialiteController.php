<?php

namespace App\Controller;

use App\Repository\SpecialiteRepository;
use App\Repository\MedecinRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class SpecialiteController extends AbstractController
{
    #[Route('/api/test', name: 'api_test', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'API fonctionne !',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    #[Route('/api/specialites', name: 'api_specialites', methods: ['GET'])]
    public function getSpecialites(SpecialiteRepository $specialiteRepository): JsonResponse
    {
        $specialites = $specialiteRepository->findAll();
        $data = [];
        
        foreach ($specialites as $specialite) {
            $data[] = [
                'id' => $specialite->getId(),
                'nom' => $specialite->getNom(),
                'description' => $specialite->getDescription()
            ];
        }
        
        return new JsonResponse($data);
    }

    #[Route('/api/medecins', name: 'api_medecins', methods: ['GET'])]
    public function getMedecins(MedecinRepository $medecinRepository): JsonResponse
    {
        $medecins = $medecinRepository->findAll();
        $data = [];
        
        foreach ($medecins as $medecin) {
            $data[] = [
                'id' => $medecin->getId(),
                'nom' => $medecin->getNom(),
                'prenom' => $medecin->getPrenom(),
                'email' => $medecin->getEmail(),
                'telephone' => $medecin->getTelephone(),
                'specialite' => [
                    'id' => $medecin->getSpecialite()?->getId(),
                    'nom' => $medecin->getSpecialite()?->getNom()
                ]
            ];
        }
        
        return new JsonResponse($data);
    }

    #[Route('/api/medecins/specialite/{specialiteId}', name: 'api_medecins_by_specialite', methods: ['GET'])]
    public function getMedecinsBySpecialite(int $specialiteId, MedecinRepository $medecinRepository): JsonResponse
    {
        $medecins = $medecinRepository->findBy(['specialite' => $specialiteId]);
        $data = [];
        
        foreach ($medecins as $medecin) {
            $data[] = [
                'id' => $medecin->getId(),
                'nom' => $medecin->getNom(),
                'prenom' => $medecin->getPrenom(),
                'email' => $medecin->getEmail(),
                'telephone' => $medecin->getTelephone(),
                'specialite' => [
                    'id' => $medecin->getSpecialite()?->getId(),
                    'nom' => $medecin->getSpecialite()?->getNom()
                ]
            ];
        }
        
        return new JsonResponse($data);
    }
}
