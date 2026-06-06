# TecnoAVTrivia

Trivia interactiva de ciberseguridad con predicción del partido Ecuador vs Costa de Marfil — Copa Mundial 2026.

## Descripción

Aplicación web desarrollada para TecnoAV que combina una trivia de 3 preguntas sobre ciberseguridad con un concurso de predicción de marcador del partido inaugural del Mundial 2026 entre Ecuador y Costa de Marfil.

Los participantes registran sus datos, responden las preguntas de trivia y predicen el marcador del partido. Los datos se envían a Google Sheets mediante un webhook.

## Características

- **Trivia de ciberseguridad** — 3 preguntas de opción múltiple sobre phishing, autenticación MFA y activos digitales
- **Predicción de marcador** — Selector visual para predecir el resultado del partido Ecuador vs Costa de Marfil
- **Flujo de registro** — Formulario de contacto con validación
- **Integración con Google Sheets** — Envío de participaciones via webhook

## Tech Stack

- **Next.js 14** con App Router
- **React 18**
- **TypeScript**
- **CSS Modules**

## Variables de Entorno

```env
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=   # URL del Apps Script (lado cliente)
SHEETS_WEBHOOK_URL=               # URL del Apps Script (lado servidor)
```

## Scripts

```bash
npm install
npm run dev    # Desarrollo en http://localhost:3000
npm run build  # Producción
npm start      # Iniciar producción
```

## Estructura

```
app/
├── api/participacion/route.ts   # Endpoint API para enviar datos
├── page.tsx                      # Componente principal de la trivia
├── layout.tsx                    # Layout raíz
├── globals.css                   # Estilos globales
└── trivia.module.css             # Estilos del módulo
assets/                           # Imágenes estáticas (banderas, logos)
```

## Flujo

1. **Intro** — Presentación con logos y datos del partido
2. **Registro** — Formulario de datos del participante
3. **Trivia** — 3 preguntas de ciberseguridad con feedback visual
4. **Predicción** — Selector de marcador Ecuador vs Costa de Marfil
5. **Confirmación** — Resumen y envío a Google Sheets
