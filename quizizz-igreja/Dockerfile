FROM php:8.2-apache

# Instala dependências do sistema e extensões do PHP
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define a pasta de trabalho
WORKDIR /var/www/html

# Copia os arquivos do projeto
COPY . .

# Instala as dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Ajusta permissões para o Laravel
RUN chown -w /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Habilita o mod_rewrite do Apache (necessário para o Laravel)
RUN a2enmod rewrite

# Altera o DocumentRoot do Apache para a pasta /public do Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Expondo a porta
EXPOSE 80

# Comando para rodar as migrations e ligar o servidor
CMD php artisan migrate --force && apache2-foreground

# Para construir a imagem, use:
