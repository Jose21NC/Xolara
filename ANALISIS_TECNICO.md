# Analisis Tecnico - Xolara

**Fecha**: 28 de julio de 2026  
**Version**: 0.0.0  
**Estado**: MVP Visual (Entregable Express)

---

## Stack Tecnologico

### Frontend Core
| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| React | 19.x | Framework UI |
| TypeScript | 5.8.x | Tipado estatico |
| Vite | 6.x | Build tool & dev server |
| Tailwind CSS | 4.x | Framework de estilos |
| Motion | 12.x | Animaciones |
| Lucide React | 0.546.x | Sistema de iconos |

### Dependencias eliminadas
| Paquete | Razon de eliminacion |
|---------|---------------------|
| Firebase | Sin backend |
| @google/genai | Sin IA externa |
| @vis.gl/react-google-maps | Mapa SVG local |
| Express | Sin server |
| dotenv | Sin variables de entorno |
| ESLint | No configurado |
| autoprefixer | Tailwind v4 no lo requiere |

---

## Arquitectura

### Estructura de Directorios

```
Xolara/
├── src/
│   ├── App.tsx              # Raiz + estado global
│   ├── main.tsx             # Entry point
│   ├── types.ts             # Interfaces TypeScript
│   ├── data.ts              # Datos seed
│   ├── index.css            # Tema Tailwind
│   ├── components/          # 15+ componentes reutilizables
│   └── screens/             # 10 pantallas
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .npmrc                   # Bloquea npm
```

### Patrón de Arquitectura

**Tipo**: Single-screen state machine (sin router)

- Navegacion por estado (`activeTab` + `currentScreen`)
- Estado global en `App.tsx`
- Componentes presentacionales
- Datos seed estaticos

---

## Modelo de Datos

### Experience (src/types.ts)
```typescript
interface Experience {
  id: string;
  title: string;
  location: string;
  country: string;
  category: 'Crafts' | 'Culinary' | 'Music' | 'Nature' | 'Agriculture';
  duration: string;
  durationHours: number;
  groupSize: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  image: string;
  aboutCommunity: string;
  whatYouWillDo: { title: string; desc: string }[];
  authenticityScore: number;
  communityImpactText: string;
  communityImpactBullets: string[];
  howToGetThere: { title: string; description: string; mapImage: string };
  tags: string[];
  galleryImages: string[];
  lat?: number;
  lng?: number;
}
```

### Booking (src/types.ts)
```typescript
interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  date: string;
  time: string;
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  bookingRef: string;
  confirmedAt: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}
```

---

## Sistema de Diseno

### Paleta de Colores (Figma)
```css
--color-brand-primary: #a03f28;    /* Terracota */
--color-brand-secondary: #47654f;  /* Verde profundo */
--color-brand-bg: #fff8f6;         /* Bone */
--color-brand-text-dark: #412c21;
--color-brand-text-muted: #4f4540;
```

### Tipografia (Figma)
- **Headings**: Syne (48px/800, 28px/700, 24px/600)
- **Body**: Outfit (18px/400, 16px/500, 14px/600)

### Componentes UI
- PhoneShell: contenedor movil centrado
- BottomNavBar: navegacion inferior con 4 tabs
- Glass effects, backdrop blur, sombras suaves
- Animaciones con Motion (Framer Motion)

---

## Metricas

- **Componentes**: 15+
- **Pantallas**: 10
- **Dependencias**: 7 packages
- **Build**: ~485KB JS (144KB gzip)
- **Lint**: tsc --noEmit (0 errores)
- **Build time**: ~4-5 segundos

---

## Configuracion

### TypeScript
```json
{
  "target": "ES2022",
  "module": "ESNext",
  "jsx": "react-jsx",
  "moduleResolution": "bundler",
  "skipLibCheck": true,
  "noEmit": true
}
```

### Gestor de Paquetes
- **pnpm exclusivo** — npm bloqueado via `.npmrc`
- `packageManager` en package.json fija version pnpm
