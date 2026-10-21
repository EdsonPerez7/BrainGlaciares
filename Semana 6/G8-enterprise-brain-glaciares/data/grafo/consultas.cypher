// Consultas Cypher · Enterprise Brain Glaciares (G8)
// Parámetros de ejemplo en cada bloque (:param en Neo4j Browser)

// P1 · ¿Cuántas lagunas de origen glaciar se formaron en la Cordillera Blanca según el inventario de 2023?
:param cordillera => "blanca";
:param anio => 2023;
MATCH (i:Inventario)-[:INVENTARIO_DE]->(c:Cordillera {k: $cordillera})
WHERE i.anio = $anio
MATCH (i)-[:TIENE_MEDICION]->(m:Medicion)
WHERE m.propiedad IN ['registraLagunas', 'registraLagunasNuevas', 'registraLagunasProglaciares', 'registraGlaciares', 'registraSuperficieGlaciar']
RETURN i.nombre AS inventario, m.propiedad AS dato, m.texto AS valor,
       m.documento AS documento, m.pagina AS pagina, m.evidencia AS evidencia
ORDER BY dato;

// P2 · ¿Qué lagunas glaciares de Áncash tienen riesgo muy alto de desborde?
:param departamento => "Áncash";
:param nivel => "Muy alto";
MATCH (l:Laguna)-[r:TIENE_NIVEL_RIESGO]->(n:NivelRiesgo)
WHERE n.nombre = $nivel AND $departamento IN l.departamentos
RETURN l.nombre AS laguna, n.nombre AS nivel, r.n_docs AS n_docs,
       r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia
ORDER BY n_docs DESC, laguna;

// P3 · ¿Qué centros poblados están aguas abajo de lagunas con riesgo alto y qué estudios los evaluaron?
:param niveles => ["Muy alto", "Alto"];
MATCH (l:Laguna)-[r:AMENAZA_A]->(p:CentroPoblado)
WHERE l.nivel_max IN $niveles AND p.dudoso = false
OPTIONAL MATCH (d:Documento)-[:MENCIONA]->(l), (d)-[:MENCIONA]->(p)
RETURN l.nombre AS laguna, l.nivel_max AS nivel, p.nombre AS poblado, 'el texto lo dice' AS via, '' AS subcuenca,
       collect(DISTINCT d.id) AS estudios, r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia
UNION
MATCH (l:Laguna)-[:UBICADA_EN]->(c)<-[r:UBICADA_EN]-(p:CentroPoblado)
WHERE l.nivel_max IN $niveles AND c.hidro = true AND c.grande = false AND p.dudoso = false
OPTIONAL MATCH (d:Documento)-[:MENCIONA]->(l), (d)-[:MENCIONA]->(p)
RETURN l.nombre AS laguna, l.nivel_max AS nivel, p.nombre AS poblado, 'misma subcuenca' AS via, c.nombre AS subcuenca,
       collect(DISTINCT d.id) AS estudios, r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia;

// P4 · ¿Qué lagunas tuvieron eventos de desborde, de qué glaciar provienen y qué poblados afectaron?
MATCH (e:Evento)-[r:OCURRIO_EN]->(l:Laguna)
OPTIONAL MATCH (l)-[:ALIMENTADA_POR]->(g)
OPTIONAL MATCH (e)-[:AFECTO_A]->(p)
OPTIONAL MATCH (e)-[:TIENE_MEDICION]->(v:Medicion)
WHERE v.propiedad = 'causoVictimas'
RETURN e.nombre AS evento, e.anio AS anio, l.nombre AS laguna,
       collect(DISTINCT g.nombre) AS glaciar_origen, collect(DISTINCT p.nombre) AS poblados_afectados,
       collect(DISTINCT v.texto) AS victimas, r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia
ORDER BY anio;

// P5 · ¿Qué glaciares con retroceso medido (balance de masa) alimentan lagunas que hoy están en riesgo?
:param niveles => ["Muy alto", "Alto"];
:param balance => ["Balance de masa", "Estacas de ablación"];
MATCH (l:Laguna)-[ra:ALIMENTADA_POR]->(g)
WHERE l.nivel_max IN $niveles AND g.tipo IN ['Glaciar', 'Nevado']
OPTIONAL MATCH (g)-[:MONITOREADO_CON]->(m:MetodoMonitoreo)
WHERE m.nombre IN $balance
OPTIONAL MATCH (g)-[:PRESENTA_FENOMENO]->(f:Fenomeno)
WHERE f.nombre = 'Retroceso glaciar'
OPTIONAL MATCH (d:Documento)-[:MENCIONA]->(g), (d)-[:USA_METODO]->(mb:MetodoMonitoreo)
WHERE mb.nombre IN $balance
WITH l, g, ra, count(DISTINCT m) AS n_medido, count(DISTINCT f) AS n_reportado, count(DISTINCT d) AS n_doc
WHERE n_medido + n_reportado + n_doc > 0
RETURN g.nombre AS glaciar,
       CASE WHEN n_medido > 0 THEN 'medido (balance de masa)'
            WHEN n_reportado > 0 THEN 'retroceso reportado'
            ELSE 'en documento con balance de masa' END AS retroceso,
       l.nombre AS laguna, l.nivel_max AS nivel, ra.documento AS documento, ra.pagina AS pagina, ra.evidencia AS evidencia
ORDER BY retroceso DESC, glaciar;

// P6 · ¿Qué métodos de monitoreo se aplicaron a lagunas en riesgo y qué institución realizó cada estudio?
:param niveles => ["Muy alto", "Alto"];
MATCH (l:Laguna)-[r:MONITOREADO_CON]->(m:MetodoMonitoreo)
WHERE l.nivel_max IN $niveles
OPTIONAL MATCH (i:Institucion)-[:INTERVIENE_EN]->(l)
OPTIONAL MATCH (doc:Documento)-[:PUBLICADO_POR]->(pub:Institucion)
WHERE doc.id = r.documento
RETURN l.nombre AS laguna, m.nombre AS metodo, collect(DISTINCT i.nombre) AS instituciones_en_texto,
       collect(DISTINCT pub.nombre) AS institucion_del_documento,
       r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia
ORDER BY laguna, metodo;

// P7 · ¿En qué subcuencas coinciden lagunas en riesgo y contaminación por drenaje ácido de roca?
:param niveles => ["Muy alto", "Alto"];
:param fenomeno => "Drenaje ácido de roca";
MATCH (l:Laguna)-[:UBICADA_EN]->(c)
WHERE l.nivel_max IN $niveles AND c.hidro = true AND c.grande = false
MATCH (f:Fenomeno)
WHERE f.nombre = $fenomeno
OPTIONAL MATCH (c)-[r1:PRESENTA_FENOMENO]->(f)
OPTIONAL MATCH (x)-[:UBICADA_EN]->(c), (x)-[r2:PRESENTA_FENOMENO]->(f)
WITH c, l, r1, x, r2
WHERE r1 IS NOT NULL OR r2 IS NOT NULL
RETURN c.nombre AS subcuenca, collect(DISTINCT l.nombre) AS lagunas_en_riesgo,
       collect(DISTINCT x.nombre) AS con_drenaje_acido,
       collect(DISTINCT coalesce(r1.documento, r2.documento)) AS documentos,
       collect(DISTINCT coalesce(r1.evidencia, r2.evidencia)) AS evidencias
ORDER BY subcuenca;

// P8 · ¿Qué bofedales están en subcuencas con glaciares en retroceso y qué servicios ecosistémicos brindan?
MATCH (g)-[:PRESENTA_FENOMENO]->(f:Fenomeno)
WHERE f.nombre = 'Retroceso glaciar' AND g.tipo IN ['Glaciar', 'Nevado', 'Cuenca', 'Quebrada']
MATCH (b:Bofedal)-[rb:UBICADA_EN]->(c)
WHERE c.hidro = true AND c.grande = false AND b.dudoso = false AND (c.id = g.id OR EXISTS { MATCH (g)-[:UBICADA_EN]->(c) })
OPTIONAL MATCH (b)-[:PROVEE_SERVICIO]->(s:ServicioEcosistemico)
OPTIONAL MATCH (e:Ecosistema)-[:PROVEE_SERVICIO]->(s2:ServicioEcosistemico)
WHERE e.k = 'bofedal'
RETURN b.nombre AS bofedal, c.nombre AS subcuenca, collect(DISTINCT g.nombre) AS en_retroceso,
       collect(DISTINCT s.nombre) AS servicios_del_bofedal, collect(DISTINCT s2.nombre) AS servicios_de_los_bofedales,
       rb.documento AS documento, rb.pagina AS pagina, rb.evidencia AS evidencia
ORDER BY subcuenca, bofedal;

// P9 · ¿Cómo cambió la superficie glaciar de una cordillera entre los inventarios de 2018 y 2023?
:param cordillera => "blanca";
MATCH (i:Inventario)-[:INVENTARIO_DE]->(c:Cordillera {k: $cordillera})
MATCH (i)-[:TIENE_MEDICION]->(m:Medicion)
WHERE m.propiedad = 'registraSuperficieGlaciar' AND m.valor IS NOT NULL
RETURN i.anio AS anio, i.anio_imagenes AS anio_imagenes, m.valor AS km2, m.confianza AS confianza,
       m.documento AS documento, m.pagina AS pagina, m.evidencia AS evidencia
ORDER BY anio;

// P10 · ¿Qué lagunas en riesgo cuentan con obras de seguridad, en qué estado están y qué poblados protegen?
:param niveles => ["Muy alto", "Alto"];
MATCH (l:Laguna)-[r:TIENE_OBRA]->(o:ObraSeguridad)
WHERE l.nivel_max IN $niveles
OPTIONAL MATCH (l)-[re:ESTADO_OBRA]->(e:EstadoObra)
WHERE re.obra = o.nombre
OPTIONAL MATCH (l)-[:AMENAZA_A]->(p:CentroPoblado)
WHERE p.dudoso = false
RETURN l.nombre AS laguna, l.nivel_max AS nivel, o.nombre AS obra, collect(DISTINCT e.nombre) AS estado,
       collect(DISTINCT p.nombre) AS poblados_protegidos, r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia
ORDER BY laguna, obra;

// E1_negacion_sin_obras · Negación · ¿Qué lagunas en riesgo (alto o muy alto) NO tienen obras de seguridad registradas?
:param niveles => ["Muy alto", "Alto"];
MATCH (l:Laguna)-[r:TIENE_NIVEL_RIESGO]->(n:NivelRiesgo)
WHERE n.nombre IN $niveles AND NOT EXISTS { MATCH (l)-[:TIENE_OBRA]->(:ObraSeguridad) }
RETURN l.nombre AS laguna, n.nombre AS nivel, l.departamentos AS departamentos, r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia
ORDER BY nivel DESC, laguna;

// E2_negacion_sin_monitoreo · Negación · ¿Qué lagunas en riesgo no tienen ningún método de monitoreo registrado?
:param niveles => ["Muy alto", "Alto"];
MATCH (l:Laguna)
WHERE l.nivel_max IN $niveles AND NOT EXISTS { MATCH (l)-[:MONITOREADO_CON]->(:MetodoMonitoreo) }
RETURN l.nombre AS laguna, l.nivel_max AS nivel, l.departamentos AS departamentos
ORDER BY laguna;

// E3_conteo_departamento · Conteo · ¿Cuántas lagunas en riesgo hay por departamento?
:param niveles => ["Muy alto", "Alto"];
MATCH (l:Laguna)
WHERE l.nivel_max IN $niveles
UNWIND l.departamentos AS departamento
RETURN departamento, count(DISTINCT l) AS lagunas_en_riesgo, collect(DISTINCT l.nombre) AS lagunas
ORDER BY lagunas_en_riesgo DESC;

// E4_conteo_cordillera · Conteo con varios saltos · ¿Qué cordillera tiene más lagunas en riesgo?
:param niveles => ["Muy alto", "Alto"];
MATCH (l:Laguna)-[:UBICADA_EN*1..3]->(c:Cordillera)
WHERE l.nivel_max IN $niveles
RETURN c.nombre AS cordillera, count(DISTINCT l) AS lagunas_en_riesgo, collect(DISTINCT l.nombre) AS lagunas
ORDER BY lagunas_en_riesgo DESC;

// E5_ranking_volumen · Ranking · Las 5 lagunas de Áncash con mayor volumen
:param departamento => "Áncash";
MATCH (l:Laguna)-[:TIENE_MEDICION]->(m:Medicion)
WHERE m.propiedad = 'tieneVolumen' AND m.valor IS NOT NULL AND $departamento IN l.departamentos
RETURN l.nombre AS laguna, max(m.valor) AS volumen_m3, collect(DISTINCT m.documento) AS documentos
ORDER BY volumen_m3 DESC LIMIT 5;

// E6_linea_tiempo · Línea de tiempo · Eventos registrados antes de 1980
:param hasta => 1980;
MATCH (e:Evento)
WHERE e.anio < $hasta
OPTIONAL MATCH (e)-[r:OCURRIO_EN]->(x)
OPTIONAL MATCH (e)-[:AFECTO_A]->(p)
RETURN e.anio AS anio, e.nombre AS evento, collect(DISTINCT x.nombre) AS lugar, collect(DISTINCT p.nombre) AS afecto_a,
       collect(DISTINCT r.documento) AS documentos
ORDER BY anio;

// E7_instituciones · Conteo · Instituciones que intervienen en más lagunas
MATCH (i:Institucion)-[:INTERVIENE_EN]->(l:Laguna)
RETURN i.nombre AS institucion, count(DISTINCT l) AS lagunas, collect(DISTINCT l.nombre) AS ejemplos
ORDER BY lagunas DESC LIMIT 10;

// E8_ficha · Ficha · Todo lo que se sabe de la laguna Palcacocha (con fuente)
:param k => "palcacocha";
MATCH (a:Entidad {k: $k})-[r]-(b)
WHERE r.pred <> 'mencionaA'
RETURN a.tipo AS tipo, r.pred AS relacion, b.nombre AS con, b.tipo AS tipo_con, r.n_docs AS n_docs,
       r.documento AS documento, r.pagina AS pagina, r.evidencia AS evidencia
ORDER BY n_docs DESC LIMIT 40;

// E9_comencion · Co-mención · Documentos que hablan a la vez de Palcacocha y Huaraz
:param a => "palcacocha";
:param b => "huaraz";
MATCH (d:Documento)-[:MENCIONA]->(a:Entidad {k: $a}), (d)-[:MENCIONA]->(b:Entidad {k: $b})
RETURN DISTINCT d.id AS documento, d.titulo AS titulo, d.fuente AS fuente, d.anio AS anio
ORDER BY anio DESC;

// E10_camino · Camino · ¿Cómo se conecta el nevado Huascarán con Yungay? (sin pasar por documentos)
:param a => "huascaran";
:param b => "yungay";
MATCH (a:Entidad {k: $a}), (b:Entidad {k: $b})
MATCH p = shortestPath((a)-[*..5]-(b))
WHERE ALL(r IN relationships(p) WHERE NOT type(r) IN ['MENCIONA', 'USA_METODO', 'PUBLICADO_POR'])
RETURN [n IN nodes(p) | n.nombre] AS camino, [r IN relationships(p) | r.pred] AS relaciones,
       [r IN relationships(p) | r.documento] AS documentos
LIMIT 3;

