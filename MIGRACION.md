# 🚀 Documento de Migración: PHP (`vista/`) → Next.js 14 (Solo Consulta)

## 📌 1. Visión General del Proyecto

Este documento registra la migración completa del sistema legacy en PHP (`./vista/`) hacia una arquitectura moderna, autónoma y portátil basada en **Next.js 14 (App Router) + React 18 + Better-SQLite3 + Graphology + Sigma.js**.

El sistema es una plataforma de análisis y visualización de grafos de redes sociales enfocada en el estudio de graffiti en trenes de carga (*freight graffiti*). Analiza publicaciones, hashtags, usuarios, inferencias de visión por computadora (Computer Vision ML) y clasificaciones de lenguaje natural (NLP).

---

## 🎯 2. Decisiones Arquitectónicas Clave

1. **Modo Exclusivo de Solo Consulta (Read-Only)**:
   - Ya no se subirán nuevos proyectos ni se ejecutarán bots de minería.
   - La aplicación sirve para consultar, explorar y analizar la información previamente recolectada.

2. **Eliminación de Dependencia de MySQL Remoto**:
   - La base de datos MySQL en `abundis.com.mx:3306` se encuentra bloqueada a nivel de firewall de red por el proveedor de hosting (puerto 3306 inalcanzable externamente).
   - Se migró el dump SQL completo (`abundisc_idmb_nvi.sql` de 139 MB) hacia un motor embebido **SQLite local** (`public/data/app_data.db`), servido en Next.js con `better-sqlite3` en modo de solo lectura (rendimiento ultra rápido, < 1ms por consulta y 0 latencia de red).

3. **Independencia de Servidor de Grafos**:
   - Los grafos de redes no se generan on-demand desde el servidor PHP, sino que se consumen directamente desde los archivos JSON cacheados en `public/json/` (estándar) y `public/json/ai/` (AI enriquecidos).

---

## 🗄️ 3. Importación y Carga de Datos en SQLite

Mediante el script `scripts/parse_sql_fast.py`, se procesaron e importaron de forma combinada los dumps `abundisc_idmb_nvi.sql` y `media_users.sql` hacia SQLite:

| Tabla SQLite | Registros Importados | Descripción |
|---|---|---|
| `tasks` | **80** | Tareas de minería registradas |
| `data_media` | **23,417** | Publicaciones de Instagram (captions, likes, comentarios, inferencias ML) |
| `data_recent_hashtags` | **3,573** | Hashtags minados con conteo total de publicaciones en IG |
| `data_users` | **22,257** | Perfiles de usuarios con seguidores, seguidos y estado privado |

**Total de registros importados en SQLite (`public/data/app_data.db`): 49,327 registros.**

### Archivos JSON de Grafos Disponibles

- **Grafos Estándar (`public/json/`)**: 19 archivos JSON de redes de usuarios y hashtags.
- **Grafos AI Enriquecidos (`public/json/ai/`)**: 45 archivos JSON multi-capa con inferencias de imágenes y NLP.

---

## 📋 4. Inventario Completo de Componentes PHP → Next.js

### A. Componentes Migrados e Integrados en Next.js

| Componente PHP Legacy | Destino en Next.js | Descripción / Estado |
|---|---|---|
| `index.php` | `src/app/page.tsx` | Dashboard principal de tareas con tabla sorteable, resaltado de tareas vacías y badges coloreados. |
| `edit.php` | `src/app/tasks/[id]/page.tsx` | Detalle de tarea: métricas de posts/hashtags/usuarios, lista de JSONs cacheados y tablas sorteables de publicaciones y hashtags. |
| `hashtags_ai_data_live.php` | `src/app/graph/[id]/page.tsx` & `src/components/AIGraphViewer.tsx` | **Componente Insignia**: Análisis de grafos AI multi-capa. Replicación al 100% de todos los algoritmos, botones y controles. |
| `sigma.php` | `src/app/sigma/[id]/page.tsx` & `src/components/SigmaGraphViewer.tsx` | Visualización de redes de seguimiento entre usuarios. |
| `hashtags.php` | `src/app/hashtags/[id]/page.tsx` | Visualización de grafos de hashtags estándar. |
| `json_data.php` | `src/app/api/json-data/route.ts` | API para consulta de detalles de nodos (hashtags, posts, usuarios). Incluye normalización `hyphenize()`. |
| `json_scandir.php` / `json_scandir_ai.php` | `src/app/api/json-scandir/route.ts` | API para escaneo de archivos JSON de grafos en `public/json/` y `public/json/ai/`. |
| `db.php` | `src/lib/db.ts` | Conexión a la base de datos local SQLite con `better-sqlite3`. |
| `includes/header.php` | `src/components/Navigation.tsx` | Barra de navegación superior de la aplicación. |
| `includes/style.css` | `src/app/globals.css` | Estilos globales, HoverBox y scrollbars personalizados. |

---

### B. Componentes Descontinuados y Documentados (Modo Solo Consulta)

| Archivo PHP | Razón de Descontinuación | Documentación |
|---|---|---|
| `save_task.php` & `TaskForm.tsx` | Formulario de creación de tareas (INSERT en `tasks`/`queue`). | Removido porque ya no se crearán nuevos proyectos de minería. |
| `delete_task.php` | Eliminación de tareas de la base de datos (DELETE). | Removido para proteger la integridad de los datos históricos. |
| `db_actions/queue_delete.php` | Eliminación de ítems de la cola de minería. | Removido por desuso de la cola de ingesta. |
| `edit.php?delete_json=` | Borrado físico de archivos JSON del disco. | Removido para mantener la caché estática de grafos. |
| `json_user.php` / `json_hashtag.php` / `json_hashtag_ai.php` | Generadores PHP de caché JSON desde MySQL. | Descontinuados; se consumen los 64 archivos JSON cacheados existentes. |
| `hashtags_ai_data.php` & `block_data_live.php` | Versiones preliminares / clones de `hashtags_ai_data_live.php`. | Descartados por ser redundantes. |
| `notebook.php` & `notebook2.php` | Cuadernos tipo Jupyter desacoplados (client-side JS/Markdown eval). | Descartados por no formar parte del núcleo de visualización de redes. |

---

## 🛠️ 5. Replicación Exhaustiva de Funciones en `AIGraphViewer.tsx`

El componente [AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx) replica fielmente las **~2,000 líneas de JavaScript** de `hashtags_ai_data_live.php`:

### 🎨 A. Tipos de Nodos y Codificación de Colores (9 capas)
- `hashtag`: `#556270` (Gris oscuro)
- `post`: `#4ECDC4` (Turquesa)
- `user`: `#C7F464` (Verde lima)
- `hashtag_class`: `#FFA500` (Naranja)
- `ai_text_word`: `#F7CD80` (Amarillo crema)
- `ai_text_hashtag`: `#EAD7B5` (Beige)
- `ai_custom_inference`: `#982AA5` (Púrpura ML)
- `ai_world_inference`: `#A52A2A` (Marrón)
- `entity_individual`: `#FF6B6B` (Rojo rosado)
- `entity_sub`: `#0088FE` (Azul)

---

### ⚙️ B. Botones y Acciones de la Interfaz

1. **`Start FA2 Layout` / `Stop FA2 Layout`**:
   - Inicia o detiene el cálculo de física de ForceAtlas2 en segundo plano utilizando `graphologyLibrary.FA2Layout`.
2. **`Capture Screenshot`**:
   - Exporta el lienzo WebGL del grafo como imagen JPEG en alta resolución (escala 3) mediante `html2canvas`.
3. **`Reset Initial Size & Colors`** (`handleResetFixedSizes`):
   - Reestablece los colores por tipo de nodo y los tamaños base iniciales (`setNodeSize`).
4. **`Drop Not Inferenced`** (`handleCleanNonInferenced`):
   - Calcula el camino más corto (*bidirectional shortest path*) entre nodos de usuario e inferencias ML/NLP. Elimina nodos intermedios de post/hashtag no vinculados.
5. **`Delete Post/Hashtags`** (`handleDeletePostHashtags`):
   - Elimina todos los nodos de tipo `post` y `hashtag` para simplificar la red a usuarios e inferencias.
6. **`Compute Centrality Stats`** (`handleComputeCentrality`):
   - Calcula simultáneamente 4 métricas de centralidad:
     - **Betweenness Centrality**
     - **Closeness Centrality**
     - **Degree Centrality**
     - **PageRank Centrality** (`alpha: 0.3`, `maxIterations: 9000`)
7. **Botones de Escalado por Centralidad**:
   - `Betweenness`, `Closeness`, `Degree`, `PageRank`: Aplican la función `calculateScaleFactor()` y `updateNodeSizes()` para reescalar visualmente los nodos proporcionalmente a cada métrica.
8. **`Compute Louvain Stats` / `Color Louvain Communities`**:
   - Ejecuta la detección de comunidades modulares (`communitiesLouvain`, `resolution: 0.38`) y colorea el grafo usando la paleta de 15 colores predefinida más colores hexadecimales aleatorios (`getRandomColor`).
9. **`Count Node Types`** (`handleCountNodeTypes`):
   - Genera el desglose del conteo total de nodos agrupados por tipo.
10. **`Top Linked Users Analysis`** (`handleContarNodosConUsuariosVinculados`):
    - Identifica los **Top 20 nodos de tipo `entity_individual`** ordenados por la cantidad de usuarios vinculados y muestra la lista de nombres.

---

### 🎛️ C. Filtros y Parámetros del Formulario
- **Poda por Grado Mínimo** (`nodeMinDegree`): Deslizador interactivo (0 a 30).
- **Filtro `cleanEntities`**: Función `latinText()` (expresión regular para excluir caracteres no latinos) y `onlyNumbers()`.
- **Modo de Tamaño `nodeFixedSize`**: Alterna entre tamaños fijos por tipo vs. tamaños normalizados por *likes*, *publicaciones* y *seguidores* con `normalize()`.
- **Reductor de Profundidad** (`reducerDepth`): Reducción visual a **1-Hop** (`selectedNeighbors`) o **2-Hop** (`selectedNeighborsNeighbors`).
- **Historial de Nodos**: Registro interactivo de nodos clickeados con opción de limpieza.
- **Panel Flotante HoverBox**: Inspección detallada al hacer click en un nodo, incluyendo previsualización de imágenes exportadas (`http://data.abundis.com.mx/media//exported_images/{MUID}/{m_id}_exported.jpg`).

---

## 📖 6. Especificación Detallada de Entrada, Salida y Lógica por Archivo y Método

A continuación se detalla la especificación técnica completa de **Entrada (Input)**, **Salida (Output)** y **Lógica Interna (Logic)** para cada uno de los 20+ archivos del sistema legacy y sus funciones/métodos asociados.

---

### 1. `db.php`
- **Entrada (Input)**: Credenciales de conexión MySQL hardcoded (`host`: `abundis.com.mx:3306`, `user`: `abundisc_xamuri`, `pass`, `db`: `abundisc_idmb_nvi`). Sin parámetros HTTP.
- **Salida (Output)**: Variable global `$conn` (`mysqli`) y sesión activa en PHP.
- **Lógica (Logic)**:
  - Invoca `session_start()` al inicio del archivo para disponibilizar `$_SESSION` en todos los componentes que lo incluyan.
  - Ejecuta `mysqli_connect()`. Maneja errores críticos cortando la ejecución con `or die(mysqli_error($conn))`.

---

### 2. Encabezados HTML (`header.php`, `includes/header.php`, `functions.php`)
- **Entrada (Input)**: Inclusión mediante `include`. Sin parámetros `GET`/`POST`.
- **Salida (Output)**: Marcado HTML inicial de la aplicación: `<head>`, meta tags viewport, hojas de estilo CDN (Bootstrap 4 Yeti, FontAwesome 5.6.3, `includes/style.css`) y barra de navegación `<nav>` ("DVI - Data Visualization Interface").
- **Lógica (Logic)**: Plantilla estática de encabezado. `functions.php` en la raíz era una copia redundante de `header.php`.

---

### 3. `includes/functions.php`
- **Entrada (Input)**: Sesión activa (`$_SESSION["message"]`, `$_SESSION["message_type"]`).
- **Salida (Output)**: Alertas Bootstrap y formulario HTML `<form action="save_task.php" method="POST">`.
- **Lógica (Logic)**:
  - `create_task_form()`: Evalúa si existe `$_SESSION["message"]`. De ser así, imprime la alerta dismissible y destruye la variable de mensaje mediante `session_unset()`. Genera los campos de formulario `muid`, `seednode`, `iterations` (radio buttons 0-4), `miningtype` (`user`, `hashtagRecent`, `hashtagTop`), y `hashtagmediaamount`.

---

### 4. `index.php` (Dashboard de Tareas)
- **Entrada (Input)**:
  - Parámetros GET: `sort` (columna de ordenación), `order` (`asc`/`desc`), `editor` (flag administrativo).
  - Consulta SQL: `SELECT t.*, (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID) as p_count, (SELECT COUNT(*) FROM data_recent_hashtags WHERE MUID = t.MUID) as h_count FROM tasks t ORDER BY $sort $order`.
- **Salida (Output)**: Vista principal HTML con formulario de creación y tabla ordenable de tareas con badges de conteo.
- **Lógica (Logic)**:
  - `sort_url($col, $currentSort, $currentOrder)`: Construye dinámicamente enlaces de ordenación invirtiendo el orden actual (`asc`/`desc`) y preservando el parámetro `editor`.
  - `sort_icon($col, $currentSort, $currentOrder)`: Devuelve iconos FontAwesome (`fa-sort`, `fa-sort-up`, `fa-sort-down`).
  - Validaciones: Comprueba `$sort` contra una whitelist `$allowed_sort` para mitigar SQL Injection. Aplica la clase `table-danger text-muted` a tareas vacías (`p_count == 0 && h_count == 0`) y trunca cadenas MUID extensas.

---

### 5. `edit.php` (Detalle y Gestión de Tarea)
- **Entrada (Input)**:
  - Parámetros GET: `id`, `h_sort`, `h_order`, `p_sort`, `p_order`, `delete_json` (MUID a eliminar caché), `editor`.
  - Parámetros POST: `update`, `title`, `description`.
  - Consultas SQL: Prepared Statements para `SELECT * FROM tasks WHERE id = ?`, `UPDATE task set title = ?, description = ? WHERE id = ?`, y consultas de conteo y listado en `data_media` y `data_recent_hashtags`.
- **Salida (Output)**: Panel de detalle en HTML con métricas, lista de archivos JSON cacheados en `./json/ai/`, tabla de hashtags y publicaciones. Si se envía POST `update`, redirige a `index.php`. Si se envía GET `delete_json`, borra los archivos JSON de caché del disco.
- **Lógica (Logic)**:
  - `edit_sort_url()` y `edit_sort_icon()`: Generan enlaces de ordenación independientes para sub-tablas mediante `http_build_query`.
  - Eliminación de Caché: Utiliza `glob("./json/ai/" . basename($MUID) . "*.json")` y `unlink()` para remover físicamente archivos JSON del disco.
  - Seguridad: Uso estricto de Prepared Statements (`mysqli_prepare`, `mysqli_stmt_bind_param`).

---

### 6. `save_task.php` (Creación de Tareas)
- **Entrada (Input)**: Parámetros POST (`save_task`, `muid`, `seednode`, `iterations`, `miningtype`, `hashtagmediaamount`).
- **Salida (Output)**: String hexadecimal aleatorio + Redirección `header('Location: index.php')` con `$_SESSION['message'] = 'Task Saved Successfully'`.
- **Lógica (Logic)**:
  - Genera sufijo aleatorio criptográfico: `bin2hex(random_bytes(4))`.
  - Construye el MUID único concatenado: `$MUID = $MUID . "_" . $random_hex`.
  - Inserta el registro con Prepared Statements en `tasks` y `queue` (con estado `'waiting'`).

---

### 7. `delete_task.php` (Eliminación de Tareas)
- **Entrada (Input)**: Parámetros GET (`id`, `MUID`).
- **Salida (Output)**: Redirección `header('Location: index.php')` con `$_SESSION['message'] = 'Task Removed Successfully'`.
- **Lógica (Logic)**: Valida la presencia de `id` y `MUID`. Ejecuta borrado atómico mediante Prepared Statements en `tasks` (por `id`) y `queue` (por `MUID`).

---

### 8. `json_data.php` (API de Información de Nodos)
- **Entrada (Input)**: GET `node` (ID/Nombre del nodo), `nodeType` (`hashtag`, `ai_text_hashtag`, `post`), `MUID`.
- **Salida (Output)**: `Content-Type: application/json` con detalles de hashtags o arreglo de publicaciones.
- **Lógica (Logic)**:
  - `hyphenize($string)`: Reemplaza caracteres UTF-8 acentuados, eñes, diéresis y comillas especiales por equivalentes ASCII planos.
  - Evaluación según `nodeType`:
    - Si es `hashtag` / `ai_text_hashtag`: Consulta `data_recent_hashtags` y busca publicaciones en `data_media` usando `caption_text LIKE ?`.
    - Si es `post`: Consulta `data_media` directamente por `m_id`.

---

### 9. `json_scandir.php` / `json_scandir_h.php` / `json_scandir_ai.php` (Despachadores de Caché)
- **Entrada (Input)**: GET `MUID`. Escanean carpetas `./json/` y `./json/ai/` mediante `glob()`.
- **Salida (Output)**: `Content-Type: application/json`. Devuelven arreglo JSON con nombres de archivos (ej. `["tarea_1_0.json", "tarea_1_1.json"]`). Si no existen archivos, emiten redirección HTTP `Location:` al script PHP generador correspondiente.
- **Lógica (Logic)**: Comprobación de existencia de caché estática en disco para evitar regeneraciones costosas.

---

### 10. `json_user.php` & `json_hashtag.php` (Generadores de Caché JSON Estándar)
- **Entrada (Input)**: GET `MUID`, `it_no` (número de iteración). Consultan las tablas `data_users`, `data_recent_hashtags` y `data_media`.
- **Salida (Output)**: Escriben archivos físicos `./json/{MUID}_{it_no}.json` con la estructura `{nodes: [...], edges: [...]}` y devuelven el listado JSON o redirigen recursivamente con `it_no+1`.
- **Lógica (Logic)**:
  - `json_format()` / `json_format_sliced()`: Construyen arreglos asociativos de nodos y aristas dirigidas (`user -> post -> hashtag`).
  - `sliceSQLFetch()`: Divide la extracción de datos en lotes (chunks) de 999 registros con redirecciones HTTP recursivas (`Location: json_user.php?MUID=...&it_no=...`) para prevenir desbordamientos de memoria en PHP.

---

### 11. `json_actions/json_hashtag_ai.php` (Generador de Caché AI Multi-capa)
- **Entrada (Input)**: GET `MUID`, `it_no`. Consultas a `data_recent_hashtags`, `data_users` y `data_media` (decodificando campos JSON `inference_custom`, `hashtag_detection`, `inference_world`).
- **Salida (Output)**: Escribe archivos `./json/ai/{MUID}_{it_no}.json` en disco.
- **Lógica (Logic)**:
  - Inicializa nodos raíz duros (`graffiti_lingo`, `railroad_lingo`, `city_dict`, etc.).
  - Decodifica los JSONs de inferencia ML/NLP de cada publicación e inyecta nodos de 9 tipos (`ai_custom_inference`, `ai_text_word`, `entity_individual`, `entity_sub`, etc.) con sus aristas vinculadas.
  - Ejecuta paginación recursiva por lotes de 1,000 publicaciones mediante `sliceSQLFetch()`.

---

### 12. `sigma.php` (Visualizador de Grafos de Usuarios)
- **Entrada (Input)**: GET `id`. Petición Fetch a `json_scandir.php?MUID=` y descarga de chunks JSON.
- **Salida (Output)**: Interfaz WebGL renderizada en `#mountNode` mediante Sigma.js.
- **Lógica (Logic)**:
  - Instancia `new graphology.DirectedGraph()`.
  - Poda de aislados: Elimina nodos con `degree <= 0` y dimensiona por in-degree (`inDegree / 10 + 1`).
  - Comunidades Louvain: `graphologyLibrary.communitiesLouvain` asigna particiones modulares (com0-com6).
  - Algoritmo de física ForceAtlas2 (100 iteraciones, gravity 0.1).
  - Reducers de opacidad en Sigma al seleccionar nodos.

---

### 13. `hashtags.php` (Visualizador de Grafos de Hashtags Estándar)
- **Entrada (Input)**: GET `id`, `NodeMinDegree`. Peticiones AJAX a `json_scandir_h.php` y `json_hashtag_data.php`.
- **Salida (Output)**: Lienzo WebGL Sigma.js y panel lateral `.hoverBox`.
- **Lógica (Logic)**:
  - Instancia `graphology.MultiGraph()`.
  - Poda por umbral `degree <= NodeMinDegree`.
  - Estilizado semántico: `hashtag` (`#556270`), `post` (`#4ECDC4`), `user` (`#C7F464`).
  - Layout ForceAtlas2 (5000 iteraciones).
  - Vecindad de 2 saltos: Destaca vecinos indirectos (`hoveredNeighborsNeighbors`) al hacer clic.
  - Inspector lateral: `hashtagFetchInfo(node)` inyecta metadatos del post/hashtag en `.hoverBox` vía AJAX.

---

### 14. `hashtags_ai_data_live.php` & `block_data_live.php` (Visualizador Insignia Multi-capa AI)
- **Entrada (Input)**:
  - Parámetros GET: `id`, `initialLayout`, `autoGravityScale`, `nodeMinDegree`, `gravity`, `iterations`, `scale`, `adjustSizes`, `cleanEntities`, `barnesHutOptimize`, `barnesHutTheta`, `linLogMode`, `scalingRatio`, `slowDown`, `networkfilter`, `nodeFixedSize`.
  - Parámetros POST: `update`, `title`, `description`.
  - Peticiones Fetch a `json_scandir_ai.php` y archivos en `./json/ai/`.
  - Peticiones AJAX a `json_data.php`.
- **Salida (Output)**: Lienzo WebGL en `#mountNode`, tooltip `.hoverBox` con previsualizaciones de imágenes y datos ML, panel de historial, exportación de capturas de pantalla canvas JPEG.
- **Lógica y Métodos JavaScript Embebidos**:
  1. `latinText(text)`: Validación estricta con Expresión Regular para asegurar caracteres latinos/ASCII. Retorna `boolean`.
  2. `onlyNumbers(text)`: Expresión regular `^-?\d*\.?\d*$` para detectar valores estrictamente numéricos. Retorna `boolean`.
  3. `normalize(value, min, max, newMin, newMax)`: Mapeo matemático para escalar valores de métricas a rangos visuales de tamaño.
  4. **Procesamiento de Ingesta (Fetch Chain)**: Carga en cascada de JSONs hacia `graphology.MultiGraph`. Aplica filtros en caliente (poda `nodeMinDegree`, filtro `cleanEntities`, descarte por `networkfilter`).
  5. `setNodeSize(node, nodetype, drop_cont)`: Asigna tamaños y colores fijos por tipo (9 capas) o tamaños escalados dinámicamente según seguidores/likes.
  6. `nodeOutsideRenderer(node, nodetype)`: Simula clics desde componentes externos UI y dispara la actualización de estados de selección.
  7. `nodeStats(node)`: Actualiza en el DOM las estadísticas de vecinos inmediatos.
  8. `clickedNodeHistory(node)`: Agrega entradas con enlace al historial `.nodeHistory`.
  9. `hashtagFetchInfo(node)` / `postFetchInfo(node)`: Consultas AJAX a `json_data.php` para construir el contenido HTML de `.hoverBox` (incluyendo tags de imágenes `<img>` hacia el servidor de fotos exportadas).
  10. `getRandomColor()`: Genera colores hex aleatorios para comunidades secundarias.
  11. `calculateScaleFactor(graph, centralityAttr, desiredMaxSize)` & `updateNodeSizes(graph, centralityAttr, scaleFactor)`: Encuentran el valor máximo de centralidad y reescalan visualmente todos los nodos.
  12. **Motor ForceAtlas2 Live**: `graphologyLibrary.FA2Layout` corriendo en segundo plano con inicio/paro vía botón.
  13. **Comunidades Louvain**: `communitiesLouvain` con resolución `0.38` y pintado con paleta de 15 colores base + colores aleatorios.
  14. **Centralidades (Centrality Stats)**: Cálculo simultáneo de `betweenness`, `closeness`, `degree` y `pagerank` (`alpha: 0.3`, `maxIterations: 9000`).
  15. `cleanNonInferenced` (Poda de Nodos Intermedios): Calcula caminos más cortos (`graphologyLibrary.shortestPath.bidirectional`) entre usuarios e inferencias ML/NLP. Reconecta las aristas directamente y elimina los nodos intermedios de post/hashtag no inferidos.
  16. `deletePostHashtags`: Elimina en masa todos los nodos de tipo `hashtag` y `post`.
  17. `countnodeType` & `countnodeTypeState`: Generan reportes de conteo por tipo de nodo en el grafo total o subgrafo seleccionado.
  18. `contarNodosConUsuariosVinculados(graph, maxResults)`: Algoritmo de ranking que calcula los Top 20 nodos `entity_individual` con mayor número de usuarios únicos vinculados.
  19. `html2canvas` Screenshots: Renderiza `#mountNode` en alta resolución (escala 3) y desencadena la descarga de la imagen JPEG.

---

### 15. `hashtags_ai_data.php` (Visualizador AI Simplificado)
- **Entrada (Input)**: Parámetros GET simples (`id`, `nodeMinDegree`, `gravity`).
- **Salida (Output)**: Interfaz HTML con lienzo Sigma.js básico.
- **Lógica (Logic)**: Versión preliminar para grafos AI sin la suite completa de algoritmos de centralidad, Louvain ni poda de caminos más cortos. Incluye `hashtagFetchInfo()` para `.hoverBox`.

---

### 16. `notebook.php` & `notebook2.php` (Cuadernos Interactivos)
- **Entrada (Input)**: Ejecución 100% Client-Side. Sin BD ni parámetros PHP.
- **Salida (Output)**: Entorno interactivo tipo Jupyter Notebook en el navegador.
- **Lógica (Logic)**:
  - `executeCode(code)`: Invocación directa de `eval(code)` sobre código JavaScript ingresado por el usuario.
  - `renderHTML()`: Inyección directa de HTML al DOM.
  - `renderMarkdown()`: Parseo de sintaxis Markdown con `marked.min.js`.
  - `toggleJsEditMode()` / `toggleMarkdownEditMode()`: Alterna la visibilidad entre el área de edición y la vista renderizada.

---

### 17. `db_actions/queue_delete.php` (API de Eliminación de Cola)
- **Entrada (Input)**: POST `id` (entero).
- **Salida (Output)**: Cadena de texto `"deleted"`.
- **Lógica (Logic)**: Prepara y ejecuta la sentencia `DELETE FROM queue WHERE id = ?` mediante MySQLi.

---

## 💻 7. Comandos de Uso

### Desarrollo Local
```bash
npm run dev
```
Acceder a: `http://localhost:3000`

### Compilación de Producción
```bash
rm -rf .next && npx tsc --noEmit && npm run build
```

### Regenerar la Base de Datos SQLite (si se actualiza el dump SQL)
```bash
python3 scripts/parse_sql_fast.py
```

---

## ✅ 8. Estado de la Verificación

La compilación de producción fue verificada exitosamente:

```text
  ▲ Next.js 14.2.35
   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types     ✓ Linting and checking validity of types 
   Collecting page data     ✓ Collecting page data 
 ✓ Generating static pages (4/4)
   Finalizing page optimization             ✓ Finalizing page optimization 
```
