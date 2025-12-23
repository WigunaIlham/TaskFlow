#!/bin/bash

# TaskFlow Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
SERVER_IP="your-server-ip"
SERVER_USER="ubuntu"
PROJECT_DIR="/var/www/taskflow"
BRANCH="main"

echo "🚀 Deploying TaskFlow to $ENVIRONMENT..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function for colored output
print_message() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] WARNING:${NC} $1"
}

# Validate environment
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    print_error "Invalid environment. Use 'production' or 'staging'"
    exit 1
fi

print_message "Starting deployment to $ENVIRONMENT..."

# Step 1: Pull latest code
print_message "Pulling latest code from $BRANCH branch..."
git pull origin $BRANCH

# Step 2: Install PHP dependencies
print_message "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# Step 3: Install Node dependencies
print_message "Installing Node dependencies..."
npm ci --only=production

# Step 4: Build assets
print_message "Building assets..."
npm run build

# Step 5: Update environment
print_message "Updating environment configuration..."
if [[ "$ENVIRONMENT" == "production" ]]; then
    cp .env.production .env
else
    cp .env.staging .env
fi

# Step 6: Generate application key
if [[ ! -f .env ]]; then
    print_error ".env file not found!"
    exit 1
fi

if grep -q "^APP_KEY=$" .env; then
    print_message "Generating application key..."
    php artisan key:generate
fi

# Step 7: Run database migrations
print_message "Running database migrations..."
php artisan migrate --force

# Step 8: Clear cache
print_message "Clearing cache..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 9: Set permissions
print_message "Setting file permissions..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Step 10: Generate PWA assets
print_message "Generating PWA assets..."
npm run pwa-assets

# Step 11: Restart services
print_message "Restarting PHP-FPM..."
sudo systemctl restart php8.3-fpm

print_message "Restarting Nginx..."
sudo systemctl restart nginx

# Step 12: Clear queue (if any)
print_message "Clearing queues..."
php artisan queue:restart

# Step 13: Health check
print_message "Performing health check..."
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health || echo "000")

if [[ "$HTTP_STATUS" == "200" ]]; then
    print_message "✅ Deployment successful! Health check passed."
else
    print_error "❌ Health check failed with status: $HTTP_STATUS"
    print_error "Check the application logs for details."
    exit 1
fi

# Step 14: Send notification (optional)
print_message "Sending deployment notification..."
if command -v curl &> /dev/null; then
    curl -X POST -H "Content-Type: application/json" \
         -d "{\"text\":\"TaskFlow deployed successfully to $ENVIRONMENT\"}" \
         $WEBHOOK_URL 2>/dev/null || true
fi

print_message "🎉 Deployment completed successfully!"
print_message "Application URL: https://$SERVER_IP"
print_message "Admin URL: https://$SERVER_IP/admin"