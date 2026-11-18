/**
 * DATOS ESTÁTICOS DE EVALUACIÓN Y AUDITORÍA RAGAS (30 Preguntas)
 * Pre-renderizado para despliegue de alta disponibilidad en Cloudflare Pages.
 * Permite renderizado instantáneo (SSG) sin depender de un túnel o servidor activo.
 */

export interface MetricasRagasItem {
  faithfulness: number | null;
  answer_relevancy: number | null;
  context_precision: number | null;
}

export interface PreguntaEvaluacion {
  id: string;
  tipo: string;
  pregunta: string;
  estado: 'validada' | 'observada' | 'fuera_dominio';
  estado_label: string;
  ragas: MetricasRagasItem | null;
  respuesta: string | null;
  fuentes: string[];
  n_fuentes: number;
  herramienta: string | null;
  modelo: string | null;
}

export interface ResumenEvaluacion {
  total_banco: number;
  validadas_exito: number;
  observadas: number;
  evaluadas_ragas: number;
  cobertura_pct: number;
  fidelidad_promedio: number;
  relevancia_promedio: number;
  precision_contexto_promedio: number;
}

export const RESUMEN_EVALUACION: ResumenEvaluacion = {
  "total_banco": 30,
  "validadas_exito": 27,
  "observadas": 3,
  "evaluadas_ragas": 30,
  "cobertura_pct": 90.0,
  "fidelidad_promedio": 0.9,
  "relevancia_promedio": 0.72,
  "precision_contexto_promedio": 0.81
};

export const PREGUNTAS_EVALUACION: PreguntaEvaluacion[] = [
  {
    "id": "P1",
    "tipo": "competencia",
    "pregunta": "¿Cuántas lagunas de origen glaciar se formaron en la Cordillera Blanca según el inventario de 2023?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.857,
      "context_precision": 0.963
    },
    "respuesta": "**Hechos del grafo** (5 filas):\n- inventario: Inventario Blanca 2023 · dato: registraGlaciares · valor: 511 glaciares [1]\n- inventario: Inventario Blanca 2023 · dato: registraLagunas · valor: 850 lagunas [2]\n- inventario: Inventario Blanca 2023 · dato: registraLagunasNuevas · valor: 25 lagunas [3]\n- inventario: Inventario Blanca 2023 · dato: registraLagunasProglaciares · valor: 23 lagunas [4]\n- inventario: Inventario Blanca 2023 · dato: registraSuperficieGlaciar · valor: 424.86 km2 [5]\n\n**Fragmentos relacionados:**\n- Resultados del inventario de glaciares para el departamento de Pasco Resultados del inventario de lagunas de origen glaciar para el departamento de Pasco por detritos del departamento de Pasco, según cordillera en el dep… [6]\n- En el presente inventario se han registran do 8466 lagunas de origen glaciar, cuya superficie total corresponde a 1081.31 km2. Estas lagunas están distribuidas en las 20 cordilleras glaciares y 14 departa mentos del país… [7]\n- SANTA HUARI HUARMEY CASMA HUARAZ RECUAY BOLOGNESI OCROS HUAYLAS SIHUAS AIJA YUNGAY PALLASCA CORONGO CARHUAZ POMABAMBA ASUNCIÓN MARISCAL LUZURIAGA ANTONIO RAYMONDI CARLOS FERMIN FITZCARRALD CORDILLERA HUALLANCA CORDILLERA… [8]\n- Resultados del inventario de glaciares para el departamento de Cusco GLACIAR QORI KALIS (Cordillera Vilcanota) Fotografía: Ing. Renny Díaz NEVADO SALKANTAY (Cordillera Vilcabamba) Fotografía: Ing. Oscar Vilca GLACIAR CHI… [9]",
    "fuentes": [
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, p. 68",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, p. 77",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, p. 82",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, p. 77",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, p. 68",
      "Catálogo de Mapas del Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, pp. 12–13",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, pp. 74–76",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, p. 85",
      "Catálogo de Mapas del Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, pp. 6–7"
    ],
    "n_fuentes": 9,
    "herramienta": "P1",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P2",
    "tipo": "competencia",
    "pregunta": "¿Qué lagunas glaciares de Áncash tienen riesgo muy alto de desborde?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.602,
      "context_precision": 0.95
    },
    "respuesta": "- Laguna **Cuchillacocha** – nivel muy alto [1]  \n- Laguna **Llaca** – nivel muy alto [2]  \n- Laguna **Palcacocha** – nivel muy alto [3]  \n- Laguna **Parón** – nivel muy alto [4]  \n- Laguna **Tullparaju** – nivel muy alto [5]",
    "fuentes": [
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 68",
      "Evaluación del peligro de aluvión por desborde de laguna glaciar en la subcuenca Casca — INAIGEM, 2026, p. 58",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 68",
      "Análisis de escenarios ante desborde violento de la laguna Parón para el nivel del peligro, provincia de Huaylas, depar… — ANA, 2023, p. 39",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 68"
    ],
    "n_fuentes": 5,
    "herramienta": "consulta_verificada",
    "modelo": "groq · openai/gpt-oss-120b"
  },
  {
    "id": "P3",
    "tipo": "competencia",
    "pregunta": "¿Qué centros poblados están aguas abajo de lagunas con riesgo alto y qué estudios los evaluaron?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.889,
      "answer_relevancy": 0.721,
      "context_precision": 0.853
    },
    "respuesta": "**Hechos del grafo** (72 filas):\n- laguna: Gangrajanca · nivel: Muy alto · poblado: Queropalca · via: el texto lo dice · estudios: 20.500.12748/608 [1]\n- laguna: Cuchillacocha · nivel: Muy alto · poblado: Huaraz · via: el texto lo dice · estudios: 20.500.12543/2093, 20.500.12748/140, 20.500.12543/1687, 20.500.12748/137, 20.500.12543/2005, 20.500.12543/3906, 20.500.12543/4601, 20.500.12748/672, 20.500.125… [2]\n- laguna: Palcacocha · nivel: Muy alto · poblado: Huaraz · via: el texto lo dice · estudios: 20.500.12543/2432, 20.500.12748/247, 20.500.12748/266, 20.500.12543/2093, 20.500.12748/612, 20.500.12543/3230, 20.500.12748/619, 20.500.12543/2081, 20.500.1274… [3]\n- laguna: Palcacocha · nivel: Muy alto · poblado: Huaraz · via: misma subcuenca · subcuenca: Quillcay · estudios: 20.500.12543/2432, 20.500.12748/247, 20.500.12748/266, 20.500.12543/2093, 20.500.12748/612, 20.500.12543/3230, 20.500.12748/619, 20.500.12543/2081, 20.500.1274… [4]\n- laguna: Parón · nivel: Muy alto · poblado: Musho · via: misma subcuenca · subcuenca: Ulta · estudios: 20.500.12748/551 [5]\n- laguna: Salkantaycocha · nivel: Alto · poblado: Santa Teresa · via: misma subcuenca · subcuenca: Salkantay · estudios: 20.500.12748/484, 20.500.12748/371, 20.500.12748/374, 20.500.12748/382, 20.500.12748/384 [6]\n- laguna: Upiscocha · nivel: Alto · poblado: Chavín · via: misma subcuenca · subcuenca: Quillcay · estudios: 20.500.12748/667 [7]\n- laguna: Llaca · nivel: Muy alto · poblado: Huaraz · via: misma subcuenca · subcuenca: Casca · estudios: 20.500.12543/3230, 20.500.12748/619, 20.500.12542/872, 20.500.12543/1505, 20.500.12543/1687, 20.500.12748/76, 20.500.12543/3906, 20.500.12748/507, 20.500.12748… [8]\n- laguna: Pacliashcocha · nivel: Alto · poblado: Carhuaz · via: misma subcuenca · subcuenca: Ulta · estudios: ",
    "fuentes": [
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 58",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 98",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nac… — ANA, 2024, p. 5",
      "Evaluación de las disponibilidades hídricas en la parte alta de las cuencas con aporte glaciar de las cordilleras: Blan… — ANA, 2024, p. 89",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 8 — INAIGEM, 2024, p. 102",
      "Análisis del clima actual y futuro en la cuenca del río Urubamba y sus impactos en la disponibilidad hídrica y cultivos… — SENAMHI, 2013, p. 76",
      "Riesgos e impactos del drenaje ácido de roca en los medios de vida de la población rural de la subcuenca del río Quillc… — INAIGEM, 2025, p. 76",
      "Información de Parcelas Piloto de la Subcuenca del Rio Casca 2016 — INAIGEM, 2016, p. 8",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 81",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 49"
    ],
    "n_fuentes": 24,
    "herramienta": "P3",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P4",
    "tipo": "competencia",
    "pregunta": "¿Qué lagunas tuvieron eventos de desborde, de qué glaciar provienen y qué poblados afectaron?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.938,
      "answer_relevancy": 0.82,
      "context_precision": 1.0
    },
    "respuesta": "- Se registraron **82** eventos de desborde en lagunas glaciares; se muestran 20 de ellos.  \n- **Laguna Tambillo** – Deslizamiento Tambillo 1870 – poblados afectados: Ancash, Rampac Chico, Macashca, Carhuaz, Huaraz. [1]  \n- **Laguna Tambillo** – Aluvión Tambillo 1883 – poblados afectados: Ancash, Rampac Chico, Macashca, Carhuaz, Huaraz. [2]  \n- **Laguna Solterococha** – Avalancha Solterococha 1917 – poblados afectados: Ranrahirca, Huari, Carhuaz, Yungay, Huaraz. [3]  \n- **Laguna Palcacocha** – Avalancha Palcacocha 1932 – glaciares origen: Randolph, Ranrapalca, Pucaranra, Palcaraju – poblado afectado: Huaraz. [4]  \n- **Laguna Artesa** – Aluvión Artesa 1938 – (poblados no registrados). [5]  \n- **Laguna Pakliashcocha** – Aluvión Pakliashcocha 1938 – (poblados no registrados). [6]  \n- **Laguna Arteza** – Aluvión Arteza 1938 – poblado afectado: Carhuaz. [7]  \n- **Laguna UH Quilcay** – Aluvión UH Quilcay 1941 – (poblados no registrados). [8]  \n- **Laguna Paleolake Jircacocha** – Aluvión Paleolake Jircacocha 1941 – (poblados no registrados). [9]  \n- **Laguna Jircacocha** – Aluvión Jircacocha 1941 – (poblados no registrados). [10]  \n- **Laguna Artesoncocha** – Aluvión Artesoncocha 1941 – (poblados no registrados). [11]  \n- **Laguna Palcacocha** – Avalancha Palcacocha 1941 – glaciares origen: Randolph, Ranrapalca, Pucaranra, Palcaraju – poblado afectado: Huaraz. [12]  \n- **Laguna Palcacocha** – Aluvión Palcacocha 1941 – glaciares origen: Randolph, Ranrapalca, Pucaranra, Palcaraju – poblado afectado: Huaraz. [13]  \n- **Laguna Palcacocha** – Aluvión Palcacocha 1947 – glaciares origen: Randolph, Ranrapalca, Pucaranra, Palcaraju – (poblados no registrados). [14]  \n- **Laguna Jancarurish** – Aluvión Jancarurish 1950 – poblado afectado: Huaraz. [15]  \n- **Laguna Artesoncocha** – Aluvión Artesoncocha 1951 – poblados afectados: Ranrahirca, Huari, Carhuaz, Yungay, Huaraz. [16]  \n- **Laguna Parón** – Aluvión Parón 1953 – glaciares origen: Jatunraju, Hatunraju, Aguja, Parón – poblados afectados: Ranrahirca, Huari, Carhuaz, Yungay, Huaraz. [17]  \n- **Laguna Tullparaju** – Deslizamiento Tullparaju 1962 – glacial origen: Tullparaju – poblados afectados: Ranrahirca, Huari, Carhuaz, Yungay, Huaraz. [18]  \n- **Laguna Chuspicocha** – Aluvión Chuspicocha 1969 – glaciares origen: Talves, Huaytapallana, Chuspicocha – (poblados no registrados). [19]  \n- **Laguna Safuna Alta** – Aluvión Safuna Alta 1970 – glaciares origen: Pisco,",
    "fuentes": [
      "Aplicación de modelos numéricos en peligros glaciares (caso laguna Palcacocha) — ANA, 2020, p. 3",
      "Fortalecimiento del manejo y seguridad de glaciares y lagunas en el Perú — ANA, 2003, p. 30",
      "Aplicación de modelos numéricos en peligros glaciares (caso laguna Palcacocha) — ANA, 2020, p. 3",
      "Informe de evaluación del estado de los glaciares en la cabecera de la laguna Palcacocha — ANA, 2003, p. 15",
      "Inspección Técnica de la laguna Cancahua debido al desborde del 3 de marzo de 2025. Distrito de Shilla, provincia de Ca… — INAIGEM, 2025, p. 18",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 1 — INAIGEM, 2016, p. 63",
      "Evaluación del riesgo por aluvión en la U.H Ranrahirca (Cordillera Blanca) — INAIGEM, 2024, p. 43",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 22",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 5 — INAIGEM, 2018, p. 21",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 8 — INAIGEM, 2024, p. 84",
      "New method for assessing the susceptibility of glacial lakes to outburst floods in the Cordillera Blanca, Peru — ANA, 2014, p. 14",
      "Informe técnico de la situación actual de la Laguna Glaciar Palcacocha - Enero — INAIGEM, 2016, p. 2",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2016 — INAIGEM, 2017, p. 97",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 5 — INAIGEM, 2018, p. 34",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 8 — INAIGEM, 2024, p. 82",
      "Evaluación del riesgo por aluvión en la U.H Ranrahirca (Cordillera Blanca) — INAIGEM, 2024, p. 43",
      "Aplicación de modelos numéricos en peligros glaciares (caso laguna Palcacocha) — ANA, 2020, p. 3",
      "Aplicación de modelos numéricos en peligros glaciares (caso laguna Palcacocha) — ANA, 2020, p. 3",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 28",
      "New method for assessing the susceptibility of glacial lakes to outburst floods in the Cordillera Blanca, Peru — ANA, 2014, p. 13"
    ],
    "n_fuentes": 20,
    "herramienta": "consulta_verificada",
    "modelo": "groq · openai/gpt-oss-20b"
  },
  {
    "id": "P5",
    "tipo": "competencia",
    "pregunta": "¿Qué glaciares con retroceso medido (balance de masa) alimentan lagunas que hoy están en riesgo?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.941,
      "answer_relevancy": 0.79,
      "context_precision": 0.86
    },
    "respuesta": "**Hechos del grafo** (16 filas):\n- glaciar: Ausangate · retroceso: retroceso reportado · laguna: Upiscocha · nivel: Alto [1]\n- glaciar: Llaca · retroceso: retroceso reportado · laguna: Llaca · nivel: Muy alto [2]\n- glaciar: Palcaraju · retroceso: retroceso reportado · laguna: Pacliashcocha · nivel: Alto [3]\n- glaciar: Pucaranra · retroceso: retroceso reportado · laguna: Palcacocha · nivel: Muy alto [4]\n- glaciar: Ranrapalca · retroceso: retroceso reportado · laguna: Palcacocha · nivel: Muy alto [5]\n- glaciar: Sarapo · retroceso: retroceso reportado · laguna: Quesillococha · nivel: Muy alto [6]\n- glaciar: Vallunaraju · retroceso: retroceso reportado · laguna: Artizón · nivel: Alto [7]\n- glaciar: Palcaraju · retroceso: medido (balance de masa) · laguna: Palcacocha · nivel: Muy alto [8]\n- glaciar: Huantsan · retroceso: en documento con balance de masa · laguna: Rajucolta · nivel: Alto [9]\n- glaciar: Llaca 1 · retroceso: en documento con balance de masa · laguna: Llaca · nivel: Muy alto [10]\n- glaciar: Pucajirca · retroceso: en documento con balance de masa · laguna: Taullicocha · nivel: Muy alto [11]\n- glaciar: Pucaranra · retroceso: en documento con balance de masa · laguna: Pacliashcocha · nivel: Alto [12]\n- glaciar: Randolph · retroceso: en documento con balance de masa · laguna: Palcacocha · nivel: Muy alto [13]\n- glaciar: Taulliraju · retroceso: en documento con balance de masa · laguna: Taullicocha · nivel: Muy alto [14]\n- glaciar: Tocllaraju · retroceso: en documento con balance de masa · laguna: Pacliashcocha · nivel: Alto [15]\n- glaciar: Tullparaju · retroceso: en documento con balance de masa · laguna: Tullparaju · nivel: Muy alto [16]\n\n**Fragmentos relacionados:**\n- En contraposición, el área donde se pierde masa por sublimación, evaporación o fusión de la nieve",
    "fuentes": [
      "Informe Técnico de Inspección A04 Laguna Upiscocha 2020 — INAIGEM, 2020, p. 6",
      "Informe Técnico N° 03 Glaciar Llaca — INAIGEM, 2016, p. 13",
      "Inspección de las lagunas: Pacliashcocha, Puraranracocha, Jatuncocha, Arhuaycocha, Taullicocha, Artizon, Yuraccocha — ANA, 2001, p. 2",
      "Informe técnico de la situación actual de la Laguna Glaciar Palcacocha - Octubre — INAIGEM, 2016, p. 3",
      "Lagunas reservas de agua dulce en Áncash: Resultados de estudios de batimetría en 38 lagunas glaciares — ANA, 2020, p. 8",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 25",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 74",
      "Informe técnico de la situación actual de la Laguna Glaciar Palcacocha - Octubre — INAIGEM, 2016, p. 3",
      "Evaluación de la concentración de metales en el agua superficial de la Unidad Hidrográfica (UH) Pariac-Rajucolta — INAIGEM, 2025, p. 11",
      "Evaluación del peligro de aluvión por desborde de laguna glaciar en la subcuenca Casca — INAIGEM, 2026, p. 36"
    ],
    "n_fuentes": 20,
    "herramienta": "P5",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P6",
    "tipo": "competencia",
    "pregunta": "¿Qué métodos de monitoreo se aplicaron a lagunas en riesgo y qué institución realizó cada estudio?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.9,
      "answer_relevancy": 0.68,
      "context_precision": 0.75
    },
    "respuesta": "**Hechos del grafo** (37 filas):\n- laguna: Artizón · metodo: Batimetría · instituciones_en_texto: Unidad de Glaciología · institucion_del_documento: INAIGEM [1]\n- laguna: Artizón · metodo: Fotogrametría · instituciones_en_texto: Unidad de Glaciología · institucion_del_documento: INAIGEM [2]\n- laguna: Cuchillacocha · metodo: Batimetría · instituciones_en_texto: Autoridad Administrativa del Agua, ANA · institucion_del_documento: ANA [3]\n- laguna: Cuchillacocha · metodo: Limnígrafo / limnímetro · instituciones_en_texto: Autoridad Administrativa del Agua, ANA · institucion_del_documento: ANA [4]\n- laguna: Gangrajanca · metodo: Batimetría · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [5]\n- laguna: Gangrajanca · metodo: Dron (UAV) · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [6]\n- laguna: Gangrajanca · metodo: Fotogrametría · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [7]\n- laguna: Gangrajanca · metodo: Modelamiento de flujo (HEC-RAS / FLO-2D / RAMMS) · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [8]\n- laguna: Gangrajanca · metodo: Sistema de Monitoreo en Tiempo Real · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [9]\n- laguna: Llaca · metodo: Batimetría · instituciones_en_texto: Instituto de Ciencia y Tecnología de Austria, Autoridad Administrativa del Agua, Electroperú, INDECI, Unidad de Glaciología · institucion_del_documento:",
    "fuentes": [
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 58",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 23",
      "Evaluación de las disponibilidades hídricas en las lagunas de las cuencas: Santa, Nepeña, Casma, Culebras, Huarmey, Int… — ANA, 2023, p. 37",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nac… — ANA, 2024, p. 11",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2021 — INAIGEM, 2021, p. 24",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2021 — INAIGEM, 2021, p. 23",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2021 — INAIGEM, 2021, p. 23",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 110",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 112",
      "Informe Técnico N° 03 Glaciar Llaca — INAIGEM, 2016, p. 6"
    ],
    "n_fuentes": 24,
    "herramienta": "P6",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P7",
    "tipo": "competencia",
    "pregunta": "¿En qué subcuencas coinciden lagunas en riesgo y contaminación por drenaje ácido de roca?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.833,
      "answer_relevancy": 0.731,
      "context_precision": 0.941
    },
    "respuesta": "**Hechos del grafo** (18 filas):\n- subcuenca: Accrigua · lagunas_en_riesgo: Palcacocha · con_drenaje_acido: Palcacocha · documentos: 20.500.12748/140 · evidencias: Para ello, bajo la lógica de una cadena de procesos, se simula una avalancha que cae sobre la laguna de Palcacocha y que da origen a una ola cuyas característi… [1]\n- subcuenca: Casca · lagunas_en_riesgo: Llaca · con_drenaje_acido: Llaca, Subdirección · documentos: 20.500.12748/664, 20.500.12748/667 · evidencias: El único punto con pH dentro del ECA para agua, categoría 4-E2 fue LLAC-04, es el correspondiente a la descarga natural de la laguna Llaca, lo que indica que e… [2]\n- subcuenca: Cojup · lagunas_en_riesgo: Palcacocha, Tullparaju, Cuchillacocha · con_drenaje_acido: Palcacocha · documentos: 20.500.12748/663 · evidencias: Esta situación contrasta con otros sectores de la subcuenca del río Quillcay, donde operan piscigranjas que utilizan aguas del río Paria, provenientes de la mi… [3]\n- subcuenca: Cojup valley · lagunas_en_riesgo: Palcacocha · con_drenaje_acido: Palcacocha · documentos: 20.500.12748/140 · evidencias: Para ello, bajo la lógica de una cadena de procesos, se simula una avalancha que cae sobre la laguna de Palcacocha y que da origen a una ola cuyas característi… [4]\n- subcuenca: Llaca · lagunas_en_riesgo: Llaca · con_drenaje_acido: Llaca · documentos: 20.500.12748/664 · evidencias: El único punto con pH dentro del ECA para agua, categoría 4-E2 fue LLAC-04, es el correspondiente a la descarga natural de la laguna Llaca, lo que indica que e… [5]\n- subcuenca: Llaca Lake basin · lagunas_en_riesgo: Llaca · con_drenaje_acido: Llaca · documentos: 20.500.12748/664 · evidencias: El único punto con pH dentro del ECA para agua, categoría 4-E2 fue LLAC-04, es el correspondiente a la descarga natural de l",
    "fuentes": [
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017",
      "Inspección técnica de la unidad hidrográfica Casca – Llaca para identificar el impacto del drenaje ácido de roca a caus… — INAIGEM, 2025",
      "Riesgos e impactos del drenaje ácido de roca en los medios de vida de la población rural de la subcuenca del río Quillc… — INAIGEM, 2025",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017",
      "Inspección técnica de la unidad hidrográfica Casca – Llaca para identificar el impacto del drenaje ácido de roca a caus… — INAIGEM, 2025",
      "Inspección técnica de la unidad hidrográfica Casca – Llaca para identificar el impacto del drenaje ácido de roca a caus… — INAIGEM, 2025",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017"
    ],
    "n_fuentes": 22,
    "herramienta": "P7",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P8",
    "tipo": "competencia",
    "pregunta": "¿Qué bofedales están en subcuencas con glaciares en retroceso y qué servicios ecosistémicos brindan?",
    "estado": "observada",
    "estado_label": "Evidencia Parcial",
    "ragas": {
      "faithfulness": 0.58,
      "answer_relevancy": 0.62,
      "context_precision": 0.5
    },
    "respuesta": "**Hechos del grafo** (5 filas):\n- bofedal: Cara · subcuenca: Negrohuaycco · en_retroceso: Coropuna · servicios_del_bofedal: Regulación hídrica · servicios_de_los_bofedales: Regulación hídrica, Almacenamiento de carbono, Forraje y pastoreo, Hábitat y biodiversidad, Provisión de agua [1]\n- bofedal: Cara Cara · subcuenca: Negrohuaycco · en_retroceso: Coropuna · servicios_del_bofedal: Regulación hídrica · servicios_de_los_bofedales: Regulación hídrica, Almacenamiento de carbono, Forraje y pastoreo, Hábitat y biodiversidad, Provisión de agua [2]\n- bofedal: Muysiniga · subcuenca: Negrohuaycco · en_retroceso: Coropuna · servicios_del_bofedal: Regulación hídrica · servicios_de_los_bofedales: Regulación hídrica, Almacenamiento de carbono, Forraje y pastoreo, Hábitat y biodiversidad, Provisión de agua [3]\n- bofedal: Cátac · subcuenca: Pachacoto · en_retroceso: Pastoruri, Pachacoto · servicios_de_los_bofedales: Regulación hídrica, Almacenamiento de carbono, Forraje y pastoreo, Hábitat y biodiversidad, Provisión de agua [4]\n- bofedal: Cochapampa · subcuenca: Quillcayhuanca · en_retroceso: Quillcayhuanca · servicios_del_bofedal: Regulación hídrica · servicios_de_los_bofedales: Regulación hídrica, Almacenamiento de carbono, Forraje y pastoreo, Hábitat y biodiversidad, Provisión de agua [5]\n\n**Fragmentos relacionados:**\n- (queñua o quenual) que es una especie representativa de esta cordillera. • En la Cordillera Huallanca se presentan cuatro ecosistemas que brindan servicios ecosistémicos importantes dentro de sus áreas de influencia. Est… [6]\n- PALABRAS CLAVE IMPACTO DEL RETROCESO GLACIAR EN LOS RECURSOS HÍDRICOS El cambio climático viene generando retroceso glaciar y reducción en las reservas hídricas proveniente de los glaciares. Cinco cordilleras, de las die… [7]\n- (queñua o quenu",
    "fuentes": [
      "Informe Técnico A09 Coropuna 2018 — INAIGEM, 2018, p. 39",
      "Informe Técnico A09 Coropuna 2018 — INAIGEM, 2018, p. 39",
      "Informe Técnico A09 Coropuna 2018 — INAIGEM, 2018, p. 39",
      "Potencial Distichia Muscoides en la biorremediación de un bofedal impactado con drenaje acido de roca en Ancash — INAIGEM, 2023, p. 118",
      "Boletín INAIGEM 4 — INAIGEM, 2017, p. 37",
      "Informe de la situación de los glaciares y ecosistemas de montaña en el Perú — ANA, 2019, pp. 24–25",
      "Boletín INAIGEM 4 — INAIGEM, 2017, p. 42",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2017 — INAIGEM, 2019, pp. 24–25",
      "El inventario nacional de glaciares: las cordilleras glaciares del Perú — ANA, 2018, p. 144"
    ],
    "n_fuentes": 9,
    "herramienta": "P8",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P9",
    "tipo": "competencia",
    "pregunta": "¿Cómo cambió la superficie glaciar de una cordillera entre los inventarios de 2018 y 2023?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.957,
      "answer_relevancy": 0.68,
      "context_precision": 0.793
    },
    "respuesta": "**Hechos del grafo** (19 filas):\n- anio: 1955 · km2: 726.26 · confianza: 0.85 [1]\n- anio: 1970 · km2: 723.37 · confianza: 0.8 [2]\n- anio: 1975 · km2: 726.26 · confianza: 0.8 [3]\n- anio: 1989 · anio_imagenes: 1962 · km2: 723.37 · confianza: 1 [4]\n- anio: 1997 · km2: 611.48 · confianza: 0.8 [5]\n- anio: 2006 · km2: 25 · confianza: 0.75 [6]\n- anio: 2012 · km2: 527.62 · confianza: 0.75 [7]\n- anio: 2012 · km2: 195.75 · confianza: 0.75 [8]\n- anio: 2014 · km2: 527.62 · confianza: 0.8 [9]\n- anio: 2014 · km2: 57.63 · confianza: 0.8 [10]\n- anio: 2014 · km2: 527.62 · confianza: 0.8 [11]\n- anio: 2014 · km2: 723.37 · confianza: 0.8 [12]\n- anio: 2016 · km2: 448.81 · confianza: 0.99 [13]\n- anio: 2016 · km2: 425.84 · confianza: 0.8 [14]\n- anio: 2016 · km2: 22.97 · confianza: 0.8 [15]\n- anio: 2018 · anio_imagenes: 2016 · km2: 449.75 · confianza: 1 [16]\n- anio: 2019 · km2: 38.72 · confianza: 0.8 [17]\n- anio: 2019 · km2: 1523 · confianza: 0.8 [18]\n- anio: 2023 · anio_imagenes: 2020 · km2: 424.86 · confianza: 1 [19]\n\n**Fragmentos relacionados:**\n- Libre de detritos y escombros Cubierto Cordillera Vilcanota. 495.05 375.75 279.40 255.44 119.30 215.65 239.61 0 100 200 300 400 500 600 1962 1997 2009 2016 Año Superficie glaciar Reducción de la superficie glaciar (1962-… [20]\n- • El análisis de cambio de superficie en la Cordillera Chila muestra que el área glaciar ha disminuido de 33.89 km2 a 0.19 km2 con una pérdida de 33.70 km2 equivalente al 99.44%, en 61 años. Sin embargo, esta tendencia s… [21]\n- Dentro de este ámbito no se encontró superficies cubiertas por detritos o escombros. Tabla 28. Superficie Glaciar Libre de detritos o escombros Km2 0.39 % 100.00 Unidad En el análisis de cambio de superficie, se determin… [22]\n- Tabla 10 y Gráfico 8. lateral izquierda de la laguna Palcacocha. Libre",
    "fuentes": [
      "Informe de la situación de los glaciares y ecosistemas de montaña en el Perú — ANA, 2019, p. 47",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 74",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 74",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, p. 182",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 75",
      "Variaciones glaciares y disponibilidad de agua en la cordillera Blanca del Perú desde hace 40 año — SENAMHI, 2010, p. 3",
      "Inventario de glaciares: cordillera Blanca — ANA, 2012, p. 20",
      "Inventario de glaciares: cordillera Blanca — ANA, 2012, p. 33",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 75",
      "Inventario nacional de glaciares y lagunas — ANA, 2014, p. 10"
    ],
    "n_fuentes": 23,
    "herramienta": "P9",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P10",
    "tipo": "competencia",
    "pregunta": "¿Qué lagunas en riesgo cuentan con obras de seguridad, en qué estado están y qué poblados protegen?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.944,
      "answer_relevancy": 0.545,
      "context_precision": 0.792
    },
    "respuesta": "**Hechos del grafo** (66 filas):\n- laguna: Artizón · nivel: Alto · obra: Canal de desagüe · estado: Colapsada [1]\n- laguna: Artizón · nivel: Alto · obra: Dique · estado: Colapsada [2]\n- laguna: Artizón · nivel: Alto · obra: Obras de seguridad · estado: Deteriorada, Colapsada [3]\n- laguna: Artizón · nivel: Alto · obra: Presa · estado: Colapsada [4]\n- laguna: Chaclan · nivel: Muy alto · obra: Dique [5]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Dique · estado: Deteriorada · poblados_protegidos: Huaraz [6]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Obras de seguridad · estado: Deteriorada · poblados_protegidos: Huaraz [7]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Presa · poblados_protegidos: Huaraz [8]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Sistema de alerta temprana · estado: Operativa · poblados_protegidos: Huaraz [9]\n- laguna: Gangrajanca · nivel: Muy alto · obra: Dique · estado: Deteriorada, Colapsada · poblados_protegidos: Concepción, Jesús y Baños, Baños, Queropalca [10]\n- laguna: Gangrajanca · nivel: Muy alto · obra: Presa · poblados_protegidos: Concepción, Jesús y Baños, Baños, Queropalca [11]\n- laguna: Gangrajanca · nivel: Muy alto · obra: Sistema de alerta temprana · poblados_protegidos: Concepción, Jesús y Baños, Baños, Queropalca [12]\n- laguna: Lecma · nivel: Alto · obra: Dique [13]\n- laguna: Llaca · nivel: Muy alto · obra: Dique · estado: Requiere mantenimiento · poblados_protegidos: Huaraz [14]\n- laguna: Llaca · nivel: Muy alto · obra: Obras de seguridad · estado: Deteriorada · poblados_protegidos: Huaraz [15]\n- laguna: Llaca · nivel: Muy alto · obra: Presa · poblados_protegidos: Huaraz [16]\n- laguna: Llaca · nivel: Muy alto · obra: Sistema de alerta temprana · poblados_protegidos: Huaraz [17]\n- laguna: Llaca · nivel: Muy alto · obra: dique artificial de 9 mts de alto · poblados_protegidos: Huaraz [18]\n- laguna: Pacliashcocha · nivel: Alto · obra: Canal de desagüe · poblados_protegidos: Marcará, Carhuaz [19]\n- laguna: Pacliashcocha · nivel: Alto · obra: Dique · poblados_protegidos: Marcará, Carhuaz [20]\n\n**Fragmentos relacionados:**\n- Riesgos asociados a glaciares En 2018, se han efectuado estudios de evaluación de riesgo por aluvión de tres subcuencas de origen glaciar para tomar medidas de prevención en el marco del Sistema Nacional de la Gestión de… [21]\n- El Informe Anual 2018 de la situación de los glaciares y ecosistemas de montaña en el Perú aborda la evaluación de las obras de seguridad en 21 lagunas de alta peligrosidad, ubicadas principalmente en la Cordillera Blanc… [22]\n- 6.1 Las obras de seguridad de la laguna Pacliascocha, están comprendidas por un canal de mampostería de piedra, el cual se encuentra en condiciones regulares, siendo que posee el deterioro de su tarrajeo y requiere la li… [23]\n- Luego, en la década de 1970, se continuó con la ejecución de nuevas obras de seguridad y la refacción de algunas existentes. Un caso en particular es el de la laguna Parón. A partir de la década de 1960, la empresa estat… [24]",
    "fuentes": [
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 9",
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 67",
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 9",
      "Aplicación de modelos numéricos en peligros glaciares (caso laguna Palcacocha) — ANA, 2020, p. 3",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 79",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 28",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 28",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2018 — INAIGEM, 2019, p. 132",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nac… — ANA, 2024, p. 11",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 11",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 24",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 12",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 88",
      "Evaluación del peligro de aluvión por desborde de laguna glaciar en la subcuenca Casca — INAIGEM, 2026, p. 61",
      "Evaluación del peligro de aluvión por desborde de laguna glaciar en la subcuenca Casca — INAIGEM, 2026, p. 64",
      "Evaluación del peligro de aluvión por desborde de laguna glaciar en la subcuenca Casca — INAIGEM, 2026, p. 54",
      "Inspección técnica del aluvión en la subcuenca Casca debido al desborde de lagunas glaciares el 28 de abril de 2025 — INAIGEM, 2025, p. 44",
      "Memoria descriptiva de los estudios básicos de lagunas — ANA, 1972, p. 10",
      "Informe de evaluación del estado actual de las obras de seguridad y entorno de la laguna Pacliascocha — INAIGEM, 2018, p. 3",
      "Informe de evaluación del estado actual de las obras de seguridad y entorno de la laguna Pacliascocha — INAIGEM, 2018, p. 4",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2018 — INAIGEM, 2019, pp. 24–25",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2018 — INAIGEM, 2019",
      "Informe de evaluación del estado actual de las obras de seguridad y entorno de la laguna Pacliascocha — INAIGEM, 2018, p. 12",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 28"
    ],
    "n_fuentes": 24,
    "herramienta": "P10",
    "modelo": null
  },
  {
    "id": "D1",
    "tipo": "descriptiva",
    "pregunta": "¿Por qué la laguna Palcacocha es peligrosa?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.94,
      "context_precision": 1.0
    },
    "respuesta": "- Posee un volumen de agua de aproximadamente **16 Mm³** y la morfología de su microcuenca la conecta directamente con la ciudad de Huaraz, lo que incrementa el potencial de inundación. [4]  \n- Se sitúa a **4 562 m s.n.m.** y está catalogada como “peligrosa” por la amenaza inminente que representa para la población cercana. [1][2]  \n- Ya en **1940** el glaciólogo Hans Kinzl la señaló como una laguna peligrosa; al año siguiente, el **13 de diciembre de 1941** se produjo la ruptura violenta del dique frontal, generando una ola que provocó el aluvión de 1941. [3]  \n\nEstas características (gran volumen, ubicación alta, vulnerabilidad geomorfológica y antecedentes históricos de desborde) explican por qué la laguna Palcacocha es considerada peligrosa.",
    "fuentes": [
      "El inventario nacional de glaciares: las cordilleras glaciares del Perú — ANA, 2018, pp. 83–85",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, pp. 83–85",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nacional) — ANA, 2024, p. 5",
      "Informe de la situación de los glaciares y ecosistemas de montaña en el Perú — ANA, 2019, p. 78"
    ],
    "n_fuentes": 4,
    "herramienta": "buscar_entidad > texto",
    "modelo": "groq · openai/gpt-oss-120b"
  },
  {
    "id": "D2",
    "tipo": "multilingüe",
    "pregunta": "¿Qué factores explican el balance de masa y energía de los glaciares peruanos?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.895,
      "context_precision": 0.773
    },
    "respuesta": "\n**Fragmentos relacionados:**\n- Los glaciares tropicales, altamente sensibles a las variaciones climáticas, son indicadores clave del calentamiento global. La Cordillera Blanca, con la mayor concentración de glaciares tropicales del mundo, enfrenta un … [1]\n- Los glaciares en los Andes peruanos juegan un papel importante para la hidrología local. Para explicar el retroceso acelerado de los glaciares peruanos, es importante primero conocer las principales variables atmosférica… [2]\n- Palabras clave: Paleoglaciares, morrenas, PEH, ELA M ODELAMIENTO 1 * , Jorge Arigony 2 3 4 , Wolfgang 5 6 7 1 2 3 - - - 4 - 5 6 7Área de Evolución de Glaciares y Lagunas, Autoridad Nacional del Agua, Lima, Perú Los glaci… [3]\n- Investigaciones recientes llevadas a cabo en diferentes glaciares tropicales del mundo, han evidenciado un significativo incremento en las concentraciones de carbono negro (CN), llegando a alcanzar hasta un 270 % en comp… [4]",
    "fuentes": [
      "El Libro de Resúmenes del Simposio 2024 \"Las Montañas, Nuestro Futuro\" — INAIGEM, 2024, pp. 47–48",
      "Revista de glaciares y ecosistemas de montaña 7 — INAIGEM, 2024, p. 63",
      "Libro de resumenes MONFU 2019 — INAIGEM, 2019, p. 49",
      "Libro de resumenes Simposio MONFU 2023 — INAIGEM, 2023, p. 13"
    ],
    "n_fuentes": 4,
    "herramienta": "texto",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "D3",
    "tipo": "histórica",
    "pregunta": "¿Qué ocurrió en el aluvión de Huaraz de 1941?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.846,
      "answer_relevancy": 0.906,
      "context_precision": 1.0
    },
    "respuesta": "El aluvión que devastó Huaraz en 1941 fue provocado por una gran masa de hielo y rocas que se desprendió del nevado Palcaraju y cayó violentamente en la laguna Palcacocha, a más de 4 500 m.s.n.m. El impacto generó una ola de gran altura que rompió la morrena frontal de la laguna y transformó el agua, sedimentos y hielo en un aluvión de alta energía que descendió por la quebrada Cojup a 30‑40 km/h, arrasando todo a su paso hasta la ciudad de Huaraz [1].  \n\nEl desastre destruyó gran parte de la ciudad y se estima que murieron alrededor de 5 000 personas [2].  \n\nLa fecha más citada es el 13 de diciembre 1941, aunque algunos registros lo ubican el 20 de abril 1941; la mayoría de las fuentes contemporáneas coinciden en la fecha de diciembre [1][4].",
    "fuentes": [
      "Evaluación del peligro de aluvión por desborde de laguna glaciar en la subcuenca Casca — INAIGEM, 2026, pp. 9–10",
      "El inventario nacional de glaciares: las cordilleras glaciares del Perú — ANA, 2018, p. 81",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 81",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 26"
    ],
    "n_fuentes": 4,
    "herramienta": "buscar_documentos",
    "modelo": "groq · openai/gpt-oss-20b"
  },
  {
    "id": "D4",
    "tipo": "conteo",
    "pregunta": "¿Cuántas lagunas con riesgo muy alto de desborde hay en cada departamento?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.789,
      "context_precision": 0.875
    },
    "respuesta": "**Hechos del grafo** (2 filas):\n- departamento: Áncash · lagunas_en_riesgo: 5 · lagunas: Palcacocha, Parón, Tullparaju, Llaca, Cuchillacocha [1]\n- departamento: Huánuco · lagunas_en_riesgo: 3 · lagunas: Gangrajanca, Quesillococha, Chaclan [2]\n\n**Fragmentos relacionados:**\n- Pasco tiene 24 lagunas glaciares con riesgo de desborde, las cuales se concentran en tres sectores. Dos tercios se encuentran en la cordillera Huagoruncho, al norte de la provincia de Pasco; en este sector se ubica la la… [3]\n- El departamento de Junín registra 53 lagunas glaciares con riesgo de desborde, ubicadas en 4 cordilleras en el límite oeste y la zona central del departamento (ver Figura 53). Casi la mitad se concentra en la cordillera … [4]\n- El riesgo aceptable es el riesgo bajo y el riesgo no aceptable es el riesgo alto. A medida que los glaciares sufren modificaciones con el cambio global, también hay un cambio en las condiciones de desborde de las lagunas… [5]\n- Se han identificado 528 lagunas glaciares con riesgo de desborde a nivel nacional. El departamento de Áncash concentra la mayor cantidad con 169, seguido de Lima con 96 y Cusco con 76. 58 lagunas de origen glaciar tienen… [6]",
    "fuentes": [
      "Grafo de conocimiento · Conteo · ¿Cuántas lagunas en riesgo hay por departamento?",
      "Grafo de conocimiento · Conteo · ¿Cuántas lagunas en riesgo hay por departamento?",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, pp. 88–89",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, pp. 82–83",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017, p. 56",
      "RESUMEN PARA TOMADORES DE DECISIÓN: EVALUACIÓN NACIONAL DE LAGUNAS GLACIARES CON RIESGO DE DESBORDE — INAIGEM, 2024, pp. 11–12"
    ],
    "n_fuentes": 6,
    "herramienta": "E3_conteo_departamento",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "D5",
    "tipo": "fuera del corpus",
    "pregunta": "¿Quién ganó el Mundial de fútbol 2022?",
    "estado": "fuera_dominio",
    "estado_label": "Fuera de Dominio",
    "ragas": {
      "faithfulness": 0.0,
      "answer_relevancy": 0.232,
      "context_precision": 0.0
    },
    "respuesta": "No encontré esa información en el grafo ni en los documentos del corpus.",
    "fuentes": [
      "El inventario nacional de glaciares: las cordilleras glaciares del Perú — ANA, 2018, p. 74",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 74",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017, p. 8",
      "Quelccaya: Laboratorio natural para la ciencia y la humanidad — INAIGEM, 2025, p. 22"
    ],
    "n_fuentes": 0,
    "herramienta": "texto",
    "modelo": "groq · openai/gpt-oss-120b"
  },
  {
    "id": "G1",
    "tipo": "negación",
    "pregunta": "¿Qué lagunas en riesgo alto o muy alto no tienen obras de seguridad registradas?",
    "estado": "observada",
    "estado_label": "En Observación",
    "ragas": {
      "faithfulness": 0.64,
      "answer_relevancy": 0.55,
      "context_precision": 0.52
    },
    "respuesta": "**Hechos del grafo** (6 filas):\n- laguna: A-10 · nivel: Alto · departamentos: Cusco [1]\n- laguna: A-40 · nivel: Alto [2]\n- laguna: A10 · nivel: Alto [3]\n- laguna: A40 · nivel: Alto [4]\n- laguna: Ananta · nivel: Alto · departamentos: Puno [5]\n- laguna: Ananta Cucho · nivel: Alto · departamentos: Puno [6]\n\n**Fragmentos relacionados:**\n- Las ciudades de Huaraz y Huancayo se encuentran expuestas a un riesgo muy alto ante posibles aluviones por el desborde de lagunas glaciares. La metodología aplicada ha permitido realizar, por primera vez, una evaluación … [7]\n- Riesgos asociados a glaciares En 2018, se han efectuado estudios de evaluación de riesgo por aluvión de tres subcuencas de origen glaciar para tomar medidas de prevención en el marco del Sistema Nacional de la Gestión de… [8]\n- Se han identificado 32 lagunas glaciares con riesgo de desborde en el departamento de Huánuco, una de las cuales se encuentra compartida con Lima. Todas se concentran en el extremo suroeste del departamento, en la provin… [9]\n- El retroceso acelerado de glaciares debido al cambio climático ha originado la formación de lagunas nuevas con alto nivel de amenaza física. Las nuevas lagunas, de acuerdo con su evolución, características físicas y pres… [10]",
    "fuentes": [
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 33",
      "Reporte de prevención frente a peligro latente Lagunas en formación Cordillera Vilcanota — INAIGEM, 2020, p. 6",
      "Informe Técnico de Inspección A04 Laguna Upiscocha 2020 — INAIGEM, 2020, p. 5",
      "Informe Técnico de Inspección A04 Laguna Upiscocha 2020 — INAIGEM, 2020, p. 5",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 32",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 32",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 98",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2018 — INAIGEM, 2019, pp. 24–25",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, pp. 79–81",
      "Informe de la situación de los glaciares y ecosistemas de montaña en el Perú — ANA, 2019, p. 21"
    ],
    "n_fuentes": 10,
    "herramienta": "E1_negacion_sin_obras",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "G2",
    "tipo": "conteo varios saltos",
    "pregunta": "¿Qué cordillera tiene más lagunas en riesgo?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.929,
      "answer_relevancy": 0.68,
      "context_precision": 0.951
    },
    "respuesta": "**Hechos del grafo** (13 filas):\n- cordillera: Oriental · lagunas_en_riesgo: 13 · lagunas: Palcacocha, Upiscocha, Parón, Artizón, Tullparaju, Llaca, Rajucolta, Cuchillacocha, Pacliashcocha, A-10, Yanaraju, Ananta, Lecma [1]\n- cordillera: Huagoruncho · lagunas_en_riesgo: 11 · lagunas: Palcacocha, Upiscocha, Parón, Artizón, Tullparaju, Llaca, Rajucolta, Cuchillacocha, Pacliashcocha, Yanaraju, Lecma [2]\n- cordillera: Blanca · lagunas_en_riesgo: 10 · lagunas: Palcacocha, Upiscocha, Parón, Artizón, Tullparaju, Llaca, Rajucolta, Cuchillacocha, Pacliashcocha, Yanaraju [3]\n- cordillera: Occidental · lagunas_en_riesgo: 10 · lagunas: Palcacocha, Upiscocha, Parón, Artizón, Tullparaju, Llaca, Rajucolta, Cuchillacocha, Pacliashcocha, Yanaraju [4]\n- cordillera: Ampato · lagunas_en_riesgo: 10 · lagunas: Palcacocha, Upiscocha, Parón, Artizón, Tullparaju, Llaca, Rajucolta, Cuchillacocha, Pacliashcocha, Yanaraju [5]\n- cordillera: Huayhuash · lagunas_en_riesgo: 4 · lagunas: Parón, Tullparaju, Gangrajanca, Quesillococha [6]\n- cordillera: Vilcanota · lagunas_en_riesgo: 3 · lagunas: Upiscocha, A-10, Ananta [7]\n- cordillera: Shacsha · lagunas_en_riesgo: 2 · lagunas: Palcacocha, Artizón [8]\n- cordillera: White Cordillera · lagunas_en_riesgo: 1 · lagunas: Parón [9]\n- cordillera: Vilcabamba · lagunas_en_riesgo: 1 · lagunas: Salkantaycocha [10]\n- cordillera: Cojup Valley · lagunas_en_riesgo: 1 · lagunas: Palcacocha [11]\n- cordillera: Callejón de Huaylas · lagunas_en_riesgo: 1 · lagunas: Palcacocha [12]\n- cordillera: Oriental de los Andes · lagunas_en_riesgo: 1 · lagunas: Salkantaycocha [13]\n\n**Fragmentos relacionados:**\n- El departamento de Arequipa cuenta con 6 lagunas glaciares con riesgo de desborde que se encuentran altamente concentradas en dos sectores: 3 se ubican en la provincia de Castil",
    "fuentes": [
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?",
      "Grafo de conocimiento · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?"
    ],
    "n_fuentes": 17,
    "herramienta": "E4_conteo_cordillera",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "G3",
    "tipo": "camino",
    "pregunta": "¿Cómo se relaciona el nevado Huascarán con Yungay?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.788,
      "context_precision": 0.807
    },
    "respuesta": "**Hechos del grafo** (2 filas):\n- Paso 1: Huascarán —ubicadaEn→ Ranrahirca [1]\n- Paso 2: Ranrahirca —ubicadaEn→ Yungay [2]\n\n**Fragmentos relacionados:**\n- Ante el fenómeno natural (avalancha de hielo y nieve) ocurrido el día martes 20 de junio de 2023 en el pico norte del sistema de montañas Huascarán (comúnmente denominado Nevado Huascarán), se ha visto por conveniente an… [3]\n- La altitud registrada en la cumbre sur del Nevado Huascarán fue de 6756.697 m., las coordenadas y elevaciones se muestran en la tabla siguiente: PUNTO COORD. NORTE (UTM) COORS. ESTE (UTM) ELEVACIÓN (M) BASE YUNGAY 898858… [4]\n- Nev. Huascarán Ubicación dentro un Área Natural Protegida (ANP) La Nevado Huascarán, se encuentran dentro del Área Natural Protegida (ANP) denominado “Parque Nacional Huascarán”. Rutas de Acceso: Para llegar a la Nevado … [5]\n- DEPARTAMENTO PROVJNCJA DISTRUO LUGAR EJECUTOR : ANCASH : YUNGAY : YUNGAY : LLANGANUCO HUARAZ, OCTU·BRE DEL 2001 ¡21 --- • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •… [6]",
    "fuentes": [
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2020 — INAIGEM, 2020, p. 31",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2020 — INAIGEM, 2020, p. 31",
      "Avalancha de hielo y nieve desde el pico norte del nevado Huascarán, ocurrido el 20 de junio de 2023 (Meta: seguimiento al comportamiento de glaciares y lagunas a nivel nacional) — ANA, 2023, pp. 12–13",
      "Boletín INAIGEM 3 — INAIGEM, 2017, p. 96",
      "Avalancha de hielo y nieve desde el pico norte del nevado Huascarán, ocurrido el 20 de junio de 2023 (Meta: seguimiento al comportamiento de glaciares y lagunas a nivel nacional) — ANA, 2023, pp. 3–5",
      "Evaluación de riesgo físico de los glaciares 5CIH y 5CII en el nevado Huascarán Norte — ANA, 2001, pp. 1–2"
    ],
    "n_fuentes": 6,
    "herramienta": "camino",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P11",
    "tipo": "competencia",
    "pregunta": "¿Qué lagunas glaciares en riesgo existen en el departamento de Huánuco y qué poblados amenazan?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.874,
      "context_precision": 1.0
    },
    "respuesta": "**Hechos del grafo** (3 filas):\n- laguna: Chaclan · nivel: Muy alto · n_docs: 1 [1]\n- laguna: Gangrajanca · nivel: Muy alto · n_docs: 1 [2]\n- laguna: Quesillococha · nivel: Muy alto · n_docs: 1 [3]\n\n**Fragmentos relacionados:**\n- Se han identificado 32 lagunas glaciares con riesgo de desborde en el departamento de Huánuco, una de las cuales se encuentra compartida con Lima. Todas se concentran en el extremo suroeste del departamento, en la provin… [4]\n- A nivel departamental se identificó que, de 14 departamentos con presencia de lagunas glaciares, 8 tienen lagunas con riesgo de desborde. Áncash cuenta con la mayor cantidad de estas lagunas, sumando 169, que equivalen a… [5]\n- 53 Lagunas de origen glaciar con riesgo de desborde Lagunas de origen glaciar con riesgo de desborde 31 24 Lagunas de origen glaciar con riesgo de desborde 6 Lagunas de origen glaciar con riesgo de desborde DEPARTAMENTO … [6]\n- 111 8. Los niveles del riesgo por aluvión determinados tanto para viviendas como para estructuras, corresponden a que, el 84.10% (1502) viviendas poseen riesgo muy alto, 14.11% (252) viviendas poseen riesgo alto, 1.29% (… [7]",
    "fuentes": [
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 79",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 79",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 79",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, pp. 79–81",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 66",
      "RESUMEN PARA TOMADORES DE DECISIÓN: EVALUACIÓN NACIONAL DE LAGUNAS GLACIARES CON RIESGO DE DESBORDE — INAIGEM, 2024, pp. 8–11",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departamento de Huánuco (Cordillera Huayhuash) — INAIGEM, 2024, p. 112"
    ],
    "n_fuentes": 7,
    "herramienta": "P2",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P12",
    "tipo": "competencia",
    "pregunta": "¿Qué lagunas glaciares de Cusco o la Cordillera Vilcanota presentan riesgo alto de desborde?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.955,
      "answer_relevancy": 0.68,
      "context_precision": 0.867
    },
    "respuesta": "**Hechos del grafo** (60 filas):\n- Quelccaya —ubicadaEn→ Vilcanota (Glaciar) · en 7 documento(s) [1]\n- Upiscocha —ubicadaEn→ Cusco (Laguna) · en 7 documento(s) [2]\n- Canchis —ubicadaEn→ Cusco (Provincia) · en 7 documento(s) [3]\n- Convención —ubicadaEn→ Cusco (Provincia) · en 7 documento(s) [4]\n- Urubamba —ubicadaEn→ Cusco (Provincia) · en 6 documento(s) [5]\n- Vilcanota —presentaFenomeno→ Retroceso glaciar (Fenomeno) · en 5 documento(s) [6]\n- Quisoquipina —ubicadaEn→ Vilcanota (Glaciar) · en 5 documento(s) [7]\n- Vilcanota —presentaFenomeno→ Cambio climático (Fenomeno) · en 5 documento(s) [8]\n- Santa Teresa —ubicadaEn→ Cusco (Distrito) · en 5 documento(s) [9]\n- Suyuparina —ubicadaEn→ Vilcanota (Glaciar) · en 4 documento(s) [10]\n- Cusco —presentaFenomeno→ Cambio climático (Fenomeno) · en 4 documento(s) [11]\n- Pitumarca —ubicadaEn→ Cusco (Distrito) · en 4 documento(s) [12]\n- Ananta —ubicadaEn→ Vilcanota (Glaciar) · en 4 documento(s) [13]\n- Urubamba —ubicadaEn→ Cusco (Cuenca) · en 4 documento(s) [14]\n- Vilcanota —ubicadaEn→ Vilcanota (Glaciar) · en 4 documento(s) [15]\n- Ausangate —ubicadaEn→ Vilcanota (Nevado) · en 4 documento(s) [16]\n- Cusco —ubicadaEn→ Cusco (Provincia) · en 4 documento(s) [17]\n- Upiscocha —ubicadaEn→ Vilcanota (Laguna) · en 4 documento(s) [18]\n- Salkantay —ubicadaEn→ Cusco (Nevado) · en 3 documento(s) [19]\n- Vilcanota —tieneSuperficieGlaciar→ tieneSuperficieGlaciar 255.44 km2 (2016) (Medicion) · en 3 documento(s) [20]\n\n**Fragmentos relacionados:**\n- El cambio climático está afectando las cordilleras glaciares del Perú, provocando no solo un acelerado retroceso glaciar, sino también la formación y crecimiento de lagunas glaciares, lo que incrementa la posibilidad de … [21]\n- Cusco tiene 76 lagunas glaciares con riesgo de desborde. Estas se ubican en distin",
    "fuentes": [
      "Formación de lagunas por pérdida glaciar en los Andes peruanos — INAIGEM, 2025, p. 40",
      "Reporte de inspección 01. Desborde de la laguna Upiscocha 14 de mayo 2022 — INAIGEM, 2022, p. 6",
      "Componente hidrológica : Determinación de la disponibilidad hídrica presente y futura - subcuenca del río Santa Teresa — SENAMHI, 2011, p. 78",
      "Informe de Inspección 06 Laguna de Salkantaycocha Septiembre 2021 — INAIGEM, 2021, p. 4",
      "Informe Técnico de Inspección A02 Glaciar Allinhuaman 2020 — INAIGEM, 2020, p. 6",
      "Libro de resumenes Simposio MONFU 2025 — INAIGEM, 2025, p. 63",
      "Libro de resumenes Simposio MONFU 2025 — INAIGEM, 2025, p. 33",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2016 — INAIGEM, 2017, p. 47",
      "Informe de Inspección 01 Laguna Salkantaycocha Febrero 2020 — INAIGEM, 2020, p. 3",
      "Iniciación de un monitoreo del balance de masa en el glaciar Suyuparina, Cordillera Vilcanota, Perú — ANA, 2015, p. 12"
    ],
    "n_fuentes": 24,
    "herramienta": "ficha",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P13",
    "tipo": "competencia",
    "pregunta": "¿Qué estudios de batimetría o volumen almacenado se han realizado en la laguna Palcacocha?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.952,
      "answer_relevancy": 0.781,
      "context_precision": 0.833
    },
    "respuesta": "**Hechos del grafo** (60 filas):\n- Palcacocha —ubicadaEn→ Blanca (Cordillera) · en 31 documento(s) [1]\n- Aluvión Palcacocha 1941 —ocurrioEn→ Palcacocha (Evento) · en 21 documento(s) [2]\n- Palcacocha —tieneObraSeguridad→ Dique (ObraSeguridad) · en 19 documento(s) [3]\n- INAIGEM —intervieneEn→ Palcacocha (Institucion) · en 17 documento(s) [4]\n- Palcacocha —ubicadaEn→ Áncash (Departamento) · en 15 documento(s) [5]\n- Palcacocha —tieneObraSeguridad→ Obras de seguridad (ObraSeguridad) · en 13 documento(s) [6]\n- Palcacocha —amenazaA→ Huaraz (CentroPoblado) · en 13 documento(s) [7]\n- Palcacocha —ubicadaEn→ Quillcay (Cuenca) · en 13 documento(s) [8]\n- Palcacocha —ubicadaEn→ Cojup (Cuenca) · en 12 documento(s) [9]\n- Palcacocha —monitoreadoCon→ Estación meteorológica (MetodoMonitoreo) · en 11 documento(s) [10]\n- Palcacocha —monitoreadoCon→ Batimetría (MetodoMonitoreo) · en 8 documento(s) [11]\n- Palcacocha —ubicadaEn→ Huaraz (Provincia) · en 8 documento(s) [12]\n- Palcacocha —presentaFenomeno→ Retroceso glaciar (Fenomeno) · en 7 documento(s) [13]\n- Palcacocha —alimentadaPor→ Palcaraju (Glaciar) · en 6 documento(s) [14]\n- Palcacocha —tieneObraSeguridad→ Sistema de alerta temprana (ObraSeguridad) · en 6 documento(s) [15]\n- Palcacocha —tieneObraSeguridad→ Sifón (ObraSeguridad) · en 5 documento(s) [16]\n- ANA —intervieneEn→ Palcacocha (Institucion) · en 5 documento(s) [17]\n- Palcacocha —tieneObraSeguridad→ Presa (ObraSeguridad) · en 5 documento(s) [18]\n- Palcacocha —ubicadaEn→ Santa (Cuenca) · en 4 documento(s) [19]\n- Gobierno Regional de Áncash —intervieneEn→ Palcacocha (Institucion) · en 4 documento(s) [20]\n\n**Fragmentos relacionados:**\n- Batimetría de la laguna Palcacocha Área del Espejo de Agua | 514 157,38 | m2. Altitud del Espejo de Agua | 4 562,88 | msnm Volumen Almacenado | 17 403",
    "fuentes": [
      "Evolución de la laguna glaciar Palcacocha — ANA, 2015, p. 2",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2016 — INAIGEM, 2017, p. 97",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 3 — INAIGEM, 2017, p. 9",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017, p. 24",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 68",
      "Informe técnico de la situación actual de la Laguna Glaciar Palcacocha - Enero — INAIGEM, 2016, p. 2",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nac… — ANA, 2024, p. 5",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2016 — INAIGEM, 2017, p. 88",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nac… — ANA, 2024, p. 4",
      "Boletín Hidrometeorológico 2020-2021 — INAIGEM, 2022, p. 5"
    ],
    "n_fuentes": 24,
    "herramienta": "ficha",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P14",
    "tipo": "competencia",
    "pregunta": "¿Cuál es la superficie y el volumen registrado de la laguna Parón y qué sistema de descarga posee?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.955,
      "answer_relevancy": 0.68,
      "context_precision": 0.812
    },
    "respuesta": "**Hechos del grafo** (60 filas):\n- Parón —tieneObraSeguridad→ Dique (ObraSeguridad) · en 8 documento(s) [1]\n- Parón —ubicadaEn→ Blanca (Cordillera) · en 8 documento(s) [2]\n- Parón —ubicadaEn→ Áncash (Departamento) · en 7 documento(s) [3]\n- Parón —tieneObraSeguridad→ Túnel de desagüe (ObraSeguridad) · en 5 documento(s) [4]\n- Parón —tieneAltitud→ tieneAltitud 4 185 m s.n.m. (Medicion) · en 4 documento(s) [5]\n- Parón —ubicadaEn→ Huaylas (Provincia) · en 4 documento(s) [6]\n- ANA —intervieneEn→ Parón (Institucion) · en 4 documento(s) [7]\n- Unidad de Glaciología —intervieneEn→ Parón (Institucion) · en 4 documento(s) [8]\n- Parón —amenazaA→ Caraz (CentroPoblado) · en 3 documento(s) [9]\n- Parón —ubicadaEn→ Parón (Cuenca) · en 3 documento(s) [10]\n- Parón —relacionadoCon→ Túnel de desagüe (ObraSeguridad) · en 3 documento(s) [11]\n- Parón —relacionadoCon→ Dique (ObraSeguridad) · en 3 documento(s) [12]\n- Parón —ubicadaEn→ Llullán (Quebrada) · en 3 documento(s) [13]\n- Parón —tieneAltitud→ tieneAltitud 4 190 m s.n.m. (Medicion) · en 3 documento(s) [14]\n- Parón —tieneAltitud→ tieneAltitud 4 200 m s.n.m. (Medicion) · en 2 documento(s) [15]\n- Parón —ubicadaEn→ Caraz (Distrito) · en 2 documento(s) [16]\n- Parón —tieneObraSeguridad→ Obras de seguridad (ObraSeguridad) · en 2 documento(s) [17]\n- Parón —presentaFenomeno→ Cambio climático (Fenomeno) · en 2 documento(s) [18]\n- Parón —relacionadoCon→ IRD (Institucion) · en 2 documento(s) [19]\n- Parón —ubicadaEn→ Santa (Cuenca) · en 2 documento(s) [20]\n\n**Fragmentos relacionados:**\n- Fechas en las que se ha realizado la medición de la cota Cota de mínima seguridad Cota de máxima seguridad En cuanto al decremento o reducción del nivel del espejo de agua, se ha registrado una reducción máxima de -2,93 … [21]\n- En la Fig. 05, se muestra la vista gener",
    "fuentes": [
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 28",
      "Libro de resumenes MONFU 2019 — INAIGEM, 2019, p. 58",
      "Evaluación anual de la laguna Parón, año 2023 (Meta: seguimiento al comportamiento de glaciares y lagunas a nivel nacio… — ANA, 2023, p. 3",
      "Inventario de lagunas: Cuencas Santa, Nepeña, Casma, Culebras, Huarmey, Fortaleza, Pativilca, Marañón — ANA, 1988, p. 70",
      "Lagunas reservas de agua dulce en Áncash: Resultados de estudios de batimetría en 38 lagunas glaciares — ANA, 2020, p. 44",
      "Lagunas reservas de agua dulce en Áncash: Resultados de estudios de batimetría en 38 lagunas glaciares — ANA, 2020, p. 44",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 78",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 78",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2018 — INAIGEM, 2019, p. 49",
      "Inventario de lagunas: Cuencas Santa, Nepeña, Casma, Culebras, Huarmey, Fortaleza, Pativilca, Marañón — ANA, 1988, p. 70"
    ],
    "n_fuentes": 24,
    "herramienta": "ficha",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "P15",
    "tipo": "competencia",
    "pregunta": "¿Qué ocurrió en la laguna 513 en el año 2010 y qué obras de seguridad protegieron a Carhuaz?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.944,
      "answer_relevancy": 0.689,
      "context_precision": 0.804
    },
    "respuesta": "**Hechos del grafo** (66 filas):\n- laguna: Artizón · nivel: Alto · obra: Canal de desagüe · estado: Colapsada [1]\n- laguna: Artizón · nivel: Alto · obra: Dique · estado: Colapsada [2]\n- laguna: Artizón · nivel: Alto · obra: Obras de seguridad · estado: Deteriorada, Colapsada [3]\n- laguna: Artizón · nivel: Alto · obra: Presa · estado: Colapsada [4]\n- laguna: Chaclan · nivel: Muy alto · obra: Dique [5]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Dique · estado: Deteriorada · poblados_protegidos: Huaraz [6]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Obras de seguridad · estado: Deteriorada · poblados_protegidos: Huaraz [7]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Presa · poblados_protegidos: Huaraz [8]\n- laguna: Cuchillacocha · nivel: Muy alto · obra: Sistema de alerta temprana · estado: Operativa · poblados_protegidos: Huaraz [9]\n- laguna: Gangrajanca · nivel: Muy alto · obra: Dique · estado: Deteriorada, Colapsada · poblados_protegidos: Concepción, Jesús y Baños, Baños, Queropalca [10]\n- laguna: Gangrajanca · nivel: Muy alto · obra: Presa · poblados_protegidos: Concepción, Jesús y Baños, Baños, Queropalca [11]\n- laguna: Gangrajanca · nivel: Muy alto · obra: Sistema de alerta temprana · poblados_protegidos: Concepción, Jesús y Baños, Baños, Queropalca [12]\n- laguna: Lecma · nivel: Alto · obra: Dique [13]\n- laguna: Llaca · nivel: Muy alto · obra: Dique · estado: Requiere mantenimiento · poblados_protegidos: Huaraz [14]\n- laguna: Llaca · nivel: Muy alto · obra: Obras de seguridad · estado: Deteriorada · poblados_protegidos: Huaraz [15]\n- laguna: Llaca · nivel: Muy alto · obra: Presa · poblados_protegidos: Huaraz [16]\n- laguna: Llaca · nivel: Muy alto · obra: Sistema de alerta temprana · poblados_protegidos: Huaraz [17]\n- laguna: Llaca · nivel: Muy alto",
    "fuentes": [
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 9",
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 67",
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 9",
      "Aplicación de modelos numéricos en peligros glaciares (caso laguna Palcacocha) — ANA, 2020, p. 3",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 79",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 28",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 28",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2018 — INAIGEM, 2019, p. 132",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nac… — ANA, 2024, p. 11",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 11"
    ],
    "n_fuentes": 24,
    "herramienta": "P10",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "D6",
    "tipo": "descriptiva",
    "pregunta": "¿Qué es un GLOF (desborde violento de laguna glaciar) y qué factores lo desencadenan en los Andes?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.95,
      "answer_relevancy": 0.68,
      "context_precision": 0.862
    },
    "respuesta": "**Hechos del grafo** (18 filas):\n- Glof —ubicadaEn→ Blanca (Cordillera) · en 2 documento(s) [1]\n- Aluvión Glof 1941 —ocurrioEn→ Glof (Evento) · en 2 documento(s) [2]\n- Glof —ubicadaEn→ Cancahuapampa (Quebrada) · en 1 documento(s) [3]\n- Glof —ubicadaEn→ Real (Cordillera) · en 1 documento(s) [4]\n- Glof —monitoreadoCon→ InSAR / DInSAR (MetodoMonitoreo) · en 1 documento(s) [5]\n- Glof —ubicadaEn→ Arkhata (Cuenca) · en 1 documento(s) [6]\n- Glof —monitoreadoCon→ Modelamiento de flujo (HEC-RAS / FLO-2D / RAMMS) (MetodoMonitoreo) · en 1 documento(s) [7]\n- Glof —monitoreadoCon→ Teledetección (MetodoMonitoreo) · en 1 documento(s) [8]\n- Glof —relacionadoCon→ Kedarnath (CentroPoblado) · en 1 documento(s) [9]\n- Glof —relacionadoCon→ Caraz (CentroPoblado) · en 1 documento(s) [10]\n- Aluvión Glof 2025 —ocurrioEn→ Glof (Evento) · en 1 documento(s) [11]\n- Aluvión Glof 2013 —ocurrioEn→ Glof (Evento) · en 1 documento(s) [12]\n- Aluvión Glof 2020 —ocurrioEn→ Glof (Evento) · en 1 documento(s) [13]\n- Universidad Mayor de San Andre ́s —relacionadoCon→ Glof (Institucion) · en 1 documento(s) [14]\n- Real —relacionadoCon→ Glof (Cordillera) · en 1 documento(s) [15]\n- Arkhata —relacionadoCon→ Glof (Rio) · en 1 documento(s) [16]\n- Arkhata —relacionadoCon→ Glof (Cuenca) · en 1 documento(s) [17]\n- Palcacocha —relacionadoCon→ Glof (Laguna) · en 1 documento(s) [18]\n\n**Fragmentos relacionados:**\n- Este fenómeno es un peligro significativo, ya que puede afectar zonas pobladas, infraestructuras, medios de vida, ecosistemas y otras construcciones que se encuentren aguas abajo. Diversas condiciones pueden favorecer la… [19]\n- Es un fenómeno conocido en inglés como Glacial Lake Outburst Flood (GLOF), el cual consiste en una secuencia de procesos que puede ser iniciado por diferentes desencadenantes e implica la ",
    "fuentes": [
      "Revista Científica de Glaciares y Ecosistemas de Montaña 8 — INAIGEM, 2024, p. 77",
      "Revista Científica de Glaciares y Ecosistemas de Montaña 5 — INAIGEM, 2018, p. 29",
      "Inspección Técnica de la laguna Cancahua debido al desborde del 3 de marzo de 2025. Distrito de Shilla, provincia de Ca… — INAIGEM, 2025, p. 6",
      "El Libro de Resúmenes del Simposio 2024 \"Las Montañas, Nuestro Futuro\" — INAIGEM, 2024, p. 6",
      "Monitoring the Stability of a Moraine Dam by Differential Interferometry (DInSAR) to Prevent GLOFs Disasters from Arhua… — INAIGEM, 2021, p. 1",
      "El Libro de Resúmenes del Simposio 2024 \"Las Montañas, Nuestro Futuro\" — INAIGEM, 2024, p. 6",
      "Libro de resumenes MONFU 2019 — INAIGEM, 2019, p. 58",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 30",
      "Evaluación nacional de lagunas glaciares con riesgo de desborde 2024. — INAIGEM, 2024, p. 21",
      "Modelling the impact of a GLOF scenario at Parón lake, Cordillera Blanca, Perú, using a novel multi-phase topographical… — INAIGEM, 2021"
    ],
    "n_fuentes": 22,
    "herramienta": "ficha",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "D7",
    "tipo": "histórica",
    "pregunta": "¿Qué sucedió en el aluvión de Chavín de Huántar de 1945 y qué laguna lo originó?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.955,
      "answer_relevancy": 0.68,
      "context_precision": 0.75
    },
    "respuesta": "**Hechos del grafo** (23 filas):\n- Huántar —relacionadoCon→ Huari (CentroPoblado) · en 2 documento(s) [1]\n- San —ubicadaEn→ Huántar (Nevado) · en 2 documento(s) [2]\n- Tumarina —ubicadaEn→ Huántar (Laguna) · en 2 documento(s) [3]\n- Chavín —ubicadaEn→ Huaraz (Distrito) · en 1 documento(s) [4]\n- Chavín —ubicadaEn→ Huancano (Distrito) · en 1 documento(s) [5]\n- Chavín —ubicadaEn→ Mosna (Rio) · en 1 documento(s) [6]\n- Chavín —ubicadaEn→ Quillcay (Cuenca) · en 1 documento(s) [7]\n- Chavín —ubicadaEn→ Santa (Cuenca) · en 1 documento(s) [8]\n- Chavín —ubicadaEn→ Shongo (Quebrada) · en 1 documento(s) [9]\n- Chavín —relacionadoCon→ Huaraz (CentroPoblado) · en 1 documento(s) [10]\n- Chavín —relacionadoCon→ Drenaje ácido de roca (Fenomeno) · en 1 documento(s) [11]\n- Chavín —relacionadoCon→ Paccharuri (Quebrada) · en 1 documento(s) [12]\n- Chavín —relacionadoCon→ Bayoraju (Nevado) · en 1 documento(s) [13]\n- Chavín —relacionadoCon→ Cátac (Distrito) · en 1 documento(s) [14]\n- Raimondi —relacionadoCon→ Chavín (Glaciar) · en 1 documento(s) [15]\n- Mullaca —amenazaA→ Chavín (Laguna) · en 1 documento(s) [16]\n- Aluvión 1941 —afectoA→ Chavín (Evento) · en 1 documento(s) [17]\n- Alhuaina —relacionadoCon→ Chavín (Laguna) · en 1 documento(s) [18]\n- Shongo —relacionadoCon→ Chavín (Quebrada) · en 1 documento(s) [19]\n- Hatijnruri —relacionadoCon→ Chavín (Quebrada) · en 1 documento(s) [20]\n\n**Fragmentos relacionados:**\n- 1.- Las lagunas que se encuentran en las cabeceras de la Quebrada HUACHECSAy sus tributarios : •.h¡¡ - ;,.; Barroso o YURACCOCHA ALHUINA RACRACANCHA ISHCACCOCHA YANACOCHA; Son lagunas totalmente maduras y consolidadas (a… [21]\n- Por lo expuesto y por otras observaciones realizados podemos concluir y decir sin ningún género de dudas de que se trata de una laguna totalmente inofensiva, sin ",
    "fuentes": [
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 81",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 81",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 81",
      "Riesgos e impactos del drenaje ácido de roca en los medios de vida de la población rural de la subcuenca del río Quillc… — INAIGEM, 2025, p. 97",
      "Climas del Perú: mapa de clasificación climática nacional — SENAMHI, 2021, p. 35",
      "Informe evaluación de las lagunas y glaciares ubicados en las estrivaciones de la Cordillera Blanca (nacientes de los t… — ANA, 2000, p. 5",
      "Riesgos e impactos del drenaje ácido de roca en los medios de vida de la población rural de la subcuenca del río Quillc… — INAIGEM, 2025, p. 76",
      "Evaluación técnica de la unidad de glaciología y recursos hídricos de Huaraz en proceso de transferencia de ELECTROPERÚ… — ANA, 1998, p. 5",
      "Informe evaluación de las lagunas y glaciares ubicados en las estrivaciones de la Cordillera Blanca (nacientes de los t… — ANA, 2000, p. 8",
      "Riesgos e impactos del drenaje ácido de roca en los medios de vida de la población rural de la subcuenca del río Quillc… — INAIGEM, 2025, p. 100"
    ],
    "n_fuentes": 24,
    "herramienta": "ficha",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "D8",
    "tipo": "institucional",
    "pregunta": "¿Qué rol cumplen el INAIGEM, la ANA y el SENAMHI en el monitoreo de glaciares del Perú?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.9,
      "answer_relevancy": 0.714,
      "context_precision": 0.9
    },
    "respuesta": "**Hechos del grafo** (37 filas):\n- laguna: Artizón · metodo: Batimetría · instituciones_en_texto: Unidad de Glaciología · institucion_del_documento: INAIGEM [1]\n- laguna: Artizón · metodo: Fotogrametría · instituciones_en_texto: Unidad de Glaciología · institucion_del_documento: INAIGEM [2]\n- laguna: Cuchillacocha · metodo: Batimetría · instituciones_en_texto: Autoridad Administrativa del Agua, ANA · institucion_del_documento: ANA [3]\n- laguna: Cuchillacocha · metodo: Limnígrafo / limnímetro · instituciones_en_texto: Autoridad Administrativa del Agua, ANA · institucion_del_documento: ANA [4]\n- laguna: Gangrajanca · metodo: Batimetría · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [5]\n- laguna: Gangrajanca · metodo: Dron (UAV) · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [6]\n- laguna: Gangrajanca · metodo: Fotogrametría · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [7]\n- laguna: Gangrajanca · metodo: Modelamiento de flujo (HEC-RAS / FLO-2D / RAMMS) · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [8]\n- laguna: Gangrajanca · metodo: Sistema de Monitoreo en Tiempo Real · instituciones_en_texto: Municipalidad Distrital de Queropalca, INDECI, ANA, Unidad de Glaciología · institucion_del_documento: INAIGEM [9]\n- laguna: Llaca · metodo: Batimetría · instituciones_en_texto: Instituto de Ciencia y Tecnología de Austria, Autoridad Administrativa del Agua, Electroperú, INDECI, Unidad de Glaciología · institucion_del_documento:",
    "fuentes": [
      "Informe Técnico N° 02 Subcuenca Santa Cruz — INAIGEM, 2018, p. 58",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2022 — INAIGEM, 2025, p. 23",
      "Evaluación de las disponibilidades hídricas en las lagunas de las cuencas: Santa, Nepeña, Casma, Culebras, Huarmey, Int… — ANA, 2023, p. 37",
      "Evaluación anual de la laguna Palcacocha del año 2024 (seguimiento al comportamiento de glaciares y lagunas a nivel nac… — ANA, 2024, p. 11",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2021 — INAIGEM, 2021, p. 24",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2021 — INAIGEM, 2021, p. 23",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2021 — INAIGEM, 2021, p. 23",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 110",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 112",
      "Informe Técnico N° 03 Glaciar Llaca — INAIGEM, 2016, p. 6"
    ],
    "n_fuentes": 24,
    "herramienta": "P6",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "D9",
    "tipo": "descriptiva",
    "pregunta": "¿Qué riesgos presenta la laguna Gangrajanca en la Cordillera Huayhuash?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.952,
      "answer_relevancy": 0.734,
      "context_precision": 0.82
    },
    "respuesta": "**Hechos del grafo** (60 filas):\n- Gangrajanca —ubicadaEn→ Huánuco (Departamento) · en 5 documento(s) [1]\n- Gangrajanca —tieneObraSeguridad→ Dique (ObraSeguridad) · en 4 documento(s) [2]\n- Huayhuash —tieneSuperficieGlaciar→ tieneSuperficieGlaciar 53.06 km2 (2016) (Medicion) · en 4 documento(s) [3]\n- Inventario Huayhuash 1955 —inventarioDe→ Huayhuash (Inventario) · en 4 documento(s) [4]\n- Kinzl —ubicadaEn→ Huayhuash (Glaciar) · en 4 documento(s) [5]\n- Inventario Huayhuash 2016 —inventarioDe→ Huayhuash (Inventario) · en 4 documento(s) [6]\n- Inventario Huayhuash 2014 —inventarioDe→ Huayhuash (Inventario) · en 3 documento(s) [7]\n- Gangrajanca —monitoreadoCon→ Batimetría (MetodoMonitoreo) · en 3 documento(s) [8]\n- Gangrajanca —ubicadaEn→ Queropalca (Distrito) · en 3 documento(s) [9]\n- Jahuacocha —ubicadaEn→ Huayhuash (Laguna) · en 3 documento(s) [10]\n- Solterococha —ubicadaEn→ Huayhuash (Laguna) · en 3 documento(s) [11]\n- Carhuacocha —ubicadaEn→ Huayhuash (Laguna) · en 3 documento(s) [12]\n- Gangrajanca —amenazaA→ Queropalca (CentroPoblado) · en 2 documento(s) [13]\n- Huayhuash —tieneSuperficieGlaciar→ tieneSuperficieGlaciar 55.27 km2 (2014) (Medicion) · en 2 documento(s) [14]\n- Huayhuash —tieneSuperficieGlaciar→ tieneSuperficieGlaciar 2.05 km2 (2016) (Medicion) · en 2 documento(s) [15]\n- Huayhuash —tieneEcosistema→ Pajonal altoandino (Ecosistema) · en 2 documento(s) [16]\n- Huayhuash —tieneEcosistema→ Bofedal (Ecosistema) · en 2 documento(s) [17]\n- Huayhuash —relacionadoCon→ Pativilca (Rio) · en 2 documento(s) [18]\n- Huayhuash —relacionadoCon→ Occidental (Cordillera) · en 2 documento(s) [19]\n- Huayhuash —tieneSuperficieGlaciar→ tieneSuperficieGlaciar 86.89 km2 (2016) (Medicion) · en 2 documento(s) [20]\n\n**Fragmentos relacionados:**\n- aluación Nacional de Lagunas Glaciares con ",
    "fuentes": [
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 112",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 11",
      "Informe de la situación de los glaciares y ecosistemas de montaña en el Perú — ANA, 2019, p. 47",
      "Informe de la situación de los glaciares y ecosistemas de montaña en el Perú — ANA, 2019, p. 47",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 110",
      "Informe de la situación de los glaciares y ecosistemas de montaña en el Perú — ANA, 2019, p. 47",
      "Inventario nacional de glaciares y lagunas — ANA, 2014, p. 9",
      "Informe de la Situación de los Glaciares y Ecosistemas de Montaña en el Perú 2021 — INAIGEM, 2021, p. 24",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departament… — INAIGEM, 2024, p. 13",
      "Inventario Nacional de Glaciares Las Cordilleras Glaciares del Perú 2018 — INAIGEM, 2018, p. 110"
    ],
    "n_fuentes": 24,
    "herramienta": "ficha",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "G4",
    "tipo": "camino",
    "pregunta": "¿Cómo se conecta la laguna Llaca con el glaciar Ranrapalca y la ciudad de Huaraz?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.809,
      "context_precision": 0.858
    },
    "respuesta": "**Hechos del grafo** (2 filas):\n- Paso 1: Llaca —presentaFenomeno→ Retroceso glaciar [1]\n- Paso 2: Retroceso glaciar —presentaFenomeno→ Ranrapalca [2]\n\n**Fragmentos relacionados:**\n- El 26 de marzo de 2025 en la microcuenca Llaca ocurrió un GLOF como resultado del desborde súbito en cadena de dos lagunas ubicadas al suroeste del nevado Vallunaraju. Estas lagunas no tienen nombre oficial, por lo que e… [3]\n- Patrimonial La quebrada Llaca congrega a una serie de montañas glaciares de atracción paisajística incomparables, tenemos a los glaciares Ucro, Vallunaraju, Llaca, Ocshapalca, Ranrapalca y Carhuac. Del retroceso del glac… [4]\n- La zona de estudio geográficamente está ubicada en la vertiente occidental de la Cordillera Blanca, cuenca del río Santa y subcuenca del río Cascas. Políticamente se ubica en el distrito de Independencia, provincia de Hu… [5]\n- Google Earth Distancia: 8.7 km Huari Perfil longitudinal: Trocha LLACA 4 472 m s. n. m. Está en proceso de formación a consecuencia del retroceso de los glaciares Ranrapalca (6 071 m s. n. m.) y Ocshapalca (6 109 m s. n.… [6]",
    "fuentes": [
      "Informe Técnico N° 03 Glaciar Llaca — INAIGEM, 2016, p. 13",
      "Lagunas reservas de agua dulce en Áncash: Resultados de estudios de batimetría en 38 lagunas glaciares — ANA, 2020, p. 8",
      "Evaluación del peligro de aluvión por desborde de laguna glaciar en la subcuenca Casca — INAIGEM, 2026, pp. 10–11",
      "Informe Técnico N° 03 Glaciar Llaca — INAIGEM, 2016, p. 13",
      "Informe Técnico N° 03 Glaciar Llaca — INAIGEM, 2016, pp. 7–8",
      "Lagunas reservas de agua dulce en Áncash: Resultados de estudios de batimetría en 38 lagunas glaciares — ANA, 2020, pp. 20–21"
    ],
    "n_fuentes": 6,
    "herramienta": "camino",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "G5",
    "tipo": "conteo",
    "pregunta": "¿Qué departamentos del Perú concentran la mayor cantidad de lagunas con peligro de aluvión?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 1.0,
      "answer_relevancy": 0.933,
      "context_precision": 0.834
    },
    "respuesta": "\n**Fragmentos relacionados:**\n- ORIGEN GLACIAR Laguna Upiscocha Foto: Ricardo Vila Asimismo, se han identificado 13 lagunas periglaciares que se encuentran compar tidas entre dos departamentos12, es decir el límite político atraviesa la laguna. Es tas … [1]\n- de los glaciares por departamentos En cuanto a la ubicación política de los glaciares en el Perú, estos se encuentran distribuidos en 13 departamentos (Cuadro 7). Los departamentos de Áncash y Cusco, debido a las cordill… [2]\n- El departamento de Áncash posee 937 lagunas de origen glaciar que cubren un área de 59.88 km2 (equivalente al 6 % del total nacional de la cobertura por lagunas) (tabla 11). Del total de lagunas del departamento de Áncas… [3]\n- 110 5. En la huella del aluvión generado a partir del desembalse de la laguna Gangrajanca, se han determinado 04 niveles de peligros: ● Nivel de peligro muy alto: Aluvión con altura de flujo mayor o igual a 1.2 m, con pr… [4]",
    "fuentes": [
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, pp. 76–79",
      "Retroceso glaciar en los Andes peruanos durante las últimas seis décadas — INAIGEM, 2025, pp. 95–96",
      "Inventario Nacional de Glaciares y Lagunas de Origen Glaciar 2023 — INAIGEM, 2023, pp. 89–91",
      "Evaluación del Riesgo por Aluvión en las Localidades de Queropalca, Baños y Jesús, Provincia de Lauricocha, Departamento de Huánuco (Cordillera Huayhuash) — INAIGEM, 2024, p. 111"
    ],
    "n_fuentes": 4,
    "herramienta": "texto",
    "modelo": "GraphRAG Verificado"
  },
  {
    "id": "G6",
    "tipo": "recomendación",
    "pregunta": "¿Qué recomendaciones técnicas proponen los informes ante el retroceso acelerado en la Cordillera Blanca?",
    "estado": "validada",
    "estado_label": "Validada con Fuentes",
    "ragas": {
      "faithfulness": 0.955,
      "answer_relevancy": 0.68,
      "context_precision": 0.75
    },
    "respuesta": "**Hechos del grafo** (60 filas):\n- Blanca —presentaFenomeno→ Retroceso glaciar (Fenomeno) · en 50 documento(s) [1]\n- Palcacocha —ubicadaEn→ Blanca (Laguna) · en 31 documento(s) [2]\n- Blanca —presentaFenomeno→ Cambio climático (Fenomeno) · en 29 documento(s) [3]\n- Shallap —ubicadaEn→ Blanca (Glaciar) · en 22 documento(s) [4]\n- Blanca —presentaFenomeno→ Drenaje ácido de roca (Fenomeno) · en 17 documento(s) [5]\n- Blanca —presentaFenomeno→ Aumento de temperatura (Fenomeno) · en 15 documento(s) [6]\n- Artesonraju —ubicadaEn→ Blanca (Glaciar) · en 15 documento(s) [7]\n- Huascarán —ubicadaEn→ Blanca (Nevado) · en 14 documento(s) [8]\n- Yanamarey —ubicadaEn→ Blanca (Glaciar) · en 13 documento(s) [9]\n- 513 —ubicadaEn→ Blanca (Laguna) · en 10 documento(s) [10]\n- Arhuaycocha —ubicadaEn→ Blanca (Laguna) · en 9 documento(s) [11]\n- Parón —ubicadaEn→ Blanca (Laguna) · en 8 documento(s) [12]\n- Blanca —ubicadaEn→ Áncash (Departamento) · en 7 documento(s) [13]\n- Blanca —presentaFenomeno→ Formación de nuevas lagunas (Fenomeno) · en 7 documento(s) [14]\n- Yanapaccha —ubicadaEn→ Blanca (Glaciar) · en 7 documento(s) [15]\n- Huillca —ubicadaEn→ Blanca (Glaciar) · en 7 documento(s) [16]\n- Llaca —ubicadaEn→ Blanca (Laguna) · en 6 documento(s) [17]\n- Tullparaju —ubicadaEn→ Blanca (Laguna) · en 6 documento(s) [18]\n- Rajucolta —ubicadaEn→ Blanca (Laguna) · en 6 documento(s) [19]\n- Kinzl —ubicadaEn→ Blanca (Glaciar) · en 6 documento(s) [20]\n\n**Fragmentos relacionados:**\n- En las últimas cuatro décadas el proceso acelerado de retroceso glaciar ha dado origen a la formación y el incremento del volumen de agua de lagunas en la Cordillera Blanca, en un análisis multi-‐temporal mediante técnic… [21]\n- El cambio climático está afectando las cordilleras glaciares del Perú, provocando no solo un acelerado retro",
    "fuentes": [
      "Informe de inspección a la laguna Conococha — ANA, 2000, p. 4",
      "Evolución de la laguna glaciar Palcacocha — ANA, 2015, p. 2",
      "Ubicación geográfica del ámbito de influencia de la Cordillera Blanca — INAIGEM, 2018, p. 11",
      "Situación de los Glaciares y Ecosistemas de Montaña en el Perú : Informe Anual 2016 — INAIGEM, 2017, p. 97",
      "Evaluación de la capacidad fitorremediadora de tres especies vegetales altoandinas asistidas con biochar en suelos cont… — INAIGEM, 2021, p. 20",
      "Memoria del Foro Internacional de Glaciares y Ecosistemas de Montaña 2016 — INAIGEM, 2017, p. 56",
      "Estudio y monitoreo de glaciares y lagunas altoandinas: actividades realizadas, por la Unidad de Glaciología y Recursos… — ANA, 2003, p. 3",
      "Evaluación del peligro de aluvión por desprendimiento de glaciar y roca del nevado Huascarán Sur. — INAIGEM, 2025, p. 30",
      "Estudio y monitoreo de glaciares y lagunas altoandinas: plan de trabajo institucional 2005 — ANA, 2005, p. 24",
      "Informe Técnico N° 04 Lagunas 513, Cochca y Rajupaquinan — INAIGEM, 2016, p. 6"
    ],
    "n_fuentes": 24,
    "herramienta": "ficha",
    "modelo": "GraphRAG Verificado"
  }
];
