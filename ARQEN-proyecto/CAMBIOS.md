# ARQEN: cambios aplicados

## Animación y movimiento
- Se quitó el temblor de la escena 3 del simulador (keyframes `temblorAluvionSim` y la lógica `sacudida`).
- Se quitaron los `animate-ping` y `animate-pulse` decorativos. Solo queda el indicador "pensando" del chat.
- El autoplay del simulador se pausa cuando la sección no está en pantalla.
- Se respeta `prefers-reduced-motion`: sin autoplay, sin parallax y con animaciones mínimas.
- Errata corregida: "ALURIÓN" → "ALUVIÓN".

## Seguridad (frontend)
- `src/utils/seguridad.ts`: `esc()`, `urlSegura()`, `acotar()` y `markdownSeguro()`.
- **Chat**: la respuesta del LLM se escapaba mal y se metía con `innerHTML`. Un documento del corpus con HTML malicioso podía ejecutar JavaScript (inyección indirecta vía RAG). Ahora se escapa todo y luego se aplica el markdown.
- Escape aplicado en SearchBox, buscar.astro, GlacierMap (popups), SearchAndMap, ComparatorSection (SVG de la red) y AcercaDe.
- buscar.astro: se cambiaron los `onclick="...('${id}')"` en línea, que permitían inyectar código, por delegación de eventos.
- `href` dinámicos validados: se bloquean `javascript:` y `data:`.
- Parámetros `limite` y `q` acotados antes de enviarse al backend.
- `public/_headers` (Cloudflare Pages): CSP, HSTS, X-Frame-Options, Permissions-Policy y COOP.
- La fuente Inter se sirve desde el propio sitio (`@fontsource-variable/inter`), así que ya no se hacen peticiones a Google Fonts.
- `.env.example`: define `PUBLIC_API_URL` en lugar de depender del túnel quick de Cloudflare.
- Archivo `vista_riesgo_#U00c1ncash.html` renombrado a `vista_riesgo_Ancash.html` (el `#` rompía la URL).

## Seguridad (backend)
- `_ip()`: antes se tomaba el **primer** valor de X-Forwarded-For, que controla el cliente, así que el límite por IP se podía saltar. Ahora se usa `CF-Connecting-IP` o el **último** valor.
- `/api/evaluacion/simular` y `/api/evaluacion/evaluar-uno` ahora exigen `ADMIN_API_KEY`. Antes cualquiera podía gastar tokens del LLM y escribir en disco.
- Se acotaron `limite`/`q` en `/api/catalogo` y `/api/buscar`, y se puso `max_length` a la pregunta.
- docker-compose: `CORS_ORIGENES=*` → lista explícita de dominios.

## UI/UX
- Nueva marca ARQEN: logo, favicon, navbar, footer y metadatos OG.
- Navbar: menú móvil (antes no había navegación en móvil), estado del servidor con texto honesto y `aria-current`.
- Portada reordenada: pregunta → contexto → buscar → simulador → comparar → metodología. Se retiró ExploreCards porque repetía enlaces.
- "Mountain Studio" (20 sliders de calibración 3D): ahora solo aparece en desarrollo o con `PUBLIC_ESTUDIO_3D=true`.
- El HUD "Sobrevuelo aéreo en vivo" pasa a "Relieve 3D ilustrativo" (no es en vivo) y se movió para no tapar el botón del chat.
- Chat: `role="dialog"`, Esc para cerrar, foco al abrir, Enter para enviar, `sesion_id` para preguntas de seguimiento, mensajes de error claros (incluye el 429) y se quitó el falso "En línea".
- Tipografía mínima de 11 px (antes 9–10 px), enlace "Saltar al contenido", `scroll-margin` para que las anclas no queden bajo la barra.
- Footer: aviso de emergencias con enlace directo `tel:115`.

---

# Versión 2: rediseño completo

## Identidad
- Tipografías: Aldrich en el logo, Space Grotesk en los títulos, IBM Plex Sans en la interfaz e IBM Plex Mono en los datos. Ya no se usa Arial ni sus derivados en ninguna parte, tampoco en los textos SVG ni en el mapa.
- Paleta: noche andina, turquesa laguna, hielo, cochinilla y ocre puna. Los colores de riesgo se usan solo para indicar riesgo.
- Tejido andino propio (`public/marca/tejido.svg` y `franja.svg`), inspirado en el pallay sin copiar el diseño de ninguna comunidad: trama sutil en la portada y ribete en las tarjetas.
- Las tarjetas tienen color según su tema (hielo, laguna, riesgo, historia, marca) y los botones tienen jerarquía: principal, marca, secundario, hielo, terciario y cristal.

## Portada 3D real (Cesium)
- Relieve real de la Cordillera Blanca, iluminado según la hora de Huaraz (día, hora azul o noche).
- Recorrido en 3 paradas: Parón → Laguna 513 → Palcacocha. Si la persona toca la escena, el recorrido se pausa.
- Póster ilustrado que se ve al instante. Si el 3D no carga, la portada sigue funcionando.
- En computadora el 3D se carga solo; en celular, a pedido. Cesium se descarga únicamente cuando hace falta.
- Ficha de laguna: botón "Ver en 3D real" que abre una ventana y vuela hasta esa laguna.

## Asistente único
- Una sola burbuja. La ventana se puede mover arrastrándola, se pega a los bordes y recuerda dónde la dejaste. En celular se abre como hoja desde abajo.
- Sabe qué estás mirando: la sección, la laguna, la comparación o el gráfico.
- Al tocar cualquier gráfico propone 3 preguntas sobre lo que tocaste.
- Tres capas para responder: IA con citas → evidencia de los informes → reglas sin IA y sin servidor. Siempre hay una respuesta.

## Aportes nuevos
- "¿Cuánta agua es?": el volumen de cada laguna expresado en piscinas olímpicas.
- Sección "Qué hacer ante un aluvión" con los teléfonos 115 (INDECI) y 116 (bomberos).
- "Tu zona en 30 segundos": resumen por departamento.
- Insignia de evidencia: cuántos informes respaldan cada laguna.
- Comparador organizado en pestañas: Riesgo y agua, Historia, Relaciones.

## Informe PDF corporativo
- Tres tipos: laguna, comparación y departamento. Se genera en el navegador, sin IA y sin servidor.
- Portada de marca, resumen ejecutivo, indicadores, gráficos vectoriales, línea de tiempo, qué hacer ante un aluvión y fuentes citadas.

## Verificación
- Sin desbordes ni errores en 4 tamaños de pantalla: 390, 820, 1366 y 1920 px.
- Backend: todas las rutas responden igual que antes. Solo cambian los dos endpoints de evaluación, que ahora exigen `ADMIN_API_KEY`.


---

# Versión 3: una página por pestaña

- **Páginas separadas:** Inicio, Buscar, Aluvión, Comparar, Panorama y Metodología. Cada una muestra solo lo suyo y el menú marca dónde estás.
- **Inicio:** portada 3D, el país en cuatro datos y accesos rápidos.
- **Aluvión:** se reemplazó el dibujo por "El camino de un aluvión":
  - Recorrido en 5 pasos sobre el relieve 3D real (Cesium).
  - Perfil de caída. Con el 3D cargado usa alturas reales del terreno; sin él, los puntos clave.
  - Lista con la línea de tiempo de aluviones registrados.
  - "Prepárate" al final de la página.
- **Comparar:** la red de relaciones ahora es dinámica:
  - Se acomoda sola (simulación de fuerzas con d3-force) y los nodos se pueden arrastrar.
  - Al pasar el mouse resalta las conexiones; al tocar un nodo, el asistente sugiere preguntas.
  - Las etiquetas se ven completas y nada se corta.
  - Se agregó un mapa con las dos lagunas y la distancia entre ellas.
- **Panorama:** gráfico de burbujas (altitud, volumen e informes), "¿Están protegidas?" (obras por nivel de riesgo) y el mapa con "tu zona en 30 segundos".
- **Metodología:** gráfico de fuentes por institución y cifras del grafo de conocimiento.
- **Fondos:** los fondos claros llevan el tejido andino muy sutil.
- **Verificación:** 6 páginas × 4 tamaños de pantalla, sin errores ni elementos cortados.
