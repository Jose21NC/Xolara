import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: parseInt(process.env.BACKEND_PORT || '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET as string,
  supabase: {
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  db: {
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/postgres',
  },
  uploads: {
    dir: path.resolve(__dirname, '../../uploads'),
    maxFileSize: 10 * 1024 * 1024,
  },
};

if (!config.jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}
if (!config.jwtSecret) {
  (config as any).jwtSecret = 'dev-jwt-secret-not-for-production';
}
