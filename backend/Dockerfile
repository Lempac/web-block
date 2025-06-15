FROM php:8.4-fpm-alpine AS backend

WORKDIR /var/www/

RUN apk add --no-cache sqlite libzip-dev && \
    docker-php-ext-install zip

COPY . .

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Encrypt the .env file (this step should be done locally before building the image)
COPY .env.production.encrypted /var/www/.env.encrypted

# Copy .env.example to .env if .env does not exist
# RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Generate application key
# RUN php artisan key:generate

# Set environment variables for PHP settings
ENV PHP_UPLOAD_MAX_FILESIZE=200M
ENV PHP_POST_MAX_SIZE=200M

# Alternatively, you can modify the php.ini settings directly
RUN { \
    echo 'upload_max_filesize = '"$PHP_UPLOAD_MAX_FILESIZE"; \
    echo 'post_max_size = '"$PHP_POST_MAX_SIZE"; \
} > /usr/local/etc/php/conf.d/uploads.ini

RUN php artisan storage:link

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# RUN php artisan optimize -e config

RUN php artisan vendor:publish --tag=laravel-assets --force

EXPOSE 8000 465 

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl --fail localhost:8000/up || exit 1


CMD ["sh", "-c", "php artisan env:decrypt --force --key=$ENCRYPTION_KEY && php -S 0.0.0.0:8000 -t public"]