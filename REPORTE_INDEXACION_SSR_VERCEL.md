# 📊 Reporte Técnico: Optimización de Indexación SEO, Migración SSR y Arquitectura para Vercel

**Proyecto:** Freight Graffiti DVI  
**Dominio:** `https://freight-graffiti.abundis.com.mx`  
**Sitemap:** `https://freight-graffiti.abundis.com.mx/sitemap.xml` (84 URLs)  
**Fecha:** Septiembre 2026  
**Autor:** Antigravity AI & Angel R. Abundis  

---

## 📑 Resumen Ejecutivo

Este documento detalla las intervenciones arquitectónicas y técnicas realizadas en la plataforma **Freight Graffiti DVI** para resolver los problemas de indexación detectados en **Google Search Console** (*"Descubierta: actualmente sin indexar"* en 84 páginas), optimizar el rendimiento de renderizado en servidor (SSR), eliminar la dependencia de módulos nativos C++ de SQLite para el despliegue serverless en **Vercel**, e implementar herramientas automatizadas de pre-generación de datos y calentamiento de caché (*Cache Warming*).

---

## 1. Diagnóstico de Indexación en Google Search Console

### 1.1 Causas Identificadas
- **Renderizado del Lado del Cliente (CSR)**: Las rutas utilizaban la directiva `'use client'` en componentes superiores, entregando contenedores HTML vacíos que requerían la ejecución de JavaScript en el navegador para construir el DOM y los enlaces internos.
- **Ausencia de Metadatos del Servidor**: Falta de etiquetas `<title>`, `<meta description>`, OpenGraph y esquemas JSON-LD estáticos al momento de ser exploradas por Googlebot.
- **Truncamiento de Datos y Dependencia de Bundles**: Componentes reactivos voluminosos retrasaban el tiempo de respuesta inicial (TTFB).

---

## 2. Migración a 100% Server Components (SSR)

Se reestructuraron las rutas del Next.js App Router para convertir todas las páginas principales en **Server Components puros**:

| Ruta | Tipo de Componente | Metadatos y Estructura Generada |
| :--- | :--- | :--- |
| `/` | Server Component | Metadatos estáticos `Metadata`, HTML nativo Bootstrap (0kb JS innecesario de cliente). |
| `/methodology` | Server Component | Metadatos de artículo académico OpenGraph/Twitter, paper transpilado a HTML nativo. |
| `/methodology/[slug]` | Server Component | Esquema JSON-LD `ScholarlyArticle` enriquecido y metadatos SEO. |
| `/hashtags` | Server Component | Carga asíncrona de las 40 tareas desde JSON estático, pre-calculando las 4 tarjetas de métricas globales. |
| `/tasks/[id]` | Server Component | Prerenderizado del 100% de las publicaciones en texto y filtrado de fotografías verificadas 200 OK. |
| `/graph/[id]` | Server Component | Metadatos SEO enriquecidos para la vista del grafo interactivo. |

> [!NOTE]
> La directiva `'use client'` quedó **delimitada exclusivamente** a los visores interactivos de red WebGL ([`SigmaGraphViewer.tsx`](file:///home/abundis/Documents/freight-graffiti/src/components/SigmaGraphViewer.tsx) y [`AIGraphViewer.tsx`](file:///home/abundis/Documents/freight-graffiti/src/components/AIGraphViewer.tsx)) y al buscador/ordenador de columnas ([`HashtagsDashboardClient.tsx`](file:///home/abundis/Documents/freight-graffiti/src/components/HashtagsDashboardClient.tsx)).

---

## 3. Optimización de Medios e Imágenes

### 3.1 Pre-verificación de URLs HTTP 200 vs 404
- Se eliminaron todos los recuadros oscuros y placeholders locales `/img_not_inf.svg`.
- Durante la exportación offline, se ejecutan peticiones HTTP `HEAD` en paralelo contra el servidor de medios (`data.abundis.com.mx`), evaluando candidatos en `exported_images`, `seed_node`, `user_id` y `pk`.
- Si la imagen responde **HTTP 200 OK**, la URL verificada se asigna a `resolved_image_url`. Si responde 404, se asigna `null`.

### 3.2 Renderizado Reactivo en Cliente
- **Vista de Tabla en Texto**: Despliega el **100% de las publicaciones** (sin truncamiento artificial de 200 posts).
- **Instagram Media Grid**: Descarta automáticamente los posts con `resolved_image_url === null`, evitando peticiones 404 fallidas en la consola del navegador.
- El botón **Instagram Grid (X)** muestra el número exacto de publicaciones con fotografía real.

---

## 4. Arquitectura de Despliegue para Vercel (`npm run export-json`)

Para garantizar la compatibilidad con el entorno Serverless/Edge de Vercel y eliminar los problemas con binarios C++ nativos de SQLite (`better-sqlite3`), se implementó la estrategia **Static JSON First**:

```
           [SQLite Database (app_data.db)] (Local / dev)
                          │
                          ▼  npm run export-json
          ┌───────────────┴───────────────┐
          ▼                               ▼
 [public/data/tasks.json]     [public/json/tasks/*.json]
 (Métricas 40 tareas)        (Payloads individuales estáticos)
          │                               │
          └───────────────┬───────────────┘
                          ▼  npm run build
              [Vercel Serverless / Edge] (0% C++ / 0ms DB overhead)
```

### 4.1 Script de Exportación ([`scripts/export-json.js`](file:///home/abundis/Documents/freight-graffiti/scripts/export-json.js))
- Lee `public/data/app_data.db` localmente.
- Pre-calcula los totales reales (`p_count`, `h_count`, `u_count`, `inf_count`) de cada tarea.
- Ejecuta la verificación de imágenes en lotes paralelos (concurrencia de 25).
- Genera archivos JSON independientes en `public/json/tasks/[MUID].json`.

### 4.2 Tolerancia a Payloads > 2MB ([`src/lib/cache.ts`](file:///home/abundis/Documents/freight-graffiti/src/lib/cache.ts))
Next.js `unstable_cache` impone un límite estricto de 2 MB por entrada. Para tareas con más de 3,000 publicaciones (como `fr8porn` o `freightgraffiti` con >4.2 MB):
- Se capturó la excepción de `unstable_cache` mediante un bloque `try-catch`.
- Al sobrepasar 2 MB, la aplicación recurre a un **fallback transparente** en `memoryCache` (memoria RAM), evitando errores `unhandledRejection` y manteniendo tiempos de respuesta de 0 ms.

---

## 5. Script de Calentamiento de Caché (*Cache Warming*)

Para acelerar la respuesta del servidor antes de que Googlebot o los usuarios exploren el sitio, se creó el script automatizado [`scripts/warm-cache.js`](file:///home/abundis/Documents/freight-graffiti/scripts/warm-cache.js).

### 5.1 Funcionamiento
- Extrae la lista completa de las **84 URLs del Sitemap** (`/`, `/methodology`, `/methodology/...`, `/hashtags`, `/tasks/[MUID]`, `/graph/[MUID]`).
- Ejecuta peticiones HTTP `GET` concurrentes en lotes de 5.
- Muestra el tiempo de respuesta (ms), código de estado (200 OK) y pre-calienta la memoria RAM del servidor.

---

## 🛠️ Guía de Comandos para Operación Manual

### 1. Pre-generar JSON estáticos con verificación de imágenes (Offline):
```bash
npm run export-json
```

### 2. Pre-calentar la caché recorriendo las 84 URLs del Sitemap:
```bash
# En entorno local:
npm run warm-cache

# En producción Vercel o dominio propio:
npm run warm-cache https://freight-graffiti.abundis.com.mx
```

### 3. Validar compilación de producción para Vercel:
```bash
npm run build
```

---

## 🎯 Resultados de la Compilación de Producción (`npm run build`)

```bash
Route (app)                                                               Size     First Load JS
┌ ○ /                                                                     176 B          96.4 kB
├ ○ /_not-found                                                           873 B          88.4 kB
├ ƒ /api/json-data                                                        0 B                0 B
├ ƒ /api/json-scandir                                                     0 B                0 B
├ ƒ /api/tasks                                                            0 B                0 B
├ ƒ /api/tasks/[id]                                                       0 B                0 B
├ ƒ /api/tasks/[id]/data                                                  0 B                0 B
├ ƒ /graph/[id]                                                           12 kB           122 kB
├ ○ /hashtags                                                             1.71 kB        97.9 kB
├ ƒ /hashtags/[id]                                                        2.6 kB          106 kB
├ ○ /listing                                                              160 B          87.7 kB
├ ○ /methodology                                                          141 B           113 kB
├ ○ /methodology/mining-shaping-visualizing-...                           141 B           113 kB
├ ○ /robots.txt                                                           0 B                0 B
├ ƒ /sigma/[id]                                                           2.56 kB         106 kB
├ ○ /sitemap.xml                                                          0 B                0 B
└ ƒ /tasks/[id]                                                           10.5 kB         118 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (10/10)
```

---

## 📌 Próximos Pasos Recomendados en Google Search Console

1. Ejecutar `npm run export-json` localmente.
2. Hacer `git push` a Vercel para actualizar la producción.
3. Ejecutar `npm run warm-cache https://freight-graffiti.abundis.com.mx` para pre-cargar las 84 páginas.
4. En **Google Search Console**:
   - Abrir la herramienta **Inspección de URLs**.
   - Probar la URL representativa `https://freight-graffiti.abundis.com.mx/tasks/sitrek_1_hashtagTop_9_bb35c8e8`.
   - Hacer clic en **Solicitar indexación**.
