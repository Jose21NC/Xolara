#!/bin/bash
# Xolara — Generates Supabase JWT keys for self-hosted setup
# Requires JWT_SECRET to be set in .env or passed as argument
# Output: SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY

set -euo pipefail

JWT_SECRET="${1:-${JWT_SECRET:-super-secret-jwt-key-change-in-production}}"

gen_jwt() {
  local role="$1"
  local header
  local payload
  local header_b64
  local payload_b64
  local signature

  header=$(echo -n '{"typ":"JWT","alg":"HS256"}' | base64 -w0 | sed 's/=//g; s/\+/-/g; s/\//_/g')
  payload=$(echo -n "{\"iss\":\"supabase\",\"iat\":1740000000,\"role\":\"${role}\"}" | base64 -w0 | sed 's/=//g; s/\+/-/g; s/\//_/g')
  signature=$(echo -n "${header}.${payload}" | openssl dgst -sha256 -hmac "${JWT_SECRET}" -binary | base64 -w0 | sed 's/=//g; s/\+/-/g; s/\//_/g')

  echo "${header}.${payload}.${signature}"
}

echo "SUPABASE_ANON_KEY=$(gen_jwt anon)"
echo "SUPABASE_SERVICE_ROLE_KEY=$(gen_jwt service_role)"
