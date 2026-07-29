# Resumen Ejecutivo - Xolara

**Fecha**: 28 de julio de 2026  
**Versión**: 0.0.0  
**Estado**: MVP Visual (Entregable Express)

---

## Que es Xolara?

Xolara es una **aplicacion mobile-first** que conecta viajeros con experiencias culturales autenticas en Nicaragua. Permite explorar, reservar y coleccionar experiencias locales mientras se contribuye directamente al desarrollo de comunidades.

---

## Stack Tecnologico

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4 |
| **Animaciones** | Motion (Framer Motion) |
| **Iconos** | Lucide React |
| **Paquetes** | pnpm (exclusivo) |

**No hay backend, Firebase, ni Google Maps.** Todos los datos son seed/locale.

---

## Funcionalidades Principales

- **Exploracion**: Browse de experiencias con filtros y busqueda
- **Mapa Interactivo**: Visualizacion estilizada con SVG (sin API externa)
- **Reservaciones**: Flujo completo de booking con confirmacion local
- **Pasaporte Gamificado**: Sistema de stamps y logros con pasaporte 3D
- **Perfil de Usuario**: Historial de reservas y configuracion
- **Consejos Culturales**: Glosario de modismos nicaragüenses

---

## Metricas

- **Componentes React**: 15+
- **Pantallas**: 10
- **Dependencias**: 7 packages
- **Build output**: ~485KB JS (144KB gzip)

---

## Comandos

```bash
pnpm install        # instalar dependencias
pnpm run dev        # servidor de desarrollo (puerto 3000)
pnpm run build      # build de produccion
pnpm run lint       # type-check: tsc --noEmit
```

---

## Documentacion

- **Analisis Tecnico**: [`ANALISIS_TECNICO.md`](./ANALISIS_TECNICO.md)
- **Contexto**: [`context.md`](./context.md)
