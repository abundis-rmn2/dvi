# 🗄️ Documentación de Arquitectura Backend y Consultas SQL

Este documento establece la arquitectura del servidor backend (Next.js 14 App Router + Better-SQLite3) y detalla **todos los puntos de la aplicación que dependen de consultas SQL a la base de datos `public/data/app_data.db`**.

---

## 📑 Tabla de Contenidos
1. [Resumen de Arquitectura y Stack](#1-resumen-de-arquitectura-y-stack)
2. [Esquema de Base de Datos SQLite (`app_data.db`)](#2-esquema-de-base-de-datos-sqlite-app_datadb)
3. [Catálogo Completo de Puntos con Consultas SQL](#3-catálogo-completo-de-puntos-con-consultas-sql)
   - [Punto 1: Dashboard de Tareas (`/api/tasks`)](#punto-1-dashboard-de-tareas-apitasks)
   - [Punto 2: Metadatos de Tarea Individual (`/api/tasks/[id]`)](#punto-2-metadatos-de-tarea-individual-apitasksid)
   - [Punto 3: Estadísticas y Tablas de Tarea (`/api/tasks/[id]/data`)](#punto-3-estadísticas-y-tablas-de-tarea-apitasksiddata)
   - [Punto 4: Inspección Interactiva de Nodos en Grafo (`/api/json-data`)](#punto-4-inspección-interactiva-de-nodos-en-grafo-apijson-data)
   - [Punto 5: Motor de Ingesta e Importación (`scripts/parse_sql_fast.py`)](#punto-5-motor-de-ingesta-e-importación-scriptsparse_sql_fastpy)
4. [Estrategias de Rendimiento e Índices Recomendados](#4-estrategias-de-rendimiento-e-índices-recomendados)

---

## 1. Resumen de Arquitectura y Stack

El backend está construido con **Next.js 14 App Router** utilizando API Routes dinámicas server-side (`export const dynamic = 'force-dynamic'`) conectadas a la base de datos SQLite empaquetada mediante **`better-sqlite3`**.

- **Base de Datos**: `public/data/app_data.db` (SQLite 3).
- **Conector**: `src/lib/db.ts` (`getDb()`).
- **Sistema de Caché de Doble Capa**: `src/lib/cache.ts` (`getCachedData`).
  - **Capa 1 (RAM In-Memory Cache)**: Almacena las respuestas JSON procesadas en memoria RAM del servidor Node.js para entregar respuestas en **0 ms** sin tocar disco.
  - **Capa 2 (Next.js `unstable_cache`)**: Caché persistente de Next.js con tiempo de revalidación (`revalidate: 86400`) y tags.
- **Registros Totales**: 49,327 registros (80 tareas, 23,417 publicaciones media, 3,573 hashtags, 22,257 usuarios).
- **Modo de Operación**: Consulta de lectura en tiempo de ejecución (*Read-Only Consultation Mode*).

---

## 2. Esquema de Base de Datos SQLite (`app_data.db`)

La base de datos contiene cuatro tablas relacionales principales:

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  MUID TEXT NOT NULL,
  seed_node TEXT NOT NULL,
  mining_depth INTEGER,
  mining_type TEXT,
  hashtag_media_amount INTEGER,
  created_at TEXT
);

CREATE TABLE data_media (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  MUID TEXT NOT NULL,
  pk TEXT,
  m_id TEXT,
  taken_at TEXT,
  media_type INTEGER,
  product_type TEXT,
  location TEXT,
  comment_count INTEGER,
  like_count INTEGER,
  caption_text TEXT,
  media TEXT,
  hashtags_used BLOB,
  hashtag_origin TEXT,
  inference_custom TEXT,
  hashtag_detection TEXT,
  inference_world TEXT
);

CREATE TABLE data_recent_hashtags (
  id INTEGER PRIMARY KEY,
  MUID TEXT NOT NULL,
  hashtag TEXT NOT NULL,
  no_publications INTEGER,
  IG_related_hashtags BLOB,
  hashtags_founded BLOB,
  mined_at TEXT
);

CREATE TABLE data_users (
  id INTEGER PRIMARY KEY,
  MUID TEXT,
  pk TEXT,
  username TEXT,
  full_name TEXT,
  is_private INTEGER,
  profile_pic_url TEXT,
  media_count INTEGER,
  following_count INTEGER,
  follower_count INTEGER,
  biography TEXT,
  external_url TEXT,
  account_type TEXT,
  is_business INTEGER,
  public_email TEXT,
  city_id TEXT,
  city_name TEXT,
  following TEXT,
  mined_at TEXT
);
```

---

## 3. Catálogo Completo de Puntos con Consultas SQL

### Punto 1: Dashboard de Tareas (`/api/tasks`)
- **Archivo**: `src/app/api/tasks/route.ts`
- **Uso en Frontend**: Dashboard principal ([src/app/page.tsx](file:///home/abundis/Documents/freight-graffiti/src/app/page.tsx)).
- **Propósito**: Obtener el listado completo de tareas de minado con conteos agregados de publicaciones, hashtags e inferencias de IA.
- **Parámetros**:
  - `sort` (opcional): Columna para ordenar (`created_at`, `MUID`, `seed_node`, `mining_depth`, `hashtag_media_amount`, `p_count`, `h_count`, `inf_count`).
  - `order` (opcional): `ASC` o `DESC`.
- **Consulta SQL**:
  ```sql
  SELECT t.id, t.MUID, t.seed_node, t.mining_depth, t.mining_type, t.hashtag_media_amount, t.created_at,
      (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID) as p_count,
      (SELECT COUNT(*) FROM data_recent_hashtags WHERE MUID = t.MUID) as h_count,
      (SELECT COUNT(*) FROM data_media WHERE MUID = t.MUID AND (
         (inference_custom IS NOT NULL AND inference_custom != '' AND inference_custom != '[]') OR
         (hashtag_detection IS NOT NULL AND hashtag_detection != '' AND hashtag_detection != '[]') OR
         (inference_world IS NOT NULL AND inference_world != '' AND inference_world != '[]')
      )) as inf_count
  FROM tasks t
  ORDER BY ${sort} ${order};
  ```

---

### Punto 2: Metadatos de Tarea Individual (`/api/tasks/[id]`)
- **Archivo**: `src/app/api/tasks/[id]/route.ts`
- **Uso en Frontend**: Visualizador de grafos AI ([src/app/graph/[id]/page.tsx](file:///home/abundis/Documents/freight-graffiti/src/app/graph/[id]/page.tsx)) y visualizador Sigma ([src/app/sigma/[id]/page.tsx](file:///home/abundis/Documents/freight-graffiti/src/app/sigma/[id]/page.tsx)).
- **Propósito**: Obtener los metadatos de una tarea por su ID primario.
- **Parámetros**: `id` (vía URL param).
- **Consulta SQL**:
  ```sql
  SELECT * FROM tasks WHERE id = ?;
  ```

---

### Punto 3: Estadísticas y Tablas de Tarea (`/api/tasks/[id]/data`)
- **Archivo**: `src/app/api/tasks/[id]/data/route.ts`
- **Uso en Frontend**: Vista de detalles de tarea ([src/app/tasks/[id]/page.tsx](file:///home/abundis/Documents/freight-graffiti/src/app/tasks/[id]/page.tsx)).
- **Propósito**: Retornar resumen estadístico y listados de publicaciones y hashtags asociados a un MUID.
- **Parámetros**: `id` (vía URL param), `hSort`, `hOrder`, `pSort`, `pOrder`.
- **Consultas SQL Ejecutadas**:
  1. Obtener metadatos de la tarea:
     ```sql
     SELECT * FROM tasks WHERE id = ?;
     ```
  2. Conteo de publicaciones asociadas:
     ```sql
     SELECT COUNT(*) as total FROM data_media WHERE MUID = ?;
     ```
  3. Conteo de hashtags asociados:
     ```sql
     SELECT COUNT(*) as total FROM data_recent_hashtags WHERE MUID = ?;
     ```
  4. Conteo de usuarios asociados:
     ```sql
     SELECT COUNT(*) as total FROM data_users WHERE MUID = ?;
     ```
  5. Conteo de inferencias de IA asociadas:
     ```sql
     SELECT COUNT(*) as total FROM data_media WHERE MUID = ? AND (
       (inference_custom IS NOT NULL AND inference_custom != '' AND inference_custom != '[]') OR
       (hashtag_detection IS NOT NULL AND hashtag_detection != '' AND hashtag_detection != '[]') OR
       (inference_world IS NOT NULL AND inference_world != '' AND inference_world != '[]')
     );
     ```
  6. Listado de hashtags minados:
     ```sql
     SELECT * FROM data_recent_hashtags WHERE MUID = ? ORDER BY ${safeHSort} ${hOrder};
     ```
  7. Listado de publicaciones de la red (primeras 200):
     ```sql
     SELECT * FROM data_media WHERE MUID = ? ORDER BY ${safePSort} ${pOrder} LIMIT 200;
     ```

---

### Punto 4: Inspección Interactiva de Nodos en Grafo (`/api/json-data`)
- **Archivo**: `src/app/api/json-data/route.ts`
- **Uso en Frontend**: Componente de análisis de grafo WebGL ([AIGraphViewer.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx)).
- **Propósito**: Al hacer clic sobre cualquier nodo del lienzo WebGL (hashtag, usuario o publicación), consulta los datos detallados del nodo en SQLite.
- **Parámetros**: `node` (nombre/ID del nodo), `nodeType` (`hashtag`, `ai_text_hashtag`, `user`, `post`), `MUID`.
- **Consultas SQL por Tipo de Nodo**:
  - **Tipo `hashtag` / `ai_text_hashtag`**:
    1. Información del hashtag:
       ```sql
       SELECT * FROM data_recent_hashtags WHERE hashtag = ? AND MUID = ? LIMIT 1;
       ```
    2. Publicaciones que mencionan el hashtag en la leyenda (`caption_text`):
       ```sql
       SELECT * FROM data_media WHERE MUID = ? AND caption_text LIKE ?;
       ```
  - **Tipo `user`**:
    1. Perfil del usuario:
       ```sql
       SELECT * FROM data_users WHERE username = ? LIMIT 1;
       ```
    2. Publicaciones realizadas por el usuario en la tarea actual:
       ```sql
       SELECT * FROM data_media WHERE user_id = ? AND MUID = ?;
       ```
  - **Tipo `post`**:
    1. Detalle de la publicación por ID de medio (`m_id`):
       ```sql
       SELECT * FROM data_media WHERE m_id = ?;
       ```

---

### Punto 5: Motor de Ingesta e Importación (`scripts/parse_sql_fast.py`)
- **Archivo**: `scripts/parse_sql_fast.py`
- **Uso**: Script independiente de ingesta en Python para procesar volcados MySQL (`abundisc_idmb_nvi.sql` y `media_users.sql`).
- **Operaciones SQL**:
  1. Inicialización de tablas (`CREATE TABLE IF NOT EXISTS ...`).
  2. Inserción masiva en lotes (*batch insert*) con tolerancia a duplicados:
     ```sql
     INSERT OR IGNORE INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?);
     INSERT OR IGNORE INTO data_media VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
     INSERT OR IGNORE INTO data_recent_hashtags VALUES (?, ?, ?, ?, ?, ?, ?);
     INSERT OR IGNORE INTO data_users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
     ```
  3. Extracción y generación estática de `public/data/tasks.json`.

---

## 4. Estrategias de Rendimiento e Índices Recomendados

Para mantener búsquedas en milisegundos sobre los 49,327 registros de la base de datos SQLite, se recomienda contar con los siguientes índices clave:

```sql
CREATE INDEX IF NOT EXISTS idx_media_muid ON data_media(MUID);
CREATE INDEX IF NOT EXISTS idx_media_user_id ON data_media(user_id);
CREATE INDEX IF NOT EXISTS idx_media_m_id ON data_media(m_id);
CREATE INDEX IF NOT EXISTS idx_hashtags_muid_hashtag ON data_recent_hashtags(MUID, hashtag);
CREATE INDEX IF NOT EXISTS idx_users_username ON data_users(username);
```
