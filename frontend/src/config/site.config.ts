/**
 * ARCHIVO DE LA VERDAD (Single Source of Truth) - Configuración General del Sitio
 * Este archivo centraliza rutas, nombres, metadatos y endpoints.
 * Modificar aquí actualiza automáticamente toda la aplicación.
 */

export const SITE_CONFIG = {
  name: "ARQEN",
  acronym: "Alerta de Riesgo en Quebradas con Evidencia Nacional",
  tagline: "Alerta de Riesgo en Quebradas con Evidencia Nacional",
  formerName: "Brain Glaciares",
  institution: "UNMSM · Facultad de Ingeniería de Sistemas e Informática · Grupo G8",
  description: "ARQEN (Alerta de Riesgo en Quebradas con Evidencia Nacional): Plataforma científica para la exploración y consulta del inventario de glaciares, lagunas de alta montaña y riesgo de desbordes (GLOFs) en el Perú.",
  author: "Grupo G8 · Gestión del Conocimiento 2026",
  
  // URLs de despliegue y API
  domain: "brainglaciares.pages.dev",
  fallbackDomain: "brainglaciaresunmsm.pages.dev",
  // Define PUBLIC_API_URL en .env (ver .env.example). El túnel "quick" de Cloudflare
  // cambia de URL en cada reinicio: úsalo solo como respaldo temporal.
  apiBaseUrl: import.meta.env.PUBLIC_API_URL || "https://literacy-enjoyed-basin-priorities.trycloudflare.com",

  // Navegación principal (Sobria e institucional)
  navigation: [
    { label: "Inicio", href: "/" },
    { label: "Buscar", href: "/buscar" },
    { label: "Aluvión", href: "/aluvion" },
    { label: "Comparar", href: "/comparar" },
    { label: "Panorama", href: "/panorama" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Metodología", href: "/metodologia" }
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
