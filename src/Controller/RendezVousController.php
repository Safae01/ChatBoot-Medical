<?php

namespace App\Controller;

use App\Repository\RendezVousRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RendezVousController extends AbstractController
{
    #[Route('/api/rendezvous/disponibles', name: 'rendezvous_disponibles', methods: ['GET'])]
    public function rendezvousDisponibles(Request $request, RendezVousRepository $rendezVousRepository): JsonResponse
    {
        $medecinId = $request->query->get('medecin_id');
        $specialiteId = $request->query->get('specialite_id');

        $rendezVous = [];

        if ($medecinId) {
            $rendezVous = $rendezVousRepository->findBy([
                'disponible' => true,
                'medecin' => $medecinId,
            ]);
        }

        // Optionnel : si tu veux aussi chercher par spécialité
        if (!$medecinId && $specialiteId) {
            $rendezVous = $rendezVousRepository->findDisponiblesParSpecialite($specialiteId);
        }

        return $this->json($rendezVous);
    }
}