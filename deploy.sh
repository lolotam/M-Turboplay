#!/bin/bash

# M-TurboPlay Production Deployment Script
# Server: 69.62.112.36
# Domain: m-turboplay.com

set -e

echo "🚀 Starting M-TurboPlay deployment..."

# Variables
DOMAIN="m-turboplay.com"
APP_NAME="m-turboplay"
REPO_URL="https://github.com/lolotam/M-Turboplay.git"
APP_DIR="/opt/${APP_NAME}"
BACKUP_DIR="/opt/backups/${APP_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Update system packages
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    log "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    log "Docker installed. Please log out and log back in to use Docker without sudo."
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    log "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create application directory
log "Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Create backup directory
sudo mkdir -p $BACKUP_DIR
sudo chown $USER:$USER $BACKUP_DIR

# Backup existing deployment if it exists
if [ -d "$APP_DIR/.git" ]; then
    log "Creating backup of current deployment..."
    BACKUP_NAME="${APP_NAME}-$(date +%Y%m%d-%H%M%S)"
    sudo cp -r $APP_DIR $BACKUP_DIR/$BACKUP_NAME
    log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
fi

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    log "Updating repository..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
else
    log "Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Create production environment file
log "Setting up production environment..."
if [ ! -f "$APP_DIR/.env.production" ]; then
    warn "Production environment file not found. Please configure .env.production manually."
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    log "Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl enable nginx
fi

# Install Certbot for SSL certificates
if ! command -v certbot &> /dev/null; then
    log "Installing Certbot..."
    sudo apt install snapd -y
    sudo snap install core; sudo snap refresh core
    sudo snap install --classic certbot
    sudo ln -s /snap/bin/certbot /usr/bin/certbot
fi

# Stop existing containers if running
log "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

# Build and start new containers
log "Building and starting containers..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Obtain SSL certificate
log "Setting up SSL certificate..."
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    log "Obtaining SSL certificate for $DOMAIN..."
    sudo certbot certonly --standalone --agree-tos --no-eff-email \
        --email admin@$DOMAIN -d $DOMAIN -d www.$DOMAIN
else
    log "SSL certificate already exists. Renewing if necessary..."
    sudo certbot renew --quiet
fi

# Set up automatic certificate renewal
log "Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Configure firewall
log "Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

# Set up log rotation
log "Setting up log rotation..."
sudo tee /etc/logrotate.d/$APP_NAME > /dev/null <<EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 \$(cat /var/run/nginx.pid)
        fi
    endscript
}
EOF

# Health check
log "Performing health check..."
sleep 30

# Check if containers are running
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    error "Some containers failed to start. Check logs with: docker-compose -f docker-compose.prod.yml logs"
fi

# Check if the website is accessible
if curl -f -s https://$DOMAIN/health > /dev/null; then
    log "✅ Health check passed! Website is accessible."
else
    warn "Health check failed. Website may not be accessible yet."
fi

# Display deployment info
log "🎉 Deployment completed!"
echo ""
echo "📊 Deployment Summary:"
echo "  🌐 Domain: https://$DOMAIN"
echo "  📁 App Directory: $APP_DIR"
echo "  🔄 Backup Directory: $BACKUP_DIR"
echo "  🐳 Docker Containers: $(docker-compose -f docker-compose.prod.yml ps --services | tr '\n' ', ' | sed 's/,$//')"
echo ""
echo "🔧 Useful Commands:"
echo "  📊 View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  🔄 Restart: docker-compose -f docker-compose.prod.yml restart"
echo "  ⬇️ Stop: docker-compose -f docker-compose.prod.yml down"
echo "  🔍 Status: docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "✨ M-TurboPlay is now live at https://$DOMAIN"