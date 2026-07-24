# Xolara

Xolara es una aplicación móvil-first diseñada para descubrir y reservar experiencias turísticas artesanales y comunitarias en Nicaragua. La plataforma conecta a viajeros con emprendimientos y cooperativas locales para promover un turismo más humano y sostenible.

## Características principales
- **Explorar Experiencias**: Descubre actividades culturales guiadas por locales.
- **Mapa Interactivo**: Ubicación de destinos y cooperativas utilizando Google Maps.
- **Pasaporte de Viajes**: Registro visual de tus reservas con sellos de estilo oficial.
- **Consejos Culturales**: Guía de etiqueta y glosario de modismos nicaragüenses adaptado a tu itinerario.

---

## Desarrollo Local

### Requisitos
- **Node.js** instalado en tu sistema.

### Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar entorno**:
   Copia el archivo de ejemplo para las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Asegúrate de configurar tu `GOOGLE_MAPS_PLATFORM_KEY` y el archivo `firebase-config.json` con tus credenciales.

3. **Iniciar el proyecto**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

