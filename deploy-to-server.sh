#!/bin/bash

# Deployment script for GrowAgarden to remote server
# Server: 69.62.112.36
# Port: 8081

SERVER_IP="69.62.112.36"
SERVER_USER="root"  # Change this to your SSH username if different
PROJECT_NAME="GrowAgarden"
DOCKER_IMAGE_NAME="growagarden"
CONTAINER_NAME="GrowAgarden"
PORT="8081"

echo "🚀 Starting deployment to $SERVER_IP..."

# Step 1: Create directory and clone repository on remote server
echo "📁 Creating project directory and cloning repository..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
  # Navigate to home directory
  cd ~

  # Remove existing directory if it exists
  if [ -d "GrowAgarden" ]; then
    echo "Removing existing GrowAgarden directory..."
    rm -rf GrowAgarden
  fi

  # Clone the repository (you'll need to replace this with your actual repo URL)
  echo "Cloning repository..."
  git clone https://github.com/yourusername/GrowAgarden.git

  # Navigate to project directory
  cd GrowAgarden

  # Create .env file if it doesn't exist
  if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your Supabase credentials"
  fi
ENDSSH

# Step 2: Copy local files to server (including Docker configs and .env)
echo "📤 Copying Docker configuration and environment files..."
scp docker-compose.yml $SERVER_USER@$SERVER_IP:~/GrowAgarden/
scp Dockerfile $SERVER_USER@$SERVER_IP:~/GrowAgarden/
scp .env $SERVER_USER@$SERVER_IP:~/GrowAgarden/

# Step 3: Build and run Docker container on remote server
echo "🐳 Building and running Docker container..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
  cd ~/GrowAgarden

  # Stop and remove existing container if it exists
  docker stop GrowAgarden 2>/dev/null || true
  docker rm GrowAgarden 2>/dev/null || true

  # Build and run with docker-compose
  docker-compose down
  docker-compose up -d --build

  # Check if container is running
  sleep 5
  if docker ps | grep -q GrowAgarden; then
    echo "✅ Container is running successfully!"
    docker ps | grep GrowAgarden
  else
    echo "❌ Container failed to start. Checking logs..."
    docker logs GrowAgarden
  fi
ENDSSH

echo "🎉 Deployment complete!"
echo "📍 Your application should be accessible at: http://$SERVER_IP:$PORT"