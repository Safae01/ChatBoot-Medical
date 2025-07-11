<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250710133647 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `admin` (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, telephone VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE chatbot_question (id INT AUTO_INCREMENT NOT NULL, medecin_id INT NOT NULL, question VARCHAR(255) NOT NULL, INDEX IDX_9CC32E024F31A84 (medecin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dossier_medical (id INT AUTO_INCREMENT NOT NULL, patient_id INT NOT NULL, symptomes LONGTEXT NOT NULL, antecedents LONGTEXT NOT NULL, traitement LONGTEXT NOT NULL, notes LONGTEXT NOT NULL, UNIQUE INDEX UNIQ_3581EE626B899279 (patient_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dossier_medical_medecin (dossier_medical_id INT NOT NULL, medecin_id INT NOT NULL, INDEX IDX_12EE38BC7750B79F (dossier_medical_id), INDEX IDX_12EE38BC4F31A84 (medecin_id), PRIMARY KEY(dossier_medical_id, medecin_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE facturation (id INT AUTO_INCREMENT NOT NULL, patient_id INT NOT NULL, admin_user_id INT NOT NULL, montant DOUBLE PRECISION NOT NULL, date_facture DATETIME NOT NULL, methode_paiement VARCHAR(255) NOT NULL, etat VARCHAR(255) NOT NULL, INDEX IDX_17EB513A6B899279 (patient_id), INDEX IDX_17EB513A6352511C (admin_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE fichier_medical (id INT AUTO_INCREMENT NOT NULL, dossier_medical_id INT NOT NULL, nom VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, date_ajout DATETIME NOT NULL, INDEX IDX_AC48FB6D7750B79F (dossier_medical_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE medecin (id INT AUTO_INCREMENT NOT NULL, specialite_id INT DEFAULT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, telephone VARCHAR(255) NOT NULL, INDEX IDX_1BDA53C62195E0F0 (specialite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE patient (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, telephone VARCHAR(255) NOT NULL, date_naissance DATE NOT NULL, adresse VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rendez_vous (id INT AUTO_INCREMENT NOT NULL, patient_id INT NOT NULL, medecin_id INT NOT NULL, date DATETIME NOT NULL, statut VARCHAR(255) NOT NULL, motif LONGTEXT NOT NULL, INDEX IDX_65E8AA0A6B899279 (patient_id), INDEX IDX_65E8AA0A4F31A84 (medecin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE specialite (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE chatbot_question ADD CONSTRAINT FK_9CC32E024F31A84 FOREIGN KEY (medecin_id) REFERENCES medecin (id)');
        $this->addSql('ALTER TABLE dossier_medical ADD CONSTRAINT FK_3581EE626B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE dossier_medical_medecin ADD CONSTRAINT FK_12EE38BC7750B79F FOREIGN KEY (dossier_medical_id) REFERENCES dossier_medical (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dossier_medical_medecin ADD CONSTRAINT FK_12EE38BC4F31A84 FOREIGN KEY (medecin_id) REFERENCES medecin (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE facturation ADD CONSTRAINT FK_17EB513A6B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE facturation ADD CONSTRAINT FK_17EB513A6352511C FOREIGN KEY (admin_user_id) REFERENCES `admin` (id)');
        $this->addSql('ALTER TABLE fichier_medical ADD CONSTRAINT FK_AC48FB6D7750B79F FOREIGN KEY (dossier_medical_id) REFERENCES dossier_medical (id)');
        $this->addSql('ALTER TABLE medecin ADD CONSTRAINT FK_1BDA53C62195E0F0 FOREIGN KEY (specialite_id) REFERENCES specialite (id)');
        $this->addSql('ALTER TABLE rendez_vous ADD CONSTRAINT FK_65E8AA0A6B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE rendez_vous ADD CONSTRAINT FK_65E8AA0A4F31A84 FOREIGN KEY (medecin_id) REFERENCES medecin (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE chatbot_question DROP FOREIGN KEY FK_9CC32E024F31A84');
        $this->addSql('ALTER TABLE dossier_medical DROP FOREIGN KEY FK_3581EE626B899279');
        $this->addSql('ALTER TABLE dossier_medical_medecin DROP FOREIGN KEY FK_12EE38BC7750B79F');
        $this->addSql('ALTER TABLE dossier_medical_medecin DROP FOREIGN KEY FK_12EE38BC4F31A84');
        $this->addSql('ALTER TABLE facturation DROP FOREIGN KEY FK_17EB513A6B899279');
        $this->addSql('ALTER TABLE facturation DROP FOREIGN KEY FK_17EB513A6352511C');
        $this->addSql('ALTER TABLE fichier_medical DROP FOREIGN KEY FK_AC48FB6D7750B79F');
        $this->addSql('ALTER TABLE medecin DROP FOREIGN KEY FK_1BDA53C62195E0F0');
        $this->addSql('ALTER TABLE rendez_vous DROP FOREIGN KEY FK_65E8AA0A6B899279');
        $this->addSql('ALTER TABLE rendez_vous DROP FOREIGN KEY FK_65E8AA0A4F31A84');
        $this->addSql('DROP TABLE `admin`');
        $this->addSql('DROP TABLE chatbot_question');
        $this->addSql('DROP TABLE dossier_medical');
        $this->addSql('DROP TABLE dossier_medical_medecin');
        $this->addSql('DROP TABLE facturation');
        $this->addSql('DROP TABLE fichier_medical');
        $this->addSql('DROP TABLE medecin');
        $this->addSql('DROP TABLE patient');
        $this->addSql('DROP TABLE rendez_vous');
        $this->addSql('DROP TABLE specialite');
    }
}
