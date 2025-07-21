<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250716115210 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE patient ADD medecin_traitant_id INT NOT NULL, ADD cin VARCHAR(20) NOT NULL, ADD sexe VARCHAR(10) NOT NULL, DROP email');
        $this->addSql('ALTER TABLE patient ADD CONSTRAINT FK_1ADAD7EBB572964A FOREIGN KEY (medecin_traitant_id) REFERENCES medecin (id)');
        $this->addSql('CREATE INDEX IDX_1ADAD7EBB572964A ON patient (medecin_traitant_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE patient DROP FOREIGN KEY FK_1ADAD7EBB572964A');
        $this->addSql('DROP INDEX IDX_1ADAD7EBB572964A ON patient');
        $this->addSql('ALTER TABLE patient ADD email VARCHAR(255) NOT NULL, DROP medecin_traitant_id, DROP cin, DROP sexe');
    }
}
