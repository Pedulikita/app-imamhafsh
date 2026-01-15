#!/bin/bash

# Deploy Assets to Production Script
# Usage: ./deploy-assets.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Build assets locally
echo -e "${YELLOW}Building assets locally...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Upload assets to production
echo -e "${YELLOW}Uploading assets to production...${NC}"

# Remove old assets from public_html
ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com/public_html/build && rm -rf assets/* manifest.json"

# Copy new assets to laravel_app (backup location)
scp -P 65002 -r public/build/* u817493080@77.37.81.252:~/domains/imamhafsh.com/laravel_app/public/build/

# Copy new assets to public_html (serving location)  
ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com && cp -r laravel_app/public/build/* public_html/build/"

# Clear Laravel cache
echo -e "${YELLOW}Clearing Laravel cache...${NC}"
ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com/laravel_app && php artisan cache:clear && php artisan config:clear && php artisan view:clear"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Test assets
echo -e "${YELLOW}Testing critical assets...${NC}"
curl -s -I "https://imamhafsh.com/build/assets/app-FifeAbI1.css" | grep -q "200 OK" && echo -e "${GREEN}✅ CSS OK${NC}" || echo -e "${RED}❌ CSS Failed${NC}"
curl -s -I "https://imamhafsh.com/build/assets/app-CI5JmK-O.js" | grep -q "200 OK" && echo -e "${GREEN}✅ JS OK${NC}" || echo -e "${RED}❌ JS Failed${NC}"

echo -e "${GREEN}🚀 Website ready at https://imamhafsh.com${NC}"