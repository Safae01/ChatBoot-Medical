<?php

namespace App\Entity;

use App\Entity\RendezVous;
use App\Entity\DossierMedical;
use App\Entity\Specialite;
use App\Entity\User;
use App\Repository\MedecinRepository;
use App\State\RendezVousDisponiblesProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource]
#[GetCollection(
    uriTemplate: '/medecins/{id}/rendezvous-disponibles',
    requirements: ['id' => '\d+'],
    name: 'rendezvous_disponibles_par_medecin',
    provider: RendezVousDisponiblesProvider::class,
    output: RendezVous::class
)]
#[ORM\Entity(repositoryClass: MedecinRepository::class)]
class Medecin
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $prenom = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $telephone = null;

    #[ORM\OneToOne(inversedBy: 'medecin', cascade: ['persist', 'remove'])]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'medecins')]
    private ?Specialite $specialite = null;

    #[ORM\ManyToMany(targetEntity: DossierMedical::class, mappedBy: 'medecins')]
    private Collection $dossierMedicals;

    #[ORM\OneToMany(targetEntity: RendezVous::class, mappedBy: 'medecin')]
    private Collection $rendezVous;

    public function __construct()
    {
        $this->dossierMedicals = new ArrayCollection();
        $this->rendezVous = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): static
    {
        $this->telephone = $telephone;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getSpecialite(): ?Specialite
    {
        return $this->specialite;
    }

    public function setSpecialite(?Specialite $specialite): static
    {
        $this->specialite = $specialite;
        return $this;
    }

    /**
     * @return Collection<int, DossierMedical>
     */
    public function getDossierMedicals(): Collection
    {
        return $this->dossierMedicals;
    }

    public function addDossierMedical(DossierMedical $dossierMedical): static
    {
        if (!$this->dossierMedicals->contains($dossierMedical)) {
            $this->dossierMedicals->add($dossierMedical);
            $dossierMedical->addMedecin($this);
        }
        return $this;
    }

    public function removeDossierMedical(DossierMedical $dossierMedical): static
    {
        if ($this->dossierMedicals->removeElement($dossierMedical)) {
            $dossierMedical->removeMedecin($this);
        }
        return $this;
    }

    /**
     * @return Collection<int, RendezVous>
     */
    public function getRendezVous(): Collection
    {
        return $this->rendezVous;
    }

    public function addRendezVous(RendezVous $rendezVous): static
    {
        if (!$this->rendezVous->contains($rendezVous)) {
            $this->rendezVous->add($rendezVous);
            $rendezVous->setMedecin($this);
        }
        return $this;
    }

    public function removeRendezVous(RendezVous $rendezVous): static
    {
        if ($this->rendezVous->removeElement($rendezVous)) {
            if ($rendezVous->getMedecin() === $this) {
                $rendezVous->setMedecin(null);
            }
        }
        return $this;
    }
}
