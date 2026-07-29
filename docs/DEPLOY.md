# Deployment Guide

Xolara se despliega como un **stack Docker** que incluye frontend, backend y base de datos.

---

## Opción 1: Stack completo con Docker (recomendado)

Despliega todo en un solo VPS con Docker Compose.

### Prerrequisitos

- Servidor VPS con Docker Engine 24+ y Docker Compose v2
- Git
- Dominio (opcional, con DNS apuntando al VPS)
- Puerto 80/443 abierto en el firewall

### Pasos

```bash
# 1. Clonar
git clone https://github.com/Jose21NC/Xolara.git
cd Xolara

# 2. Configurar entorno
cp .env.example .env
# Editar .env: cambiar JWT_SECRET, POSTGRES_PASSWORD

# 3. Generar claves Supabase
bash scripts/generate-keys.sh "$(grep JWT_SECRET .env | cut -d= -f2)"
# Copiar output a .env en SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY

# 4. Construir y arrancar
docker compose up --build -d

# 5. Verificar
curl http://localhost:3000/api/health
# → {"status":"ok","timestamp":"..."}
```

### Servicios

| Servicio | Puerto | Acceso |
|----------|--------|--------|
| Frontend | 80 (mapeado a :3000) | http://tu-dominio.com |
| Backend API | 4000 (interno) | Solo vía proxy Nginx |
| Supabase Studio | 3001 | http://tu-dominio.com:3001 |
| PostgreSQL | 5432 (interno) | Solo vía backend |

### Actualizar

```bash
git pull
docker compose up --build -d
```

### Rollback

```bash
# Volver a un commit anterior
git checkout <commit-anterior>
docker compose up --build -d
```

---

## Opción 2: Frontend en Vercel + Backend en VPS

### Frontend (Vercel)

```bash
pnpm build    # Build a dist/
```

Conectar repo a Vercel. Configurar:
- **Framework**: Vite
- **Build**: `pnpm build`
- **Output**: `dist`
- **Variables**: `VITE_API_URL=https://tu-api.com`

### Backend (VPS con Docker)

```bash
# Solo base de datos + backend
docker compose up -d db auth backend
```

---

## Opción 3: Solo frontend (sin backend)

Para demo visual sin funcionalidad de backend:

```bash
pnpm build
```

Desplegar `dist/` en cualquier static host (Vercel, Netlify, GitHub Pages).

---

## Variables de entorno requeridas en producción

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `JWT_SECRET` | ✅ | Clave secreta para JWTs (cambiar por una segura) |
| `POSTGRES_PASSWORD` | ✅ | Password de la base de datos |
| `SUPABASE_ANON_KEY` | ✅ | Key anónima generada con el script |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Key admin generada con el script |

### Generar secretos seguros

```bash
# JWT_SECRET
openssl rand -base64 32

# POSTGRES_PASSWORD
openssl rand -base64 16
```

---

## Seguridad en producción

- [ ] Cambiar `JWT_SECRET` por un valor seguro
- [ ] Cambiar `POSTGRES_PASSWORD` por un valor seguro
- [ ] Configurar HTTPS (certbot/letsencrypt + Nginx)
- [ ] Restringir acceso a puerto 3001 (Studio) solo desde IPs confiables
- [ ] Configurar `GOTRUE_MAILER_AUTOCONFIRM=false`
- [ ] Aumentar `GOTRUE_JWT_EXP` según necesidades
- [ ] Agregar rate limiting (express-rate-limit)

---

## Performance

- Vite build: ~4s
- Docker build (backend): ~15s (con caché)
- Docker build (frontend): ~30s (con caché)
- PostgreSQL init + seed: ~10s (primera vez)
- Tamaño de imagen frontend: ~25MB (Nginx alpine)
- Tamaño de imagen backend: ~180MB (Node 20-alpine + dist)
