<?php
namespace App\Service;

use App\Entity\Specialite;
use App\Repository\MedecinRepository;

class MedecinSelector
{
    public function __construct(private MedecinRepository $medecinRepository) {}

    public function choisirMedecinParDefaut(Specialite $specialite): ?object
    {
        $medecins = $this->medecinRepository->findBy(['specialite' => $specialite]);
        if (count($medecins) === 0) return null;
        return $medecins[array_rand($medecins)];
    }
}
