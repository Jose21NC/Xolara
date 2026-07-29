#!/bin/bash
# Xolara — Copy backend .env.example to .env for local dev
# Usage: scripts/copy-env.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ ! -f "${PROJECT_DIR}/backend/.env" ]; then
  cp "${PROJECT_DIR}/.env.example" "${PROJECT_DIR}/backend/.env"
  echo "Created backend/.env from .env.example"
else
  echo "backend/.env already exists — skipping"
fi
