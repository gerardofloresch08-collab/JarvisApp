# JarvisApp 🤖

Personal AI assistant mobile app powered by **Claude (Anthropic)**, built with **Expo React Native**.

## Características

- 💬 **Chat con IA** — Conversaciones reales con Claude Sonnet via API
- 📋 **Recordatorios** — Crea, completa y elimina recordatorios con persistencia local
- ⚙️ **Configuración** — Apariencia, notificaciones y privacidad
- 🌙 **Modo oscuro/claro** — Detecta automáticamente el tema del sistema
- ⚡ **Acciones rápidas** — Chips predefinidos para consultas comunes

## Capturas de pantalla

> Chat inteligente • Recordatorios • Configuración

## Requisitos

- Node.js 18+
- pnpm (o npm/yarn)
- Expo CLI
- Cuenta en [expo.dev](https://expo.dev) (gratis)
- Cuenta en [Replit](https://replit.com) (para el servidor de IA)

## Instalación y configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/gerardofloresch08-collab/JarvisApp.git
cd JarvisApp
```

### 2. Instala dependencias

```bash
cd artifacts/mobile
npm install
```

### 3. Configura la URL de la API

En `artifacts/mobile/context/JarvisContext.tsx`, reemplaza `EXPO_PUBLIC_DOMAIN` con la URL de tu servidor desplegado en Replit:

```ts
const API_BASE = `https://TU_DOMINIO.replit.app`;
```

### 4. Ejecuta en modo desarrollo

```bash
npx expo start
```

Escanea el código QR con la app **Expo Go** en tu celular.

---

## Generar APK descargable (Android)

### Paso 1 — Instala EAS CLI

```bash
npm install -g eas-cli
```

### Paso 2 — Inicia sesión en Expo

```bash
eas login
```

### Paso 3 — Vincula el proyecto (solo la primera vez)

```bash
cd artifacts/mobile
eas init
```

Esto genera un `projectId` en tu cuenta de Expo. Cópialo y pégalo en `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "TU_PROJECT_ID_AQUI"
  }
}
```

### Paso 4 — Compila la APK

```bash
eas build -p android --profile preview
```

- El proceso tarda **5–10 minutos** en los servidores de Expo
- Al terminar recibes un **enlace directo de descarga** de la APK
- Puedes instalarla en cualquier Android (habilita "Fuentes desconocidas")

### Paso 5 — Descarga e instala

Abre el enlace en tu celular Android → descarga la APK → instala.

---

## Estructura del proyecto

```
JarvisApp/
├── artifacts/
│   ├── mobile/                 # App Expo React Native
│   │   ├── app/
│   │   │   └── (tabs)/
│   │   │       ├── index.tsx       # Pantalla de chat
│   │   │       ├── reminders.tsx   # Pantalla de recordatorios
│   │   │       └── settings.tsx    # Pantalla de configuración
│   │   ├── components/
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── OrbAnimation.tsx
│   │   │   ├── QuickActionChip.tsx
│   │   │   ├── ReminderCard.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── context/
│   │   │   └── JarvisContext.tsx   # Estado global de la app
│   │   ├── constants/
│   │   │   └── colors.ts           # Paleta de colores
│   │   ├── app.json                # Configuración de Expo
│   │   └── eas.json                # Perfiles de build
│   └── api-server/                 # Servidor Express (backend IA)
│       └── src/
│           └── routes/
│               └── jarvis.ts       # Endpoint /api/jarvis/chat
```

## Perfiles de build (eas.json)

| Perfil | Plataforma | Resultado | Uso |
|--------|-----------|-----------|-----|
| `preview` | Android | APK | Pruebas y distribución directa |
| `development` | Android | APK | Desarrollo con Expo Dev Client |
| `production` | Android | AAB | Publicar en Google Play Store |

## Tecnologías

- [Expo](https://expo.dev) — Framework de React Native
- [Expo Router](https://expo.github.io/router) — Navegación basada en archivos
- [Claude Sonnet](https://anthropic.com) — Modelo de IA de Anthropic
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — Persistencia local
- [Express 5](https://expressjs.com) — Servidor backend

## Licencia

MIT — Libre para uso personal y comercial.
