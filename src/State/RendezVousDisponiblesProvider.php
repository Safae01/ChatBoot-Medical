<?php
// src/State/RendezVousDisponiblesProvider.php
namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\RendezVousRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class RendezVousDisponiblesProvider implements ProviderInterface
{
    public function __construct(
        private RendezVousRepository $rendezVousRepository
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): iterable
    {
        $medecinId = $uriVariables['id'] ?? null;

        if (!$medecinId) {
            throw new NotFoundHttpException('ID du médecin manquant.');
        }

        // Exemple : on filtre les rendez-vous disponibles par médecin
        return $this->rendezVousRepository->findDisponiblesByMedecin($medecinId);
    }
}
