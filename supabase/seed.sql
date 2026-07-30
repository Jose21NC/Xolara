-- Xolara — Database Schema + Seed Data
-- This runs on first Supabase DB initialization

-- ──────────────────────────────────────
-- SCHEMA: public (tables)
-- ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY,
  display_name TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'traveler'
              CHECK (role IN ('visitor', 'traveler', 'guide', 'admin')),
  avatar_url  TEXT,
  subtitle    TEXT,
  location    TEXT,
  bio         TEXT,
  is_approved_guide BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.experiences (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  location          TEXT NOT NULL,
  country           TEXT NOT NULL DEFAULT 'Nicaragua',
  category          TEXT NOT NULL
                    CHECK (category IN ('Crafts', 'Culinary', 'Agriculture', 'Nature', 'Music')),
  duration          TEXT NOT NULL,
  duration_hours    NUMERIC NOT NULL,
  group_size        TEXT NOT NULL,
  rating            NUMERIC DEFAULT 0,
  reviews_count     INTEGER DEFAULT 0,
  price_per_person  NUMERIC NOT NULL,
  image             TEXT,
  about_community   TEXT NOT NULL,
  what_you_will_do  JSONB DEFAULT '[]',
  authenticity_score INTEGER DEFAULT 0,
  community_impact_text TEXT,
  community_impact_bullets JSONB DEFAULT '[]',
  how_to_get_there  JSONB DEFAULT '{}',
  tags              TEXT[] DEFAULT '{}',
  gallery_images    TEXT[] DEFAULT '{}',
  lat               NUMERIC,
  lng               NUMERIC,
  created_by        UUID REFERENCES public.profiles(id),
  host_name         TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id),
  experience_id   UUID NOT NULL REFERENCES public.experiences(id),
  date            DATE NOT NULL,
  time            TIME NOT NULL,
  adults_count    INTEGER NOT NULL CHECK (adults_count >= 1),
  children_count  INTEGER DEFAULT 0,
  total_price     NUMERIC NOT NULL,
  booking_ref     TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Confirmed'
                  CHECK (status IN ('Confirmed', 'Pending', 'Completed', 'Cancelled')),
  confirmed_at    TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.likes (
  user_id       UUID NOT NULL REFERENCES public.profiles(id),
  experience_id UUID NOT NULL REFERENCES public.experiences(id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, experience_id)
);
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.passport_stamps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,
  date        TEXT NOT NULL,
  icon_type   TEXT NOT NULL,
  color       TEXT NOT NULL,
  booking_id  UUID REFERENCES public.bookings(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.passport_stamps ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.app_configs (
  user_id           UUID PRIMARY KEY REFERENCES public.profiles(id),
  greeting_tone     TEXT NOT NULL DEFAULT 'traditional'
                    CHECK (greeting_tone IN ('traditional', 'formal', 'slang')),
  language          TEXT NOT NULL DEFAULT 'bilingual'
                    CHECK (language IN ('es', 'en', 'bilingual')),
  tip_focus         TEXT[] DEFAULT '{gastronomy,nature,crafts}',
  enable_nica_sound BOOLEAN DEFAULT true,
  show_co2_in_lbs   BOOLEAN DEFAULT false,
  updated_at        TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.app_configs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.guides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID UNIQUE REFERENCES public.profiles(id),
  experience_id   UUID REFERENCES public.experiences(id),
  welcome_msg     TEXT,
  faq             JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────
-- SEED: Experiences (from src/data.ts)
-- ──────────────────────────────────────

INSERT INTO public.experiences (id, title, location, country, category, duration, duration_hours, group_size, rating, reviews_count, price_per_person, image, about_community, what_you_will_do, authenticity_score, community_impact_text, community_impact_bullets, how_to_get_there, tags, gallery_images, lat, lng, host_name) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Ruta del Café Orgánico en Matagalpa',
  'Matagalpa, Selva Negra',
  'Nicaragua',
  'Agriculture',
  '5 Horas',
  5,
  'Máx 6 personas',
  4.95,
  142,
  55,
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
  'Ubicada en las neblinosas montañas del norte de Nicaragua, la cooperativa local de caficultores de Matagalpa ha implementado técnicas agroecológicas que protegen la biodiversidad.',
  '[{"title":"Recolección Sostenible","desc":"Aprende a identificar y recolectar manualmente solo las cerezas rojas maduras de café Arábica bajo la guía de un productor local."},{"title":"Despulpe y Secado al Sol","desc":"Ayuda en el beneficio húmedo artesanal y extiende los granos húmedos en los patios tradicionales para su deshidratación natural."}]',
  99,
  'Tu visita apoya financieramente a 6 familias caficultoras organizadas.',
  '["El 20% de los fondos se destina al vivero comunitario de reforestación.","Genera ingresos directos a las cooperativas lideradas por mujeres."]',
  '{"title":"Finca Ecológica La Hermandad","description":"Km 142, Carretera Matagalpa - El Tuma La Dalia, Nicaragua.","mapImage":""}',
  ARRAY['Matagalpa','Café','Sostenibilidad'],
  ARRAY['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'],
  12.9224,
  -85.9160,
  'Cooperativa La Hermandad'
),
(
  'a0000000-0000-0000-0000-000000000002',
  'Cerámica Ancestral de San Juan de Oriente',
  'San Juan de Oriente, Masaya',
  'Nicaragua',
  'Crafts',
  '4 Horas',
  4,
  'Máx 5 personas',
  4.88,
  96,
  35,
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
  'San Juan de Oriente es un pintoresco pueblo con profundas raíces chorotegas donde casi cada hogar alberga un taller de alfarería.',
  '[{"title":"Modelado en Torno de Pie","desc":"Siente la elasticidad y textura del barro local mientras utilizas el torno impulsado con el pie."},{"title":"Decorado Precolombino con Bruñidor","desc":"Aprende a plasmar grecas decorativas y figuras sagradas imitando antiguos grabados prehispánicos."}]',
  98,
  'Esta experiencia combate la migración rural aportando salarios dignos a creadores locales.',
  '["Sustenta directamente el taller familiar de Néstor y 4 decoradores independientes.","Preserva iconografía ancestral nicaragüense."]',
  '{"title":"Taller de Barro Néstor Guerrero","description":"Detrás de la Iglesia de San Juan de Oriente, Masaya, Nicaragua.","mapImage":""}',
  ARRAY['Masaya','Alfarería','Chorotega'],
  ARRAY['https://images.unsplash.com/photo-1565192647048-f997ded879ab?auto=format&fit=crop&q=80&w=600'],
  11.9056,
  -86.0743,
  'Néstor Guerrero'
),
(
  'a0000000-0000-0000-0000-000000000003',
  'Cocina Colonial y Taller del Vigorón',
  'Granada, El Recreo',
  'Nicaragua',
  'Culinary',
  '3.5 Horas',
  3.5,
  'Máx 8 personas',
  4.90,
  112,
  40,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
  'A orillas del Gran Lago de Nicaragua, la ciudad colonial de Granada alberga grandes secretos gastronómicos.',
  '[{"title":"Selección de Ingredientes","desc":"Descubre los mercados locales y aprende a elegir la mejor yuca nicaragüense."},{"title":"Preparación de Ensalada con Chicharrón","desc":"Pica los ingredientes con precisión criolla y cocina chicharrón crujiente."}]',
  97,
  'Sustenta la red de pequeños agricultores agrícolas de Granada y Carazo.',
  '["Ayuda a 3 distribuidoras rurales de tubérculos y hojas de chagüite.","Financia la compra de fogones eficientes de baja emisión de humo."]',
  '{"title":"La Cocina de Doña Auxiliadora","description":"Calle La Calzada, esquina opuesta al convento San Francisco, Granada, Nicaragua.","mapImage":""}',
  ARRAY['Granada','Gastronomía','Tradición'],
  ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600'],
  11.9300,
  -85.9560,
  'Doña Auxiliadora'
),
(
  'a0000000-0000-0000-0000-000000000004',
  'Senderismo Eco-Volcánico y Reforestación',
  'Volcán Masaya',
  'Nicaragua',
  'Nature',
  '4.5 Horas',
  4.5,
  'Máx 12 personas',
  4.85,
  89,
  48,
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
  'El Volcán Masaya es una de las grandes maravillas geológicas de Centroamérica.',
  '[{"title":"Trek de los Senderos de Lava","desc":"Camina entre formaciones volcánicas milenarias explicadas por guardabosques certificados."},{"title":"Reforestación Voluntaria","desc":"Planta brotes de madero negro o guayacán en las faldas fértiles protegidas."}]',
  96,
  'Sustenta la labor de la Asociación de Guardaparques Locales.',
  '["Impulsa empleos de conservación ambiental alternativa para juventud local.","Sponsoriza la reforestación activa de 10 árboles nativos por cada viajero."]',
  '{"title":"Vivero Guardas Volcán Masaya","description":"Km 23, Carretera Masaya, Nicaragua.","mapImage":""}',
  ARRAY['Masaya','Aventura','Conservación'],
  ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600'],
  11.9839,
  -86.1608,
  'Orlando (Guardaparques Masaya)'
);
