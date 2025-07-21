<?php

namespace App\Repository;

use App\Entity\RendezVous;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RendezVous>
 */
class RendezVousRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RendezVous::class);
    }
    // src/Repository/RendezVousRepository.php

public function findDisponiblesParSpecialite(int $specialiteId): array
{
    return $this->createQueryBuilder('r')
        ->join('r.medecin', 'm')
        ->join('m.specialite', 's')
        ->where('r.disponible = :val')
        ->andWhere('s.id = :specialiteId')
        ->setParameter('val', true)
        ->setParameter('specialiteId', $specialiteId)
        ->getQuery()
        ->getResult();
}
public function findDisponiblesByMedecin(int $medecinId): array
{
    return $this->createQueryBuilder('r')
        ->andWhere('r.medecin = :medecinId')
        ->andWhere('r.patient IS NULL') // créneau libre
        ->setParameter('medecinId', $medecinId)
        ->getQuery()
        ->getResult();
}


//    /**
//     * @return RendezVous[] Returns an array of RendezVous objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?RendezVous
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
