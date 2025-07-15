<?php

namespace App\Entity;

use App\Repository\DossierMedicalRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: DossierMedicalRepository::class)]
class DossierMedical
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $symptomes = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $antecedents = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $traitement = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $notes = null;

    #[ORM\OneToOne(inversedBy: 'dossierMedical', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    /**
     * @var Collection<int, Medecin>
     */
    #[ORM\ManyToMany(targetEntity: Medecin::class, inversedBy: 'dossierMedicals')]
    private Collection $medecins;

    /**
     * @var Collection<int, FichierMedical>
     */
    #[ORM\OneToMany(targetEntity: FichierMedical::class, mappedBy: 'dossierMedical')]
    private Collection $fichierMedicals;

    public function __construct()
    {
        $this->medecins = new ArrayCollection();
        $this->fichierMedicals = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSymptomes(): ?string
    {
        return $this->symptomes;
    }

    public function setSymptomes(string $symptomes): static
    {
        $this->symptomes = $symptomes;

        return $this;
    }

    public function getAntecedents(): ?string
    {
        return $this->antecedents;
    }

    public function setAntecedents(string $antecedents): static
    {
        $this->antecedents = $antecedents;

        return $this;
    }

    public function getTraitement(): ?string
    {
        return $this->traitement;
    }

    public function setTraitement(string $traitement): static
    {
        $this->traitement = $traitement;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(Patient $patient): static
    {
        $this->patient = $patient;

        return $this;
    }

    /**
     * @return Collection<int, Medecin>
     */
    public function getMedecins(): Collection
    {
        return $this->medecins;
    }

    public function addMedecin(Medecin $medecin): static
    {
        if (!$this->medecins->contains($medecin)) {
            $this->medecins->add($medecin);
        }

        return $this;
    }

    public function removeMedecin(Medecin $medecin): static
    {
        $this->medecins->removeElement($medecin);

        return $this;
    }

    /**
     * @return Collection<int, FichierMedical>
     */
    public function getFichierMedicals(): Collection
    {
        return $this->fichierMedicals;
    }

    public function addFichierMedical(FichierMedical $fichierMedical): static
    {
        if (!$this->fichierMedicals->contains($fichierMedical)) {
            $this->fichierMedicals->add($fichierMedical);
            $fichierMedical->setDossierMedical($this);
        }

        return $this;
    }

    public function removeFichierMedical(FichierMedical $fichierMedical): static
    {
        if ($this->fichierMedicals->removeElement($fichierMedical)) {
            // set the owning side to null (unless already changed)
            if ($fichierMedical->getDossierMedical() === $this) {
                $fichierMedical->setDossierMedical(null);
            }
        }

        return $this;
    }
}
