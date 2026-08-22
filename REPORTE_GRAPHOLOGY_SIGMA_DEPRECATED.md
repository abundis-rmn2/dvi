# 📊 Reporte Técnico: Funciones de JavaScript Relacionadas a Graphology y Sigma.js en la Capa Deprecada (`src/_deprecated/php/`)

Este reporte documenta exhaustivamente todas las funciones, algoritmos, manejadores de eventos y métodos de **Graphology** y **Sigma.js** extraídos de los componentes PHP deprecados (`src/_deprecated/php/` / `vista/`), detallando su responsabilidad, lógica interna, parámetros y su correspondencia en la nueva implementación de **Next.js 14** ([`src/components/AIGraphViewer.tsx`](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx) y [`src/components/SigmaGraphViewer.tsx`](file:///home/abundis/Documents/freight-graffiti/src/components/SigmaGraphViewer.tsx)).

---

## 📑 Tabla de Contenidos
1. [Resumen General de Bibliotecas](#1-resumen-general-de-bibliotecas)
2. [Catálogo de Funciones de Construcción y Manipulación de Grafos (`Graphology`)](#2-catálogo-de-funciones-de-construcción-y-manipulación-de-grafos-graphology)
3. [Catálogo de Funciones de Disposición (*Layout Algorithms*)](#3-catálogo-de-funciones-de-disposición-layout-algorithms)
4. [Catálogo de Métricas de Centralidad y Algoritmos de Grafos](#4-catálogo-de-métricas-de-centralidad-y-algoritmos-de-grafos)
5. [Catálogo de Detección de Comunidades (Louvain)](#5-catálogo-de-detección-de-comunidades-louvain)
6. [Catálogo de Funciones de Filtrado y Podado de Entidades (*Pruning*)](#6-catálogo-de-funciones-de-filtrado-y-podado-de-entidades-pruning)
7. [Catálogo de Renderizado, Eventos y Reductores (`Sigma.js`)](#7-catálogo-de-renderizado-eventos-y-reductores-sigmajs)
8. [Matriz de Migración: Deprecado vs Next.js React](#8-matriz-de-migración-deprecado-vs-nextjs-react)

---

## 1. Resumen General de Bibliotecas

En la versión PHP deprecada (`src/_deprecated/php/`), el motor de análisis de redes operaba con dos versiones principales de Sigma/Graphology:

| Biblioteca | Versión Original | Ubicación Deprecada | Propósito Principal |
| :--- | :--- | :--- | :--- |
| **Graphology** | `0.19.x` / `0.21.x` | `vista/includes/js-networks/graphology.js` | Estructura de datos orientada a grafos (nodos, aristas, grados, métricas). |
| **Graphology Library** | Standard Build | `vista/includes/js-networks/graphology-library.js` | Colección de algoritmos (Layouts, Centralidad, Louvain, Métricas). |
| **Sigma.js (v2 WebGL)** | `v2.0.0-alpha` | `vista/includes/js-networks/sigma.js` | Renderizador WebGL multinivel para grafos de IA (`hashtags_ai_data_live.php`). |
| **Sigma.js (v1 Canvas)** | `v1.2.1` | `vista/includes/js-networks/sigma.js` (legacy) | Renderizador Canvas para grafos de seguidores de usuario (`sigma.php`). |

En la versión migrada a Next.js 14, ambas bibliotecas se consolidaron usando los paquetes oficiales npm: `graphology`, `graphology-library`, `graphology-layout-forceatlas2`, y `sigma`.

---

## 2. Catálogo de Funciones de Construcción y Manipulación de Grafos (`Graphology`)

### `graphology.Graph()`
- **Archivo Origen**: `src/_deprecated/php/hashtags_ai_data_live.php` (línea ~470), `block_data_live.php` (línea ~520).
- **Parámetros**: `{ type: 'undirected' }` o `{ multi: true }`.
- **Descripción / Lógica**: Instancia el grafo en memoria donde se insertan todas las entidades extraídas de los JSON estáticos.
- **Métodos Utilizados**:
  - `graph.addNode(id, attributes)`: Agrega nodos asignando atributos clave (`label`, `x`, `y`, `size`, `color`, `nodetype`, `state`, `entity_match`, `metrics`).
  - `graph.addEdge(source, target)`: Crea aristas no dirigidas entre nodos conectados (ej. Usuario -> Publicación, Publicación -> Hashtag, Entidad IA -> Usuario).
  - `graph.hasNode(id)` / `graph.hasEdge(source, target)`: Verificación previa a la inserción para evitar duplicados.
  - `graph.degree(node)`: Retorna el grado del nodo (número de conexiones activas).
  - `graph.dropNode(node)`: Elimina un nodo y todas sus aristas incidentes.
  - `graph.order`: Propiedad que retorna el conteo total de nodos.
  - `graph.size`: Propiedad que retorna el conteo total de aristas.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L380-L460) utilizando `new Graph()` de `graphology`.

---

## 3. Catálogo de Funciones de Disposición (*Layout Algorithms*)

### 1. `graphologyLibrary.layout.circlepack`
- **Archivo Origen**: `hashtags_ai_data_live.php` (línea ~540).
- **Parámetros**: `(graph)`
- **Descripción**: Calcula una disposición inicial en círculos concéntricos (Circle Pack) basándose en las jerarquías de los nodos. Se usa como semilla inicial de coordenadas (`x`, `y`).
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L470) usando `circlepack(graph)`.

### 2. `graphologyLibrary.layout.random`
- **Archivo Origen**: `hashtags_ai_data_live.php` (línea ~545).
- **Parámetros**: `(graph)`
- **Descripción**: Asigna coordenadas `x`, `y` aleatorias entre 0 y 1 a todos los nodos del grafo como disposición semilla alternativa.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L475) usando `random(graph)`.

### 3. `graphologyLibrary.layoutForceAtlas2` (Live Physics Simulation)
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~890-940).
- **Funciones Internas**:
  - `layoutForceAtlas2.start(graph, settings)`: Inicia el worker físico de repulsión y atracción por gravedad en tiempo real.
  - `layoutForceAtlas2.stop(graph)`: Detiene la simulación física.
  - `layoutForceAtlas2.assign(graph, settings)`: Aplica $N$ iteraciones síncronas de ForceAtlas2 sobre el grafo.
- **Ajustes / Settings**:
  - `gravity`: Coeficiente de atracción hacia el centro (default: `1.0`).
  - `scalingRatio`: Factor de escala de separación espacial (default: `10.0`).
  - `barnesHutOptimize`: Optimización cuadrática de verisilitud.
  - `slowDown`: Factor de desaceleración gradual.
  - `iterations`: Número de iteraciones síncronas a calcular (default: `100`).
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L550-L600) integrando `graphology-layout-forceatlas2`.

---

## 4. Catálogo de Métricas de Centralidad y Algoritmos de Grafos

### 1. `handleComputeCentrality` (`computecentrality`)
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~1050-1120).
- **Descripción / Lógica**:
  Ejecuta secuencialmente cuatro algoritmos de centralidad de `graphologyLibrary.metrics.centrality`:
  1. `betweenness(graph)`: Mide la frecuencia con la que un nodo actúa como puente a lo largo de la ruta más corta entre otros dos nodos.
  2. `closeness(graph)`: Mide el promedio de las rutas más cortas de un nodo a todos los demás nodos de la red.
  3. `degree(graph)`: Normaliza el número directo de conexiones de cada nodo.
  4. `pagerank(graph)`: Algoritmo de rango de página para medir la importancia relativa de los nodos en la red.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L605-L640).

### 2. `applyCentralitySizing` (`betweennesssizecentrality`, `closenessizecentrality`, `degreesizecentrality`, `pageranksizecentrality`)
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~1125-1210).
- **Parámetros**: `metricName` (`betweennessCentrality`, `closenessCentrality`, `degreeCentrality`, `pagerank`).
- **Lógica Matemática**:
  Para la métrica seleccionada, obtiene el valor mínimo (`min`) y máximo (`max`) de todos los nodos del grafo y recalcula el tamaño visual (`node.size`) de cada nodo usando la fórmula de interpolación lineal:
  $$size = \text{newMin} + \frac{(val - min) \times (\text{newMax} - \text{newMin})}{max - min}$$
  Donde $\text{newMin} = 3$ px y $\text{newMax} = 25$ px.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L645-L680).

---

## 5. Catálogo de Detección de Comunidades (Louvain)

### 1. `handleComputeLouvain` (`computelouvain`)
- **Archivo Origen**: `hashtags_ai_data_live.php` (línea ~1220).
- **Lógica**: Invoca `graphologyLibrary.communitiesLouvain(graph)`, el cual particiona la red en comunidades óptimas maximizando la modularidad del grafo. Asigna a cada nodo un identificador de comunidad en `node.attributes.louvain`.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L685-L700).

### 2. `handleColorLouvain` (`colorlouvain`)
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~1235-1280).
- **Lógica**: Genera una paleta de colores armónicos distribuidos uniformemente en el espacio cromático HSL (Hue, Saturation, Lightness):
  $$\text{Hue}_i = \frac{i \times 360}{\text{Total Comunidades}}$$
  Asigna el color cromático resultante a `node.color` para destacar visualmente los clústers de la red.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L705-L730).

---

## 6. Catálogo de Funciones de Filtrado y Podado de Entidades (*Pruning*)

### 1. `handleCleanNonInferenced` (`cleanNonInferenced`)
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~660-720), `block_data_live.php`.
- **Lógica de Recorrido Profundo**:
  1. Recorre los nodos del grafo buscando aquellos cuya categoría sea `entity_individual`.
  2. Para cada entidad, inspecciona sus vecinos (*1-hop*) buscando publicaciones de Instagram (`post`).
  3. Para cada publicación, inspecciona sus vecinos (*2-hop*) buscando hashtags o usuarios asociados (*3-hop*).
  4. Si la entidad individual no posee al menos un camino activo hacia publicaciones e inferencias de IA válidas, elimina el nodo mediante `graph.dropNode(node)`.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L500-L540).

### 2. `latinText(str)` & `onlyNumbers(str)`
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~525-538).
- **Parámetros**: `str` (cadena de texto del nodo).
- **Lógica**: Expresiones regulares que identifican caracteres no latinos o identificadores compuestos únicamente de números para filtrar ruido tipográfico en etiquetas de grafito.
- **Réplica en Next.js**: Integrado directamente en las funciones de sanitización de [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L430).

---

## 7. Catálogo de Renderizado, Eventos y Reductores (`Sigma.js`)

### 1. Instanciación e Invocación de Reductores (`Sigma`)
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~780-840).
- **Reductores de Estado Visual**:
  - `nodeReducer`: Cuando un nodo es seleccionado (`selectedNode`), desdibuja el resto del grafo asignando un color atenuado (`#e6e6e6`) y transparencia, resaltando únicamente a los vecinos de primer grado (`1-hop` - `selectedNeighbors`) o segundo grado (`2-hop` - `selectedNeighborsNeighbors`).
  - `edgeReducer`: Desdibuja todas las aristas que no conecten directamente con el nodo seleccionado.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L440-L490) asignando `renderer.setSetting('nodeReducer', ...)` y `renderer.setSetting('edgeReducer', ...)`.

### 2. Manejador de Clics (`clickNode`) y Captura de Pantalla (`screenshot`)
- **Archivo Origen**: `hashtags_ai_data_live.php` (líneas ~850-880, ~950-980).
- **Eventos**:
  - `renderer.on('clickNode', (event) => ...)`: Registra el nodo cliqueado en el historial (`nodeHistory`), actualiza el estado `selectedNode` y lanza una petición AJAX (`/api/json-data`) para obtener el perfil del usuario o la publicación de Instagram.
  - `handleScreenshot` (`html2canvas`): Captura la vista WebGL actual con fondo blanco (`#ffffff`) y descarga la imagen como JPEG.
- **Réplica en Next.js**: [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L545-L570, L735-L770).

---

## 8. Matriz de Migración: Deprecado vs Next.js React

| Función Deprecada (PHP / Vanilla JS) | Archivo PHP Origen | Componente React Migrado (Next.js) | Estado de Migración |
| :--- | :--- | :--- | :--- |
| `graphology.Graph()` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L380) | **100% Migrado** |
| `layoutForceAtlas2.start/stop` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L550) | **100% Migrado** |
| `circlepack` / `random` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L470) | **100% Migrado** |
| `betweenness` / `closeness` / `pagerank` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L605) | **100% Migrado** |
| `communitiesLouvain` / `colorlouvain` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L685) | **100% Migrado** |
| `cleanNonInferenced` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L500) | **100% Migrado** |
| `contarNodosConUsuariosVinculados` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L683) | **100% Migrado** |
| `nodeReducer` / `edgeReducer` | `hashtags_ai_data_live.php` | [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx#L440) | **100% Migrado** |
| `sigma.parsers.json` (v1 Canvas) | `sigma.php` | [SigmaGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/SigmaGraphViewer.tsx#L45) | **100% Migrado** |

---

## 9. Desglose del Orden del Formulario Original (`hashtags_ai_data_live.php`)

En la vista PHP original (`src/_deprecated/php/hashtags_ai_data_live.php`), los controles y herramientas estaban distribuidos en un orden secuencial directo sobre la misma página (sin ocultarse en pestañas):

```
+-----------------------------------------------------------------------------------+
| 1. SECCIÓN SUPERIOR: PARÁMETROS Y FILTROS DE ENTRADA                              |
|    - networkfilter[] (Checkboxes: Standard, Text_AI, Image_AI)                    |
|    - nodeMinDegree (Campo numérico: grado mínimo de nodos)                         |
|    - cleanEntities (Radio: true/false - limpiar caracteres no latinos/graffiti)   |
|    - gravity (Campo numérico: fuerza de atracción ForceAtlas2)                    |
|    - adjustSizes (Radio: true/false - considerar tamaño de nodo en repulsión)     |
|    - barnesHutOptimize / barnesHutTheta (Optimizador cuadrático)                  |
|    - outboundAttractionDistribution / linLogMode (Modelos de fuerza)              |
|    - scalingRatio / slowDown / strongGravityMode                                  |
|    - nodeFixedSize (Radio: true/false - tamaño fijo inicial vs métricas)          |
|    - initialLayout (Radio: circlepack / random)                                   |
|    - autoGravityScale (Radio: auto / manual)                                      |
|    - [ Botón: Build Graph ] (Envía el formulario y reconstruye el grafo)          |
+-----------------------------------------------------------------------------------+
| 2. SECCIÓN CENTRAL: VISIBILIDAD DE VECINDADES Y LIENZO WEBGL                      |
|    - nodeReducerDepth (Radio: selectedNeighbors [1-hop] / NeighborsNeighbors)     |
|    - statsVis / mediaVis (Formbuilder de depuración)                             |
|    - Contenedor WebGL: #mountNode (Ancho 100%, Alto 800px)                         |
+-----------------------------------------------------------------------------------+
| 3. SECCIÓN INFERIOR: BARRA DE BOTONES DE ACCIÓN INTERACTIVOS                       |
|    * Fila de Animación y Podado:                                                  |
|      [Start]  [Stop]  [Screenshot]  [initial size & colors]                       |
|      [drop not inferenced]  [deletePostHashtags]                                  |
|    * Fila de Centralidad:                                                         |
|      [Compute centrality stats]                                                   |
|      [betweenness centrality] [closeness centrality]                              |
|      [degree centrality] [pageranksizecentrality]                                 |
|    * Fila de Comunidades y Métricas:                                              |
|      [Compute louvain stats]  [Color louvain stats]                               |
|      [countnodeType]  [countnodeTypeState]  [contarNodosConUsuariosVinculados]     |
|    * Paneles de Resultados HTML:                                                  |
|      #resultados, #resultados2, #resultados3 (Tabla Top Usuarios Vinculados)     |
+-----------------------------------------------------------------------------------+
```

### Justificación del Rediseño Manteniendo la Visibilidad Permanente
En la aplicación React ([`AIGraphViewer.tsx`](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx)), se mantuvo la disponibilidad de **todos** estos campos y botones. Para evitar ocultar parámetros tras pestañas complejas, la interfaz muestra **permanentemente la barra de acciones e incluye el panel de parámetros colapsable directamente sobre el lienzo**, permitiendo al usuario acceder a cualquier ajuste sin perder de vista la simulación física WebGL.

---

## 10. Comportamiento Interactivo de Hover, Clic y Visualización de Publicaciones

En la interfaz original, el grafo contaba con un panel flotante de inspección ubicado **directamente arriba/sobre el lienzo del grafo** (`.hoverBox.hashtag` dentro del contenedor `#sigma-logs`), que reaccionaba dinámicamente a los eventos del ratón:

### 1. Comportamiento al Pasar el Cursor (*Hover / Mouse Enter*)
- **Eventos**: `renderer.on('enterNode')` y `renderer.on('leaveNode')`.
- **Información Desplegada**:
  - Muestra una pequeña etiqueta tipo *Tooltip* o tarjeta resumen con el identificador del nodo (`label`), el tipo de nodo (`nodetype`) y su grado de conectividad (número de vecinos directos).
  - Al salir del nodo (`leaveNode`), si no hay un nodo seleccionado explícitamente por clic, el tooltip de hover se oculta.

### 2. Comportamiento al Hacer Clic (*Node Click Event*)
- **Evento**: `renderer.on('clickNode', ({ node }) => ...)`
- **Flujo de Ejecución**:
  1. **Reducción Visual (Focus & Dimming)**:
     - Activa el reductor de nodos (`nodeReducer`).
     - El nodo seleccionado se resalta con color brillante.
     - Sus vecinos directos (1-hop - `selectedNeighbors`) permanecen visibles.
     - El resto de nodos del grafo se desdibujan/atenúan (`color: #f6f6f6`, `hidden: true`).
  2. **Historial de Clics**:
     - Agrega el nodo al listado de historial superior (`.nodeHistory`).
  3. **Petición AJAX a Backend (`json_data.php` / `/api/json-data`)**:
     - Envía los parámetros `{ node: nodeLabel, nodeType: nodetype, MUID: taskMUID }`.
  4. **Despliegue del Panel Flotante de Publicación e Inferencias (Caja Superior sobre el Grafo)**:
     - La caja flotante `.hoverBox.hashtag` (situada sobre la esquina superior del lienzo) se limpia y se hace visible (`jQuery(".hoverBox").show("slow")`).
     - **Si el nodo es un Hashtag (`hashtag` / `ai_text_hashtag`)**:
       - Muestra el nombre del Hashtag como enlace directo a Instagram (`https://www.instagram.com/explore/tags/{hashtag}`).
       - Muestra la cantidad total de publicaciones minadas (`no_publications`) y la fecha de minado (`mined_at`).
       - Despliega una galería desplazable con las publicaciones asociadas.
     - **Si el nodo es una Publicación (`post`) o Hashtag**:
       - Encabezado: **`"Image from ML inference (if available)"`**.
       - Carga la imagen procesada por los modelos de Machine Learning desde la URL remota:
         `http://data.abundis.com.mx/media//exported_images/{MUID}/{m_id}_exported.jpg`
         *(con fallback a `.webp`)*.
       - Despliega la lista detallada de metadatos de la publicación (`<ul>`):
         - `User`: Usuario autor de la publicación (`user_id`).
         - `Posted @`: Fecha y hora exacta de publicación (`taken_at`).
         - `Comments`: Conteo total de comentarios (`comment_count`).
         - `Likes`: Conteo total de "me gusta" (`like_count`).
         - `Hashtags`: Lista de hashtags utilizados en el post (`hashtags_used`).
         - `Caption`: Texto descriptivo del pie de foto con normalización de caracteres (`caption_text`).

---

### 3. Réplica en la Nueva Arquitectura Next.js 14
En el nuevo componente React ([`AIGraphViewer.tsx`](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx)), este flujo fue completamente replicado y mejorado:
- Al hacer clic en cualquier nodo del lienzo WebGL, se actualiza el estado React `selectedNodeData`.
- Se despliega una tarjeta de detalle interactiva **justo debajo o flotante sobre el mapa**, cargando la imagen remota de inferencia ML (`http://data.abundis.com.mx/media/...`), los contadores de likes/comentarios, el autor y la leyenda de la publicación.


