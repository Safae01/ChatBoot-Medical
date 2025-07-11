FROM php:8.2-fpm

RUN apt-get update && apt-get install -y libzip-dev zip unzip \
    && docker-php-ext-install pdo_mysql zip

WORKDIR /var/www/html

# Copier la config php si tu en as (facultatif)
COPY ./infra/php/config/php.ini /usr/local/etc/php/php.ini
COPY ./infra/php/php-fpm.d/www.conf /usr/local/etc/php-fpm.d/www.conf
