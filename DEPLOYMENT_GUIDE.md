# GrowAgarden Deployment Guide

## Server Details
- **Server IP**: 69.62.112.36
- **Port**: 8081
- **Access URL**: http://69.62.112.36:8081

## Manual Deployment Steps

### Step 1: Connect to your SSH server

```bash
ssh your_username@69.62.112.36
```

### Step 2: Create directory and clone repository

```bash
# Navigate to home directory
cd ~

# Create and enter the GrowAgarden directory
mkdir -p GrowAgarden
cd GrowAgarden

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/yourusername/GrowAgarden.git .
# OR if you want to copy from local:
# Use SCP or SFTP to transfer files
```

### Step 3: Set up environment variables

```bash
# Copy the example env file
cp .env.example .env

# Edit the .env file with your Supabase credentials
nano .env
```

Add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Build and run Docker container

```bash
# Build the Docker image
docker build -t growagarden .

# Run using docker-compose
docker-compose up -d

# OR run directly with docker
docker run -d \
  --name GrowAgarden \
  -p 8081:8081 \
  --env-file .env \
  --restart unless-stopped \
  growagarden
```

### Step 5: Verify deployment

```bash
# Check if container is running
docker ps | grep GrowAgarden

# Check container logs
docker logs GrowAgarden

# Test the application
curl http://localhost:8081
```

## Useful Docker Commands

```bash
# Stop the container
docker stop GrowAgarden

# Start the container
docker start GrowAgarden

# Restart the container
docker restart GrowAgarden

# View logs
docker logs -f GrowAgarden

# Remove container
docker stop GrowAgarden && docker rm GrowAgarden

# Rebuild and restart
docker-compose down && docker-compose up -d --build
```

## Updating the Application

```bash
cd ~/GrowAgarden

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

1. **Port already in use**:
   ```bash
   # Check what's using port 8081
   lsof -i :8081
   # Or
   netstat -tulpn | grep 8081
   ```

2. **Container won't start**:
   ```bash
   # Check logs
   docker logs GrowAgarden

   # Check docker compose logs
   docker-compose logs
   ```

3. **Application not accessible**:
   - Check firewall rules: `sudo ufw allow 8081`
   - Verify container is running: `docker ps`
   - Check container health: `docker inspect GrowAgarden`

## Security Notes

- Make sure to update the default admin credentials
- Use HTTPS in production (consider using nginx as reverse proxy)
- Keep your .env file secure and never commit it to version control
- Regularly update Docker images and dependencies