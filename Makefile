install:
	docker compose exec symfony composer install

start:
	docker compose up -d

stop:
	docker compose down

enter:
	docker compose exec symfony bash

migrate:
	docker compose exec symfony php bin/console doctrine:migrations:migrate --no-interaction

cache-clear:
	docker compose exec symfony php bin/console cache:clear
