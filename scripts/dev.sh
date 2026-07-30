#!/bin/bash
# Xolara — Development launcher
# Starts the full stack: Docker (DB + Auth) + Backend + Frontend
# Usage: bash scripts/dev.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down...${NC}"
  [ -n "${BACKEND_PID:-}" ] && kill "$BACKEND_PID" 2>/dev/null && echo "  Backend stopped"
  [ -n "${FRONTEND_PID:-}" ] && kill "$FRONTEND_PID" 2>/dev/null && echo "  Frontend stopped"
  echo -e "${GREEN}All services stopped.${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "${CYAN}  Xolara — Development Stack Launcher  ${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo ""

# ── Step 1: Check prerequisites ──
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

if ! command -v docker &>/dev/null; then
  echo -e "${RED}ERROR: Docker is not installed${NC}"; exit 1
fi
if ! command -v node &>/dev/null; then
  echo -e "${RED}ERROR: Node.js is not installed${NC}"; exit 1
fi

# Detect Node package manager
if command -v pnpm &>/dev/null && [ -f "$ROOT_DIR/pnpm-lock.yaml" ]; then
  FRONTEND_PKG="pnpm"
elif [ -f "$ROOT_DIR/package-lock.json" ]; then
  FRONTEND_PKG="npm"
else
  # Default to pnpm (project convention)
  FRONTEND_PKG="pnpm"
fi
echo -e "  ${GREEN}✓${NC} docker, node, ${FRONTEND_PKG}"

# ── Step 2: Environment setup ──
echo -e "${YELLOW}[2/5] Setting up environment...${NC}"

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo -e "  Creating .env with generated JWT keys..."
  bash "$SCRIPT_DIR/generate-keys.sh" > "$ROOT_DIR/.env"
  {
    echo ""
    echo "## Database"
    echo "POSTGRES_PASSWORD=postgres"
    echo "DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres"
    echo ""
    echo "## Auth"
    echo "GOTRUE_SITE_URL=http://localhost:3000"
    echo "GOTRUE_MAILER_AUTOCONFIRM=true"
    echo ""
    echo "## Backend"
    echo "BACKEND_PORT=4000"
    echo "CORS_ORIGIN=http://localhost:3000"
  } >> "$ROOT_DIR/.env"
fi

# Sync .env to backend/
cp "$ROOT_DIR/.env" "$ROOT_DIR/backend/.env"
echo -e "  ${GREEN}✓${NC} .env ready"

# ── Step 3: Docker services ──
echo -e "${YELLOW}[3/5] Starting Docker services (db + auth)...${NC}"

cd "$ROOT_DIR"
docker compose up -d db auth 2>/dev/null

# Wait for DB health
echo -n "  Waiting for PostgreSQL to be healthy..."
for i in $(seq 1 30); do
  if docker compose exec -T db pg_isready -U postgres &>/dev/null; then
    echo -e " ${GREEN}✓${NC}"
    break
  fi
  echo -n "."
  sleep 2
done

# Ensure supabase_auth_admin has a password (needed for GoTrue SASL auth)
docker compose exec -T db psql -U supabase_admin -h localhost -d postgres \
  -c "ALTER ROLE supabase_auth_admin WITH PASSWORD 'postgres'" 2>/dev/null || true

# Ensure auth schema exists in postgres DB with correct permissions
docker compose exec -T db psql -U supabase_admin -h localhost -d postgres \
  -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO postgres" 2>/dev/null || true
docker compose exec -T db psql -U supabase_admin -h localhost -d postgres \
  -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO postgres" 2>/dev/null || true

echo -e "  ${GREEN}✓${NC} Docker services ready"

# ── Step 4: Backend ──
echo -e "${YELLOW}[4/5] Starting Backend (Express + tsx watch)...${NC}"

cd "$ROOT_DIR/backend"
export DATABASE_URL="postgres://postgres:postgres@localhost:5433/postgres"
npx tsx src/index.ts &
BACKEND_PID=$!

# Wait for backend
for i in $(seq 1 15); do
  if curl -s http://localhost:4000/api/health &>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Backend running on http://localhost:4000"
    break
  fi
  echo -n "."
  sleep 1
done

# ── Step 5: Frontend ──
echo -e "${YELLOW}[5/5] Starting Frontend (Vite dev server)...${NC}"

cd "$ROOT_DIR"
$FRONTEND_PKG dev &
FRONTEND_PID=$!

sleep 3
echo -e "  ${GREEN}✓${NC} Frontend starting on http://localhost:3000"

# ── Summary ──
echo ""
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "${CYAN}  All services running!                ${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo ""
echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:4000${NC}"
echo -e "  API:       ${GREEN}http://localhost:4000/api/experiences${NC}"
echo -e "  Auth:      ${GREEN}http://localhost:9999/health${NC}"
echo -e "  Database:  ${GREEN}localhost:5433 (postgres/postgres)${NC}"
echo ""
echo -e "  ${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

wait
