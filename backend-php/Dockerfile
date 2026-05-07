FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . /var/www

# Install composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy existing application directory permissions
RUN chown -R www-data:www-data /var/www

# Change current user to www-data
USER www-data

# Expose port and start Laravel server
EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=$PORT
