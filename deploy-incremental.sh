#!/bin/bash

# Deploy only changed files - Incremental Deploy
# Faster than uploading everything

SSH_HOST="77.37.81.252"
SSH_PORT="65002"
SSH_USER="u817493080"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   INCREMENTAL DEPLOY - Only Changed Files                ║${NC}"
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

# 2. Detect changes since last deploy
echo -e "${YELLOW}🔍 Detecting changed files...${NC}"

# Get list of changed JS/CSS files
CHANGED_FILES=$(find public/build/assets -type f \( -name "*.js" -o -name "*.css" \) -newermt "5 minutes ago" 2>/dev/null | head -20)

if [ -z "$CHANGED_FILES" ]; then
    echo -e "${YELLOW}⚠ No recent changes detected (checking all manifest files)${NC}"
    CHANGED_FILES=$(ls -la public/build/manifest.json public/build/assets/*.js 2>/dev/null | tail -20 | awk '{print $NF}')
fi

echo "Changed files:"
echo "$CHANGED_FILES" | head -10
echo ""

# 3. Deploy via rsync (only deltas)
echo -e "${YELLOW}🚀 Syncing changed files...${NC}"
echo ""

rsync -av -e "ssh -p $SSH_PORT" \
    --delete \
    --exclude='*.map' \
    public/build/ \
    $SSH_USER@$SSH_HOST:~/laravel_app/public/build/

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Rsync complete${NC}"
    
    # Sync to public_html and clear cache
    echo -e "${YELLOW}  Syncing to public_html...${NC}"
    ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << 'SSH_COMMANDS'
cd ~/laravel_app
cp -r public/build/* ~/public_html/build/ 2>/dev/null
php artisan cache:clear 2>/dev/null || true
php artisan config:cache 2>/dev/null || true
echo "Done!"
SSH_COMMANDS

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       ✅ INCREMENTAL DEPLOY COMPLETE!                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Website: https://imamhafsh.com${NC}"
    echo ""
else
    echo -e "${RED}❌ Rsync failed${NC}"
    exit 1
fi
