#!/bin/bash

# Deploy ke Production via SSH
# Configuration
SSH_HOST="77.37.81.252"
SSH_PORT="65002"
SSH_USER="u817493080"
REMOTE_PATH="~/public_html"
GITHUB_BRANCH="master"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       DEPLOYMENT KE PRODUCTION via SSH                   ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Build Frontend Assets
echo -e "${YELLOW}📦 Step 1: Building Frontend Assets...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build berhasil${NC}"
echo ""

# 2. Git Commit & Push
echo -e "${YELLOW}📝 Step 2: Git Status...${NC}"
git status
echo ""
echo -e "${YELLOW}Commits already pushed to GitHub. Skipping git operations.${NC}"
echo ""

# 3. Deploy via SSH
echo -e "${YELLOW}🚀 Step 3: Deploy ke Server ($SSH_HOST)...${NC}"
echo -e "${CYAN}User: $SSH_USER | Port: $SSH_PORT | Path: $REMOTE_PATH${NC}"
echo ""

# Test SSH Connection
echo -e "${YELLOW}🔌 Checking SSH connection...${NC}"
ssh -p $SSH_PORT -o ConnectTimeout=5 "$SSH_USER@$SSH_HOST" "echo 'SSH Connection OK'"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Cannot connect to server via SSH!${NC}"
    echo -e "${YELLOW}Please check:${NC}"
    echo "  - SSH port: $SSH_PORT"
    echo "  - SSH host: $SSH_HOST"
    echo "  - SSH user: $SSH_USER"
    exit 1
fi

echo -e "${GREEN}✓ SSH connection successful${NC}"
echo ""

# Deploy Commands
echo -e "${CYAN}Executing deployment commands...${NC}"

ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" << 'EOF'
cd ~/public_html

echo "Pulling latest changes..."
git pull origin master

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader

echo "Installing npm dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Running migrations..."
php artisan migrate --force

echo "Caching routes and config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Optimizing application..."
php artisan optimize

echo "Setting permissions..."
chmod -R 755 storage bootstrap/cache
chmod -R 755 public/storage

echo "Deployment complete!"
date
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       SUCCESS - Deployment Complete!                      ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Website: https://imamhafsh.com${NC}"
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║       ERROR - Deployment Failed                          ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}Deployment selesai pada $(date)${NC}"
