/**
 * ARCHIVO DE LA VERDAD (Single Source of Truth) - Configuración General del Sitio
 * Este archivo centraliza rutas, nombres, metadatos y endpoints.
 * Modificar aquí actualiza automáticamente toda la aplicación.
 */

export const SITE_CONFIG = {
  name: "BRAIN GLACIARES",
  tagline: "Conocimiento Conectado sobre el Riesgo Glaciar en el Perú",
  institution: "UNMSM · Facultad de Ingeniería de Sistemas e Informática · Grupo G8",
  description: "Plataforma científica para la exploración y consulta del inventario de glaciares, lagunas de alta montaña y riesgo de desbordes (GLOFs) en el Perú.",
  author: "Grupo G8 · Gestión del Conocimiento 2026",
  
  // URLs de despliegue y API
  domain: "brainglaciares.pages.dev",
  fallbackDomain: "brainglaciaresunmsm.pages.dev",
  // Si no hay variable de entorno, apunta al túnel de producción de Cloudflare
  apiBaseUrl: import.meta.env.PUBLIC_API_URL || "https://literacy-enjoyed-basin-priorities.trycloudflare.com",

  // Navegación principal (Sobria e institucional)
  navigation: [
    { label: "Inicio", href: "/" },
    { label: "Buscar", href: "/buscar" },
    { label: "Comparar", href: "/#comparar" },
    { label: "Panorama", href: "/#panorama" },
    { label: "Informes", href: "/#informes" },
    { label: "Acerca de", href: "/#acerca" }
  ],

  // Cifras clave del corpus de investigación
  corpus: {
    documentos_totales: 398,
    paginas_analizadas: 19452,
    nodos_grafo: 13829,
    relaciones_grafo: 37264,
    entidades_unicas: 11343,
    instituciones: ["INAIGEM", "ANA", "SENAMHI"]
  }
} as const;
