# ARQEN · frontend

Riesgo glaciar del Perú, con evidencia. Hecho con Astro 7 y Tailwind 4.

## Arranque

```sh
pnpm install
cp .env.example .env   # pon tu PUBLIC_API_URL y tu PUBLIC_CESIUM_TOKEN
pnpm dev               # copia los recursos de Cesium y levanta http://localhost:4321
pnpm build             # genera dist/ para Cloudflare Pages
```

## Piezas clave

| Pieza | Archivo |
|---|---|
| Sistema visual (tipografías, paleta, tarjetas, botones, tejido) | `src/styles/global.css`, `public/marca/` |
| Portada 3D real (Cesium, luz según la hora, recorrido) | `src/components/HeroSection.astro`, `src/scripts/hero3d.ts`, `src/config/recorrido.data.ts` |
| Asistente único movible | `src/components/Asistente.astro` |
| Contexto compartido (qué mira la persona) | `src/scripts/contexto.ts` |
| Respuestas sin IA (último respaldo) | `src/services/asistenteReglas.ts` |
| Informe PDF corporativo | `src/services/informePdf.ts`, `public/fuentes-pdf/` |
| Seguridad: escape anti-XSS y cabeceras | `src/utils/seguridad.ts`, `public/_headers` |

## Reglas del proyecto

- Todo dato externo pasa por `esc()` antes de ir a HTML. Toda URL dinámica pasa por `urlSegura()`.
- Para que un gráfico sugiera preguntas al asistente, agrégale `data-arqen-grafico="…"` y `data-arqen-valor="…"`.
- Cesium y el PDF se cargan solo cuando se piden, así que la carga inicial queda liviana.
- El token de Cesium va en `.env` y nunca en el código. Restríngelo a tu dominio desde la consola de Cesium ion.
