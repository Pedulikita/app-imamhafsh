#!/bin/bash

# Deploy ke Production - Simple version
# Handles both public_html dan laravel_app folders

SSH_HOST="77.37.81.252"
SSH_PORT="65002"
SSH_USER="u817493080"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       DEPLOYMENT KE PRODUCTION                           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Build
echo -e "${YELLOW}📦 Building frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# 2. Deploy
echo -e "${YELLOW}🚀 Uploading to production...${NC}"

# Upload build folder to laravel_app
echo "  Uploading build assets..."
scp -P $SSH_PORT -r public/build/* $SSH_USER@$SSH_HOST:~/laravel_app/public/build/ 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✓ Assets uploaded${NC}"
else
    echo -e "${RED}  ✗ Upload failed${NC}"
    exit 1
fi

# Sync to public_html and clear cache
echo "  Syncing to public_html..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << 'SSH_COMMANDS'
cd ~/laravel_app

# Sync build folder to public_html
cp -r public/build/* ~/public_html/build/ 2>/dev/null

# Clear cache
php artisan cache:clear 2>/dev/null || true
php artisan config:cache 2>/dev/null || true

echo "Done!"
SSH_COMMANDS

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✓ Synced and cache cleared${NC}"
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       ✅ DEPLOYMENT COMPLETE!                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Website: https://imamhafsh.com${NC}"
    echo ""
else
    echo -e "${RED}  ✗ Sync failed${NC}"
    exit 1
fi
