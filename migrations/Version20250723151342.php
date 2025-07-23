<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250723151342 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE chatbot_reponse (id INT AUTO_INCREMENT NOT NULL, question_id INT NOT NULL, dossier_medical_id INT NOT NULL, reponse LONGTEXT NOT NULL, INDEX IDX_4FA063C1E27F6BF (question_id), INDEX IDX_4FA063C7750B79F (dossier_medical_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE chatbot_reponse ADD CONSTRAINT FK_4FA063C1E27F6BF FOREIGN KEY (question_id) REFERENCES chatbot_question (id)');
        $this->addSql('ALTER TABLE chatbot_reponse ADD CONSTRAINT FK_4FA063C7750B79F FOREIGN KEY (dossier_medical_id) REFERENCES dossier_medical (id)');
        $this->addSql('ALTER TABLE rendez_vous DROP statut');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE chatbot_reponse DROP FOREIGN KEY FK_4FA063C1E27F6BF');
        $this->addSql('ALTER TABLE chatbot_reponse DROP FOREIGN KEY FK_4FA063C7750B79F');
        $this->addSql('DROP TABLE chatbot_reponse');
        $this->addSql('ALTER TABLE rendez_vous ADD statut VARCHAR(255) NOT NULL');
    }
}
