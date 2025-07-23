<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250723153741 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE chatbot_question DROP FOREIGN KEY FK_9CC32E024F31A84');
        $this->addSql('DROP INDEX IDX_9CC32E024F31A84 ON chatbot_question');
        $this->addSql('ALTER TABLE chatbot_question CHANGE medecin_id specialite_id INT NOT NULL');
        $this->addSql('ALTER TABLE chatbot_question ADD CONSTRAINT FK_9CC32E022195E0F0 FOREIGN KEY (specialite_id) REFERENCES specialite (id)');
        $this->addSql('CREATE INDEX IDX_9CC32E022195E0F0 ON chatbot_question (specialite_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE chatbot_question DROP FOREIGN KEY FK_9CC32E022195E0F0');
        $this->addSql('DROP INDEX IDX_9CC32E022195E0F0 ON chatbot_question');
        $this->addSql('ALTER TABLE chatbot_question CHANGE specialite_id medecin_id INT NOT NULL');
        $this->addSql('ALTER TABLE chatbot_question ADD CONSTRAINT FK_9CC32E024F31A84 FOREIGN KEY (medecin_id) REFERENCES medecin (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_9CC32E024F31A84 ON chatbot_question (medecin_id)');
    }
}
