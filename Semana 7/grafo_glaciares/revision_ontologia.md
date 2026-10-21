# Revisión de la ontología (catálogo de pitfalls de OOPS!)

Fecha: 2026-10-08

## Antes (v1.0)

| codigo   | nivel      | problema                          |   cantidad | ejemplos                                                                | que_significa                                                                      |
|:---------|:-----------|:----------------------------------|-----------:|:------------------------------------------------------------------------|:-----------------------------------------------------------------------------------|
| P10      | Importante | Falta declarar clases excluyentes |          4 | Entity, MasaDeHielo, UnidadHidrografica, UnidadTerritorial              | Grupos de clases hermanas sin decir que no se superponen (una Laguna no es un Río) |
| P11      | Importante | Relaciones sin dominio o rango    |          6 | anio, confianza, evidencia, menciona, pagina, relacionadoCon            | No se dice entre qué tipos va la relación                                          |
| P41      | Importante | Faltan licencia y metadatos       |          4 | autores, fecha, licencia, versión                                       | No dice bajo qué licencia se puede reutilizar, quién la hizo ni qué versión es     |
| P08      | Menor      | Faltan etiquetas o descripciones  |          9 | anio, anioImagenes, confianza, evidencia, fuente, pagina                | Elementos sin nombre legible o sin explicación                                     |
| P13      | Menor      | Relaciones sin inversa            |         21 | abasteceA, afectoA, albergaEspecie, alimentadaPor, amenazaA, drenaHacia | Falta la relación en sentido contrario (amenazaA ↔ amenazadoPor)                   |

## Después (v1.1)

Sin problemas ✅

## Razonador HermiT

✅ CONSISTENTE

Mejoras: licencia CC BY 4.0, autores, versión y fecha; grupos de clases excluyentes (owl:AllDisjointClasses); dominio y rango completos; relaciones inversas (owl:inverseOf); `relacionadoCon` simétrica.
