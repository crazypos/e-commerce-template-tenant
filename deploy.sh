#!/bin/bash
# ============================================================
# deploy.sh - Tenant template deployment script
#
# Flow:
#   1. Read TEMPLATE from .env
#   2. Login with email + password → get token from auth.php
#   3. Package templates/<name>/ dir as zip
#   4. Upload zip to api.php → trigger server deployment
# ============================================================
set -euo pipefail

# ── Colors ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── Config ──────────────────────────────────────────────
AUTH_URL="http://deploy.crazypos.local/tenant/auth.php"
DEPLOY_URL="http://deploy.crazypos.local/tenant/api.php"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
TEMPLATES_DIR="$SCRIPT_DIR/templates"

echo -e "${CYAN}━━━  Tenant Template Deploy  ━━━${NC}"
echo ""

# ── Check .env ─────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}✗ .env not found${NC}"
  echo "  Run: cp .env.example .env and fill in your config"
  exit 1
fi

TEMPLATE=$(grep -E '^TEMPLATE=' "$ENV_FILE" | sed 's/^TEMPLATE=//' | tr -d '[:space:]')
TEMPLATE="${TEMPLATE:-default}"

echo -e "  Template: ${CYAN}${TEMPLATE}${NC}"

# ── Check template directory ───────────────────────────
TEMPLATE_DIR="$TEMPLATES_DIR/$TEMPLATE"
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo -e "${RED}✗ Template directory not found: ${TEMPLATE_DIR}${NC}"
  echo ""
  echo "  Available templates:"
  for d in "$TEMPLATES_DIR"/*/; do
    [ -d "$d" ] && echo "    - $(basename "$d")"
  done
  echo ""
  echo "  To create a custom template:"
  echo "    cp -rf templates/default templates/my-template"
  echo "    Then set TEMPLATE=my-template in .env"
  exit 1
fi

# ── Step 1: Login ──────────────────────────────────────
echo ""
echo -e "${CYAN}[1/4] Login${NC}"

EMAIL=""
PASSWORD=""
TOKEN=""
SLUG=""

while [ -z "$TOKEN" ]; do
  if [ -z "$EMAIL" ]; then
    echo -n "  Email: "
    read EMAIL
  fi

  if [ -z "$PASSWORD" ]; then
    echo -n "  Password: "
    read -s PASSWORD
    echo ""
  fi

  if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
    echo -e "${RED}  Email and password are required${NC}"
    if [ -z "$EMAIL" ]; then EMAIL=""; fi
    if [ -z "$PASSWORD" ]; then PASSWORD=""; fi
    continue
  fi

  echo ""
  echo -e "  Authenticating..."

  AUTH_RESPONSE=$(mktemp)
  AUTH_HTTP_CODE=$(curl -s -S -w "%{http_code}" -o "$AUTH_RESPONSE" \
    -H "Content-Type: application/json" \
    -d "$(printf '{"email":"%s","password":"%s"}' "$EMAIL" "$PASSWORD")" \
    "$AUTH_URL" 2>&1)

  AUTH_BODY=$(cat "$AUTH_RESPONSE")
  rm -f "$AUTH_RESPONSE"

  if [ "$AUTH_HTTP_CODE" = "200" ]; then
    SUCCESS=$(echo "$AUTH_BODY" | grep -o '"success":[^,}]*' | head -1 | cut -d: -f2 | tr -d ' ')
    TOKEN=$(echo "$AUTH_BODY" | grep -o '"token":"[^"]*"' | head -1 | cut -d: -f2 | tr -d '"')
    SLUG=$(echo "$AUTH_BODY" | grep -o '"ecommerce_domain_prefix":"[^"]*"' | head -1 | cut -d: -f2 | tr -d '"')

    if [ "$SUCCESS" = "true" ] && [ -n "$TOKEN" ]; then
      echo -e "  ${GREEN}✓${NC} Login successful - Site: ${CYAN}${SLUG}${NC}"
      break
    fi
  fi

  # Parse error
  ERROR=$(echo "$AUTH_BODY" | grep -o '"error":"[^"]*"' | head -1 | cut -d: -f2 | tr -d '"')

  if [ "$AUTH_HTTP_CODE" = "500" ]; then
    echo -e "${RED}  Server error: $ERROR${NC}"
    exit 1
  fi

  echo -e "${YELLOW}  $ERROR${NC}"
  echo ""

  # Retry based on error type
  case "$ERROR" in
    "Email not found")
      EMAIL=""
      PASSWORD=""
      ;;
    "Incorrect password")
      PASSWORD=""
      ;;
    "Invalid email format")
      EMAIL=""
      PASSWORD=""
      ;;
    *)
      # Unknown error - clear both
      EMAIL=""
      PASSWORD=""
      ;;
  esac
done

# ── Check template matches account ────────────────────
if [ "$TEMPLATE" != "$SLUG" ]; then
  echo ""
  echo -e "${YELLOW}⚠ Warning:${NC} .env TEMPLATE=${TEMPLATE}, but your account is bound to ${SLUG}"
  echo -n -e "${YELLOW}  Deploy ${TEMPLATE} anyway? (y/N): ${NC}"
  read CONFIRM
  if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo -e "${YELLOW}✗ Cancelled${NC}"
    exit 0
  fi
fi

# ── Step 2: Package template ──────────────────────────
echo ""
echo -e "${CYAN}[2/4] Packaging template...${NC}"

ZIP_FILE="/tmp/${TEMPLATE}-template.zip"
rm -f "$ZIP_FILE"
trap "rm -f '$ZIP_FILE'" EXIT

cd "$TEMPLATES_DIR"
if ! zip -r "$ZIP_FILE" "$TEMPLATE/" -x "*.DS_Store" > /dev/null 2>&1; then
  echo -e "${RED}✗ Packaging failed${NC}"
  exit 1
fi

ZIP_SIZE=$(stat -f%z "$ZIP_FILE" 2>/dev/null || stat -c%s "$ZIP_FILE" 2>/dev/null)
echo -e "  ${GREEN}✓${NC} Packaged ($((ZIP_SIZE / 1024)) KB)"
cd "$SCRIPT_DIR"

# ── Step 3: Confirm ────────────────────────────────────
echo ""
echo -e "  About to deploy template ${CYAN}${TEMPLATE}${NC}"
echo ""
read -p "$(echo -e ${YELLOW}"  Proceed? (y/N): "${NC})" CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo -e "${YELLOW}✗ Cancelled${NC}"
  exit 0
fi

# ── Step 4: Upload ─────────────────────────────────────
echo ""
echo -e "${CYAN}[4/4] Uploading...${NC}"

HTTP_RESPONSE=$(mktemp)
HTTP_CODE=$(curl -s -S -w "%{http_code}" -o "$HTTP_RESPONSE" \
  -H "Authorization: Bearer $TOKEN" \
  -F "template=@$ZIP_FILE" \
  "${DEPLOY_URL}" 2>&1)

BODY=$(cat "$HTTP_RESPONSE")
rm -f "$HTTP_RESPONSE"

echo ""
echo "$BODY"
echo ""

VERSION=$(echo "$BODY" | grep -o '"version":[0-9]*' | head -1 | cut -d: -f2)
VERSION_TAG=""
if [ -n "$VERSION" ]; then
  VERSION_TAG=" (v${VERSION})"
fi

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo -e "${GREEN}✓ Deployment triggered${VERSION_TAG}!${NC}"
  echo -e "  Server will deploy in a few seconds."
  echo -e "  Visit https://${SLUG}.test.crazypos.com to see the result"
else
  echo -e "${RED}✗ Deploy failed (HTTP $HTTP_CODE)${NC}"
  exit 1
fi
