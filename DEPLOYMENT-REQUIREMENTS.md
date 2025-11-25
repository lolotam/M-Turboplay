# M-TurboPlay Deployment Guide 🚀

This guide provides step-by-step instructions for deploying the M-TurboPlay e-commerce platform to production.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   User Browser  │────│  Nginx (SSL) │────│ React App   │
└─────────────────┘    └──────────────┘    └─────────────┘
                                                      │
                       ┌─────────────────┐          │
                       │   Supabase      │◄─────────┘
                       │ (Backend/API)   │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │     Stripe      │
                       │ (Payments)      │
                       └─────────────────┘
```

## 🖥️ Server Requirements

### Minimum Specifications
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: 2GB (4GB+ recommended)
- **Storage**: 20GB SSD (50GB+ recommended)
- **CPU**: 2 vCPU (4+ recommended)
- **Network**: 100 Mbps+ connection

### Software Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Domain name (for SSL)

## 🌐 Domain Configuration

### DNS Settings
Configure these DNS records for your domain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_SERVER_IP | 1h |
| A | www | YOUR_SERVER_IP | 1h |
| CNAME | api | m-turboplay.com | 1h |

### SSL Certificate
The deployment uses Let's Encrypt for free SSL certificates.

## 🚀 Production Deployment Steps

### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl wget docker.io docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional but recommended)
sudo usermod -aG docker $USER

# Re-login to apply docker group changes
```

### 2. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/lolotam/M-Turboplay.git
cd M-Turboplay

# Create production environment file
cp .env.production .env
```

### 3. Environment Configuration

Edit the `.env` file with your production values:

```bash
nano .env
```

```env
# Supabase Configuration (Production)
VITE_SUPABASE_PROJECT_ID=your_production_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_production_supabase_anon_key
VITE_SUPABASE_URL=https://your-project.supabase.co

# Stripe Configuration (Production - LIVE KEYS)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_publishable_key

# API Configuration
VITE_API_URL=https://api.m-turboplay.com
VITE_SITE_URL=https://m-turboplay.com

# Admin Configuration
VITE_ADMIN_EMAIL=admin@m-turboplay.com

# EmailJS Configuration (Optional)
VITE_EMAILJS_SERVICE_ID=your_production_service_id
VITE_EMAILJS_TEMPLATE_ID=your_production_template_id
VITE_EMAILJS_PUBLIC_KEY=your_production_public_key
```

### 4. Docker Configuration

The `docker-compose.prod.yml` file includes:

- **Nginx**: Reverse proxy with SSL termination
- **Frontend**: React production build
- **SSL**: Let's Encrypt certificate management
- **Security**: Headers and HTTPS redirection

### 5. SSL Certificate Setup

First, generate SSL certificates using Certbot:

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot certonly --nginx -d m-turboplay.com -d www.m-turboplay.com

# Copy certificates to project directory
sudo mkdir -p ./nginx/ssl
sudo cp /etc/letsencrypt/live/m-turboplay.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/m-turboplay.com/privkey.pem ./nginx/ssl/

# Set correct permissions
sudo chown -R $USER:$USER ./nginx/ssl/
```

### 6. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 7. Verify Deployment

After deployment, verify:

1. **HTTP to HTTPS Redirect**: `http://m-turboplay.com` should redirect to HTTPS
2. **SSL Certificate**: Check certificate validity in browser
3. **Application Loading**: App should load without errors
4. **API Connectivity**: Check browser console for API errors

## 🔧 Configuration Files

### Nginx Configuration (`nginx.conf`)
- SSL termination
- HTTP to HTTPS redirect
- Static file serving
- Security headers
- GZIP compression

### Docker Compose Production (`docker-compose.prod.yml`)
- Multi-stage build for optimized production image
- Nginx reverse proxy
- Volume mounting for SSL certificates
- Port mapping and networking

### Dockerfile
- Production-optimized Node.js image
- Multi-stage build process
- Asset optimization and compression

## 🔒 Security Measures

### Network Security
- HTTPS enforced on all connections
- Security headers configured
- CORS policies implemented
- Rate limiting (Nginx)

### Application Security
- Environment variables for sensitive data
- Input validation and sanitization
- SQL injection prevention (Supabase RLS)
- XSS protection with Content Security Policy

### SSL/TLS Security
- Let's Encrypt certificates (auto-renewal)
- TLS 1.2+ only
- Strong cipher suites
- HSTS headers

## 📊 Monitoring and Maintenance

### Health Checks

```bash
# Check container health
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
docker-compose -f docker-compose.prod.yml exec frontend curl http://localhost:3000

# Check SSL certificate expiry
sudo certbot certificates
```

### Log Management

```bash
# View Nginx access logs
docker-compose -f docker-compose.prod.yml logs nginx

# View application logs
docker-compose -f docker-compose.prod.yml logs frontend

# Rotate logs (add to crontab)
docker-compose -f docker-compose.prod.yml logs --tail=1000
```

### Updates and Maintenance

```bash
# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Renew SSL certificates (add to crontab - monthly)
sudo certbot renew --nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 🚨 Troubleshooting

### Common Issues

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Force certificate renewal
sudo certbot renew --force-renewal

# Check Nginx configuration
sudo nginx -t
```

#### Application Not Loading
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check container logs
docker-compose -f docker-compose.prod.yml logs frontend

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

#### API Connection Issues
1. Verify Supabase project URL and keys in `.env`
2. Check Supabase dashboard for any service issues
3. Verify CORS settings in Supabase project
4. Check browser console for specific error messages

### Performance Optimization

#### Caching
- Static assets cached in Nginx
- Browser caching headers configured
- CDN recommended for global scaling

#### Database Optimization
- Supabase automatically handles scaling
- Monitor query performance in Supabase dashboard
- Implement database indexes if needed

## 🔄 Backup Strategy

### Database Backups
- Supabase provides automatic daily backups
- Enable point-in-time recovery in Supabase dashboard
- Export data regularly using Supabase export tool

### File Backups
```bash
# Backup SSL certificates
sudo cp -r ./nginx/ssl/ ./backups/ssl-$(date +%Y%m%d)/

# Backup configuration files
tar -czf ./backups/config-$(date +%Y%m%d).tar.gz .env nginx.conf
```

## 📱 Scaling Considerations

### Horizontal Scaling
- Deploy multiple frontend containers
- Use Docker Swarm or Kubernetes for orchestration
- Implement load balancing

### CDN Integration
- Use Cloudflare or AWS CloudFront
- Configure static asset delivery
- Implement DDoS protection

### Database Scaling
- Supabase Pro tier for higher limits
- Read replicas for improved performance
- Connection pooling

## 🛠️ Development Workflow

### Staging Environment
Deploy to a staging environment first:

```bash
# Use staging compose file
docker-compose -f docker-compose.staging.yml up -d
```

### CI/CD Pipeline
Implement automated deployment:
1. GitHub Actions for testing
2. Automated builds on push to main
3. Automated deployment to staging
4. Manual approval for production deployment

---

For additional support, please refer to:
- [GitHub Issues](https://github.com/lolotam/M-Turboplay/issues)
- Email: support@m-turboplay.com

**Deployment Status**: ✅ Production Ready