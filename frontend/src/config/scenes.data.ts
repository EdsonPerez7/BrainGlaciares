/**
 * ARCHIVO DE LA VERDAD - Escenas de Simulación de Glaciares y Lagunas
 * Cada laguna cuenta con 5 escenas históricas/técnicas auditables:
 * 1. El hielo (glaciar de cabecera y retroceso)
 * 2. La laguna (volumen, profundidad, altitud)
 * 3. El día que pasó (aluvión o evento crítico histórico)
 * 4. Aguas abajo (poblados amenazados o vacíos de información)
 * 5. Hoy (nivel de riesgo actual y obras de seguridad existentes)
 */

export interface EscenaLaguna {
  numero: 1 | 2 | 3 | 4 | 5;
  tituloFase: string; // ej: "el hielo", "la laguna", "el día que pasó", "aguas abajo", "hoy"
  texto: string;
  fuente: string;
  alertaFalta?: string;
  // Parámetros visuales del esquema SVG
  svgVisual: {
    nieveScale: number; // 1.0 (mucho hielo) a 0.6 (retroceso)
    aguaRx: number; // tamaño del radio X de la laguna
    aguaRy: number;
    colorAgua: string;
    tieneDique: boolean; // muestra el dique verde en la morrena (Escena 5)
    tieneOla: boolean; // muestra la ola de aluvión (Escena 3)
    pueblosVisibles: boolean; // muestra indicación de valle aguas abajo
  };
}

export interface LagunaConEscenas {
  id: string;
  nombre: string;
  departamento: string;
  cordillera: string;
  glaciarCabecera: string;
  anoEvento?: number;
  riesgo: "Muy alto" | "Alto" | "Medio" | "Bajo";
  escenas: EscenaLaguna[];
}

export const LAGUNAS_ESCENAS: Record<string, LagunaConEscenas> = {
  "513": {
    id: "513",
    nombre: "513",
    departamento: "Áncash",
    cordillera: "Blanca",
    glaciarCabecera: "Hualcán",
    anoEvento: 2010,
    riesgo: "Alto",
    escenas: [
      {
        numero: 1,
        tituloFase: "el hielo",
        texto: "El deshielo de Hualcán alimenta la laguna 513. En todo el Perú ya se perdió el 52 % del hielo (1962-2016).",
        fuente: "Fuente: INAIGEM 2017 · p. 9",
        svgVisual: { nieveScale: 1.0, aguaRx: 65, aguaRy: 18, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 2,
        tituloFase: "la laguna",
        texto: "El agua se juntó al pie del hielo: hoy la laguna 513 guarda 450 mil m³, con 84 m de fondo, a 4 431 m de altura.",
        fuente: "Fuente: ANA 2020 · p. 29",
        svgVisual: { nieveScale: 0.85, aguaRx: 85, aguaRy: 23, colorAgua: "#0369a1", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 3,
        tituloFase: "el día que pasó",
        texto: "En 2010 se registró un aluvión en la laguna 513 originado por caída de roca y hielo desde el Hualcán.",
        fuente: "Fuente: ANA 2012 · p. 1",
        svgVisual: { nieveScale: 0.75, aguaRx: 95, aguaRy: 26, colorAgua: "#0284c7", tieneDique: false, tieneOla: true, pueblosVisibles: false }
      },
      {
        numero: 4,
        tituloFase: "aguas abajo",
        texto: "Los documentos no registran qué pueblos están aguas abajo: es una pieza que falta y una pregunta para las autoridades.",
        fuente: "Fuente: Evaluación territorial INAIGEM",
        alertaFalta: "Pieza que falta en los documentos",
        svgVisual: { nieveScale: 0.7, aguaRx: 85, aguaRy: 23, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: true }
      },
      {
        numero: 5,
        tituloFase: "hoy",
        texto: "Hoy su riesgo es alto. La protegen túneles de desagüe tallados en roca viva y un sistema de alerta temprana (SAT).",
        fuente: "Fuente: INAIGEM 2021 · p. 44",
        svgVisual: { nieveScale: 0.65, aguaRx: 80, aguaRy: 22, colorAgua: "#0ea5e9", tieneDique: true, tieneOla: false, pueblosVisibles: true }
      }
    ]
  },
  "palcacocha": {
    id: "palcacocha",
    nombre: "Palcacocha",
    departamento: "Áncash",
    cordillera: "Blanca",
    glaciarCabecera: "Palcaraju",
    anoEvento: 1941,
    riesgo: "Muy alto",
    escenas: [
      {
        numero: 1,
        tituloFase: "el hielo",
        texto: "El glaciar Palcaraju alimenta la laguna Palcacocha. Es uno de los glaciares con mayor tasa de fusión en la Cordillera Blanca.",
        fuente: "Fuente: INAIGEM 2018 · p. 15",
        svgVisual: { nieveScale: 1.0, aguaRx: 70, aguaRy: 20, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 2,
        tituloFase: "la laguna",
        texto: "Hoy la laguna Palcacocha guarda 17.3 millones de m³, con más de 70 m de fondo, a 4 566 m de altura.",
        fuente: "Fuente: ANA 2019 · p. 12",
        svgVisual: { nieveScale: 0.85, aguaRx: 90, aguaRy: 25, colorAgua: "#0369a1", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 3,
        tituloFase: "el día que pasó",
        texto: "El 13 de diciembre de 1941 una avalancha glaciar rompió el dique morrénico, sepultando un tercio de Huaraz.",
        fuente: "Fuente: INAIGEM 2016 · p. 5",
        svgVisual: { nieveScale: 0.75, aguaRx: 100, aguaRy: 27, colorAgua: "#0284c7", tieneDique: false, tieneOla: true, pueblosVisibles: false }
      },
      {
        numero: 4,
        tituloFase: "aguas abajo",
        texto: "Aguas abajo vive la ciudad de Huaraz (más de 120 mil habitantes), directamente en la trayectoria del cauce del río Quillcay.",
        fuente: "Fuente: ANA 2023 · p. 38",
        svgVisual: { nieveScale: 0.7, aguaRx: 90, aguaRy: 25, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: true }
      },
      {
        numero: 5,
        tituloFase: "hoy",
        texto: "Hoy su riesgo es muy alto. La protegen: dique, obras de seguridad (sifones flotantes) y sistema de alerta temprana.",
        fuente: "Fuente: INAIGEM 2019 · p. 132",
        svgVisual: { nieveScale: 0.65, aguaRx: 90, aguaRy: 25, colorAgua: "#0284c7", tieneDique: true, tieneOla: false, pueblosVisibles: true }
      }
    ]
  },
  "paron": {
    id: "paron",
    nombre: "Parón",
    departamento: "Áncash",
    cordillera: "Blanca",
    glaciarCabecera: "Huandoy",
    anoEvento: 1953,
    riesgo: "Muy alto",
    escenas: [
      {
        numero: 1,
        tituloFase: "el hielo",
        texto: "Alimentada por el Huandoy, Pirámide de Garcilaso y Chacraraju en la parte alta de la Cordillera Blanca.",
        fuente: "Fuente: ANA 2021 · p. 10",
        svgVisual: { nieveScale: 1.0, aguaRx: 75, aguaRy: 20, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 2,
        tituloFase: "la laguna",
        texto: "Es la laguna más grande de la cordillera: retiene 55 millones de m³ de agua a 4 185 m de altura.",
        fuente: "Fuente: ANA 2022 · p. 18",
        svgVisual: { nieveScale: 0.85, aguaRx: 105, aguaRy: 28, colorAgua: "#0369a1", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 3,
        tituloFase: "el día que pasó",
        texto: "En 1953 se registró un desborde violento que activó el sistema de cuencas del río Llullán.",
        fuente: "Fuente: INAIGEM 2020 · p. 25",
        svgVisual: { nieveScale: 0.75, aguaRx: 110, aguaRy: 29, colorAgua: "#0284c7", tieneDique: false, tieneOla: true, pueblosVisibles: false }
      },
      {
        numero: 4,
        tituloFase: "aguas abajo",
        texto: "Amenaza a la ciudad de Caraz y las poblaciones rurales de Huaylas situadas en el cono aluvial.",
        fuente: "Fuente: ANA 2023 · p. 39",
        svgVisual: { nieveScale: 0.7, aguaRx: 105, aguaRy: 28, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: true }
      },
      {
        numero: 5,
        tituloFase: "hoy",
        texto: "Hoy su riesgo es muy alto. Cuenta con un túnel de descarga artificial permanente para regular el espejo de agua.",
        fuente: "Fuente: ANA 2023 · p. 42",
        svgVisual: { nieveScale: 0.65, aguaRx: 95, aguaRy: 25, colorAgua: "#0ea5e9", tieneDique: true, tieneOla: false, pueblosVisibles: true }
      }
    ]
  },
  "upiscocha": {
    id: "upiscocha",
    nombre: "Upiscocha",
    departamento: "Cusco",
    cordillera: "Vilcanota",
    glaciarCabecera: "Ausangate",
    anoEvento: 2022,
    riesgo: "Alto",
    escenas: [
      {
        numero: 1,
        tituloFase: "el hielo",
        texto: "El nevado sagrado Ausangate en el Cusco presenta una acelerada pérdida de masa glaciar en la última década.",
        fuente: "Fuente: SENAMHI 2021 · p. 33",
        svgVisual: { nieveScale: 1.0, aguaRx: 60, aguaRy: 17, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 2,
        tituloFase: "la laguna",
        texto: "La laguna Upiscocha almacena 4.1 millones de m³ a 4 510 m de altitud al pie de glaciares colgantes.",
        fuente: "Fuente: INAIGEM 2022 · p. 14",
        svgVisual: { nieveScale: 0.85, aguaRx: 75, aguaRy: 21, colorAgua: "#0369a1", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 3,
        tituloFase: "el día que pasó",
        texto: "En 2022 el colapso de un bloque de hielo originó oleajes que amenazaron con desbordar la morrena frontal.",
        fuente: "Fuente: INAIGEM 2022 · p. 21",
        svgVisual: { nieveScale: 0.75, aguaRx: 85, aguaRy: 24, colorAgua: "#0284c7", tieneDique: false, tieneOla: true, pueblosVisibles: false }
      },
      {
        numero: 4,
        tituloFase: "aguas abajo",
        texto: "Amenaza a la comunidad campesina de Upis y las vías de acceso turístico y ganadero de Ocongate.",
        fuente: "Fuente: INDECI 2023 · p. 7",
        svgVisual: { nieveScale: 0.7, aguaRx: 75, aguaRy: 21, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: true }
      },
      {
        numero: 5,
        tituloFase: "hoy",
        texto: "Hoy su riesgo es alto. No cuenta con obras de seguridad estructurales registradas, requiriendo monitoreo urgente.",
        fuente: "Fuente: INAIGEM 2024 · p. 45",
        svgVisual: { nieveScale: 0.65, aguaRx: 75, aguaRy: 21, colorAgua: "#0ea5e9", tieneDique: false, tieneOla: false, pueblosVisibles: true }
      }
    ]
  },
  "gangrajanca": {
    id: "gangrajanca",
    nombre: "Gangrajanca",
    departamento: "Huánuco",
    cordillera: "Huayhuash",
    glaciarCabecera: "Yerupajá",
    riesgo: "Muy alto",
    escenas: [
      {
        numero: 1,
        tituloFase: "el hielo",
        texto: "Alimentada por el coloso Yerupajá en la Cordillera Huayhuash, límite entre Áncash y Huánuco.",
        fuente: "Fuente: INAIGEM 2019 · p. 8",
        svgVisual: { nieveScale: 1.0, aguaRx: 65, aguaRy: 18, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 2,
        tituloFase: "la laguna",
        texto: "Retiene 6.7 millones de m³ en una fosa profunda rodeada de morrenas inestables a 4 310 m de altitud.",
        fuente: "Fuente: ANA 2020 · p. 15",
        svgVisual: { nieveScale: 0.85, aguaRx: 80, aguaRy: 22, colorAgua: "#0369a1", tieneDique: false, tieneOla: false, pueblosVisibles: false }
      },
      {
        numero: 3,
        tituloFase: "el día que pasó",
        texto: "Registro histórico de desbordes por aludes que afectaron las subcuencas del río Lauricocha.",
        fuente: "Fuente: ANA 2015 · p. 11",
        svgVisual: { nieveScale: 0.75, aguaRx: 90, aguaRy: 25, colorAgua: "#0284c7", tieneDique: false, tieneOla: true, pueblosVisibles: false }
      },
      {
        numero: 4,
        tituloFase: "aguas abajo",
        texto: "Amenaza a centros poblados de Queropalca y la cuenca alta del río Marañón.",
        fuente: "Fuente: INAIGEM 2023 · p. 30",
        svgVisual: { nieveScale: 0.7, aguaRx: 80, aguaRy: 22, colorAgua: "#0284c7", tieneDique: false, tieneOla: false, pueblosVisibles: true }
      },
      {
        numero: 5,
        tituloFase: "hoy",
        texto: "Hoy su riesgo es muy alto. La pendiente pronunciada de su morrena frontal exige obras de desagüe y encauzamiento.",
        fuente: "Fuente: INAIGEM 2024 · p. 52",
        svgVisual: { nieveScale: 0.65, aguaRx: 80, aguaRy: 22, colorAgua: "#0ea5e9", tieneDique: false, tieneOla: false, pueblosVisibles: true }
      }
    ]
  }
};
