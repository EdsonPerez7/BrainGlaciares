/**
 * landmarks.data.ts
 * Catálogo maestro de Nevados y Lagunas Glaciares extraídos de la base de datos RAG y Grafo de Conocimiento
 * (Fuentes oficiales: INAIGEM, ANA, SENAMHI digitalizados en el proyecto Brain Glaciares)
 */

export interface LandmarkPair {
  id: string;
  sequenceOrder: number; // 1 a 8 en el sobrevuelo continuo
  
  // Datos del Nevado (Cumbre)
  peak: {
    id: string;
    nombre: string;
    altitudMsnm: number;
    cordillera: string;
    departamento: string;
    colosoRank: string; // ej. "#1 Máxima cumbre del Perú"
    resumenRAG: string;
    // Posición espacial 3D en el ciclo de 5600m
    worldX: number;
    worldZ: number;
    elevation3D: number; // Altura proporcional calculada
  };

  // Datos de la Laguna Conectada (Cuenca)
  lagoon: {
    id: string;
    nombre: string;
    altitudMsnm: number;
    riesgo: 'Muy alto' | 'Alto' | 'Medio';
    volumenHm3?: number;
    volumenTexto: string;
    eventoHistorico?: string;
    obrasSeguridad?: string;
    resumenRAG: string;
    // Posición y dimensiones 3D de la cuenca lacustre
    centerX: number;
    centerZ: number;
    radiusX: number;
    radiusZ: number;
    waterLevel: number;
    depth: number;
    type: 'high_cirque' | 'valley_lake' | 'moraine_tarn';
    waterColor: string;
    deepWaterColor: string;
  };

  // Conexión Hidrológica
  connection: {
    tipo: 'ALIMENTADA_POR';
    glaciarIntermedio?: string;
    descripcion: string;
  };
}

/**
 * Función matemática para escalar proporcionalmente la altura 3D según la altitud m s.n.m. real
 * Cota base de los valles andinos: ~5,200 m
 * Cumbre máxima: Huascarán a 6,768 m -> 350 m (maxAltitude)
 */
export function calculateProportional3DElevation(altitudMsnm: number, max3DAltitude = 350): number {
  const minMsnm = 5200;
  const maxMsnm = 6768;
  const min3D = 230; // Cota base de cumbres secundarias
  const t = Math.max(0, Math.min(1, (altitudMsnm - minMsnm) / (maxMsnm - minMsnm)));
  return Math.round((min3D + (max3DAltitude - min3D) * t) * 10) / 10;
}

export const LANDMARK_PAIRS: LandmarkPair[] = [
  // 1. HUASCARÁN & LLANGANUCO (El rey indiscutible de los Andes peruanos)
  {
    id: 'landmark-huascaran',
    sequenceOrder: 1,
    peak: {
      id: 'huascaran',
      nombre: 'Nevado Huascarán',
      altitudMsnm: 6768,
      cordillera: 'Cordillera Blanca',
      departamento: 'Áncash',
      colosoRank: '#1 Máxima Cumbre del Perú',
      resumenRAG: 'Punto culminante del Perú y de toda la zona tropical del planeta. Registra monitoreo de retroceso glaciar continuo por INAIGEM.',
      worldX: 110,
      worldZ: -620,
      elevation3D: calculateProportional3DElevation(6768, 350) // 350.0 m
    },
    lagoon: {
      id: 'llanganuco',
      nombre: 'Laguna Llanganuco',
      altitudMsnm: 3850,
      riesgo: 'Alto',
      volumenTexto: '14.2 millones de m³',
      eventoHistorico: 'Aludes históricos de 1962 y terremoto-aluvión de 1970',
      obrasSeguridad: 'Monitoreo fotogramétrico y control del Parque Nacional',
      resumenRAG: 'Emblemático cuerpo de agua turquesa al pie de las paredes colosales del Huascarán y Huandoy.',
      centerX: -10,
      centerZ: -780,
      radiusX: 120,
      radiusZ: 155,
      waterLevel: 120,
      depth: 42,
      type: 'valley_lake',
      waterColor: '#06b6d4',
      deepWaterColor: '#083344'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciar Huascarán Norte',
      descripcion: 'Deshielos y escurrimientos glaciares directos de la vertiente occidental del coloso Huascarán.'
    }
  },

  // 2. HUANDOY & PARÓN (La laguna más grande de la Cordillera Blanca)
  {
    id: 'landmark-huandoy-paron',
    sequenceOrder: 2,
    peak: {
      id: 'huandoy',
      nombre: 'Nevado Huandoy',
      altitudMsnm: 6395,
      cordillera: 'Cordillera Blanca',
      departamento: 'Áncash',
      colosoRank: 'Gran Cuatricúspide Andina',
      resumenRAG: 'Complejo de cuatro cumbres glaciares imponentes frente al Huascarán en el callejón de Huaylas.',
      worldX: 310,
      worldZ: -1280,
      elevation3D: calculateProportional3DElevation(6395, 350) // ~321.3 m
    },
    lagoon: {
      id: 'paron',
      nombre: 'Laguna Parón',
      altitudMsnm: 4185,
      riesgo: 'Muy alto',
      volumenHm3: 55,
      volumenTexto: '55.0 millones de m³ (La mayor de la cordillera)',
      eventoHistorico: 'Desborde violento registrado en 1953',
      obrasSeguridad: 'Túnel de descarga y compuerta artificial permanente',
      resumenRAG: 'Retiene el mayor volumen de agua de la Cordillera Blanca. Su dique natural morrénico es monitoreado por riesgo de ola por avalancha.',
      centerX: 180,
      centerZ: -1440,
      radiusX: 145,
      radiusZ: 185,
      waterLevel: 98,
      depth: 54,
      type: 'valley_lake',
      waterColor: '#0891b2',
      deepWaterColor: '#0f293a'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciares Huandoy y Pirámide',
      descripcion: 'Alimentada por el circo glaciar de los nevados Huandoy, Chacraraju y Pirámide de Garcilaso.'
    }
  },

  // 3. ALPAMAYO & ARHUAYCOCHA (La silueta piramidal perfecta)
  {
    id: 'landmark-alpamayo-arhuaycocha',
    sequenceOrder: 3,
    peak: {
      id: 'alpamayo',
      nombre: 'Nevado Alpamayo',
      altitudMsnm: 5947,
      cordillera: 'Cordillera Blanca',
      departamento: 'Áncash',
      colosoRank: 'La Montaña más Bella del Mundo',
      resumenRAG: 'Pirámide de hielo perfecta reconocida internacionalmente. Su vertiente sur presenta canales de hielo colgante.',
      worldX: 85,
      worldZ: -1980,
      elevation3D: calculateProportional3DElevation(5947, 350) // ~287.0 m
    },
    lagoon: {
      id: 'arhuaycocha',
      nombre: 'Laguna Arhuaycocha',
      altitudMsnm: 4450,
      riesgo: 'Alto',
      volumenTexto: '18.5 millones de m³',
      eventoHistorico: 'Formación reciente por rápido retroceso glaciar desde 1970',
      obrasSeguridad: 'Monitoreo de estabilidad de dique morrénico',
      resumenRAG: 'Laguna proglaciar encajada en el anfiteatro de los nevados Pucahirca y Alpamayo.',
      centerX: -20,
      centerZ: -2140,
      radiusX: 110,
      radiusZ: 140,
      waterLevel: 142,
      depth: 38,
      type: 'high_cirque',
      waterColor: '#22d3ee',
      deepWaterColor: '#0e7490'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciar Pucahirca - Alpamayo',
      descripcion: 'El frente glaciar de ablación alimenta directamente el espejo de la laguna Arhuaycocha.'
    }
  },

  // 4. YERUPAJÁ & GANGRAJANCA (El coloso de la Cordillera Huayhuash)
  {
    id: 'landmark-yerupaja-gangrajanca',
    sequenceOrder: 4,
    peak: {
      id: 'yerupaja',
      nombre: 'Nevado Yerupajá',
      altitudMsnm: 6635,
      cordillera: 'Cordillera Huayhuash',
      departamento: 'Huánuco / Áncash',
      colosoRank: '#2 Gran Coloso de Huayhuash',
      resumenRAG: 'El coloso de la Cordillera Huayhuash, con paredes verticales de roca y hielo de más de 1,000 m.',
      worldX: 320,
      worldZ: -2680,
      elevation3D: calculateProportional3DElevation(6635, 350) // ~339.8 m
    },
    lagoon: {
      id: 'gangrajanca',
      nombre: 'Laguna Gangrajanca',
      altitudMsnm: 4310,
      riesgo: 'Muy alto',
      volumenTexto: '6.7 millones de m³',
      eventoHistorico: 'Aludes históricos que afectaron la subcuenca Lauricocha',
      obrasSeguridad: 'Proyecto de desagüe morrénico pendiente de ejecución',
      resumenRAG: 'Laguna de alto peligro que descarga hacia la cuenca alta del río Marañón.',
      centerX: 190,
      centerZ: -2840,
      radiusX: 135,
      radiusZ: 175,
      waterLevel: 92,
      depth: 48,
      type: 'valley_lake',
      waterColor: '#0284c7',
      deepWaterColor: '#082f49'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciar Yerupajá Este',
      descripcion: 'Lenguas de hielo colapsante del flanco oriental del Yerupajá descienden hacia Gangrajanca.'
    }
  },

  // 5. HUALCÁN & LAGUNA 513 (Hito de ingeniería y alerta temprana)
  {
    id: 'landmark-hualcan-513',
    sequenceOrder: 5,
    peak: {
      id: 'hualcan',
      nombre: 'Nevado Hualcán',
      altitudMsnm: 6122,
      cordillera: 'Cordillera Blanca',
      departamento: 'Áncash',
      colosoRank: 'Cumbre Glaciar de Carhuaz',
      resumenRAG: 'Nevado con glaciares colgantes en su vertiente suroriental sobre la quebrada Chuchún.',
      worldX: 95,
      worldZ: -3380,
      elevation3D: calculateProportional3DElevation(6122, 350) // ~300.4 m
    },
    lagoon: {
      id: '513',
      nombre: 'Laguna 513',
      altitudMsnm: 4431,
      riesgo: 'Alto',
      volumenHm3: 0.45,
      volumenTexto: '450 mil m³ (84 m de profundidad)',
      eventoHistorico: 'Aluvión del 11 de abril de 2010 por caída de roca y hielo',
      obrasSeguridad: 'Túneles de desagüe en roca viva y Sistema de Alerta Temprana (SAT)',
      resumenRAG: 'Caso de éxito en prevención de desastres: sus túneles tallados en roca amortiguaron el aluvión de 2010.',
      centerX: -15,
      centerZ: -3540,
      radiusX: 110,
      radiusZ: 145,
      waterLevel: 136,
      depth: 36,
      type: 'moraine_tarn',
      waterColor: '#38bdf8',
      deepWaterColor: '#0369a1'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciar Hualcán Sur',
      descripcion: 'El deshielo directo del Hualcán llena la cubeta excavada en roca viva de la Laguna 513.'
    }
  },

  // 6. PALCARAJU / PUCARANRA & PALCACOCHA (La laguna más crítica sobre Huaraz)
  {
    id: 'landmark-palcaraju-palcacocha',
    sequenceOrder: 6,
    peak: {
      id: 'palcaraju',
      nombre: 'Nevado Palcaraju',
      altitudMsnm: 6274,
      cordillera: 'Cordillera Blanca',
      departamento: 'Áncash',
      colosoRank: 'Macizo de Tres Cumbres (Cojup)',
      resumenRAG: 'Junto con el Pucaranra (6,156 m), conforma la cabecera glaciar de la quebrada Cojup.',
      worldX: 300,
      worldZ: -4080,
      elevation3D: calculateProportional3DElevation(6274, 350) // ~312.0 m
    },
    lagoon: {
      id: 'palcacocha',
      nombre: 'Laguna Palcacocha',
      altitudMsnm: 4566,
      riesgo: 'Muy alto',
      volumenHm3: 17.3,
      volumenTexto: '17.3 millones de m³ (Amenaza crítica a Huaraz)',
      eventoHistorico: 'Aluvión catastrófico de 1941 (destruyó un tercio de Huaraz)',
      obrasSeguridad: 'Dique morrénico, sifones de bombeo continuo y SAT Quillcay',
      resumenRAG: 'La laguna de mayor riesgo del Perú: se ubica directamente sobre la ciudad de Huaraz (120,000 hab.).',
      centerX: 175,
      centerZ: -4240,
      radiusX: 125,
      radiusZ: 165,
      waterLevel: 115,
      depth: 46,
      type: 'high_cirque',
      waterColor: '#06b6d4',
      deepWaterColor: '#083344'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciares Palcaraju y Pucaranra',
      descripcion: 'Glaciares reconstituidos y lenguas de hielo colgante descargan directamente sobre el vaso de Palcacocha.'
    }
  },

  // 7. TOCLLARAJU & LLACA (Cabecera de la quebrada Llaca en Huaraz)
  {
    id: 'landmark-tocllaraju-llaca',
    sequenceOrder: 7,
    peak: {
      id: 'tocllaraju',
      nombre: 'Nevado Tocllaraju',
      altitudMsnm: 6032,
      cordillera: 'Cordillera Blanca',
      departamento: 'Áncash',
      colosoRank: 'Pirámide Mayor de Ishinca',
      resumenRAG: 'Célebre pico nevado que domina las quebradas Ishinca y Llaca junto al Ranrapalca.',
      worldX: 90,
      worldZ: -4740,
      elevation3D: calculateProportional3DElevation(6032, 350) // ~293.5 m
    },
    lagoon: {
      id: 'llaca',
      nombre: 'Laguna Llaca',
      altitudMsnm: 4472,
      riesgo: 'Muy alto',
      volumenTexto: '2.4 millones de m³',
      eventoHistorico: 'Desprendimientos glaciares registrados en 2025',
      obrasSeguridad: 'Dique de contención y canal de purga regulado',
      resumenRAG: 'Laguna proglaciar situada en contacto íntimo con la lengua activa del glaciar Llaca.',
      centerX: -10,
      centerZ: -4900,
      radiusX: 115,
      radiusZ: 150,
      waterLevel: 128,
      depth: 38,
      type: 'moraine_tarn',
      waterColor: '#14b8a6',
      deepWaterColor: '#134e4a'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciar Llaca',
      descripcion: 'Del continuo retroceso de la lengua terminal del glaciar Llaca nace y se expande la laguna.'
    }
  },

  // 8. AUSANGATE & UPISCOCHA (El nevado sagrado del Cusco)
  {
    id: 'landmark-ausangate-upiscocha',
    sequenceOrder: 8,
    peak: {
      id: 'ausangate',
      nombre: 'Nevado Ausangate',
      altitudMsnm: 6384,
      cordillera: 'Cordillera Vilcanota',
      departamento: 'Cusco',
      colosoRank: 'Apu Sagrado del Cusco',
      resumenRAG: 'Apu tutelar de la cosmovisión andina cusqueña y máxima cumbre de la Cordillera Vilcanota.',
      worldX: 280,
      worldZ: -5240,
      elevation3D: calculateProportional3DElevation(6384, 350) // ~320.5 m
    },
    lagoon: {
      id: 'upiscocha',
      nombre: 'Laguna Upiscocha',
      altitudMsnm: 4510,
      riesgo: 'Alto',
      volumenTexto: '4.1 millones de m³',
      eventoHistorico: 'Oleaje por colapso de bloque de hielo en 2022',
      obrasSeguridad: 'Monitoreo de emergencia por INDECI y Gobierno Regional',
      resumenRAG: 'Almacena agua al pie de glaciares colgantes, amenazando a la comunidad campesina de Upis.',
      centerX: 160,
      centerZ: -5400,
      radiusX: 105,
      radiusZ: 140,
      waterLevel: 135,
      depth: 35,
      type: 'high_cirque',
      waterColor: '#06b6d4',
      deepWaterColor: '#083344'
    },
    connection: {
      tipo: 'ALIMENTADA_POR',
      glaciarIntermedio: 'Glaciar Colgante Ausangate Norte',
      descripcion: 'Torrentes de ablación y bloques de hielo descienden de las paredes del Ausangate hacia Upiscocha.'
    }
  }
];
