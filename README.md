# Xolara

Xolara es una aplicación móvil-first diseñada para descubrir y reservar experiencias turísticas artesanales y comunitarias en Nicaragua. La plataforma conecta a viajeros con emprendimientos y cooperativas locales para promover un turismo más humano y sostenible.

## Características principales
- **Explorar Experiencias**: Descubre actividades culturales guiadas por locales.
- **Mapa Interactivo**: Ubicación de destinos con mapa SVG estilizado.
- **Pasaporte de Viajes**: Registro visual de tus reservas con sellos de estilo oficial.
- **Consejos Culturales**: Guía de etiqueta y glosario de modismos nicaragüenses adaptado a tu itinerario.

---

## Desarrollo Local

### Requisitos
- **Node.js** >= 18 instalado en tu sistema.
- **pnpm** como gestor de paquetes (obligatorio).

### Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Iniciar el proyecto**:
   ```bash
   pnpm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Comandos disponibles

```bash
pnpm run dev        # Servidor de desarrollo en puerto 3000
pnpm run build      # Build de producción a dist/
pnpm run preview    # Servir el build de producción
pnpm run lint       # Type-check: tsc --noEmit
pnpm run clean      # Limpiar cache
```

### Nota sobre gestor de paquetes

Este proyecto usa **pnpm exclusivamente**. El archivo `.npmrc` bloquea el uso de `npm` para evitar inconsistencias en las dependencias.

---

## Stack Tecnológico

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4 |
| **Animaciones** | Motion (Framer Motion) |
| **Iconos** | Lucide React |
| **Estilos** | Tailwind CSS v4 (tema en `src/index.css`) |

---

## Arquitectura

- **Single-screen state machine** — sin router. Navegación por estado en `App.tsx`.
- **Mobile-first** — diseño optimizado para 390px, renderizado en `PhoneShell`.
- **Datos locales** — experiencias hardcodeadas en `src/data.ts`, bookings gestionados en estado local.
- **Componentes modulares** — 15+ componentes reutilizables en `src/components/`.

---

## Estructura del Proyecto

```
src/
├── App.tsx                 # Raíz + estado global + navegación
├── main.tsx                # Entry point
├── types.ts                # Interfaces TypeScript
├── data.ts                 # Datos seed (experiencias, stamps)
├── index.css               # Tema Tailwind + utilidades custom
├── components/             # Componentes reutilizables
└── screens/                # 10 pantallas
```
