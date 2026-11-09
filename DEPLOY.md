# Guía de Despliegue: Freight Graffiti DVI (dvi)

**Proyecto:** Freight Graffiti Data Visualization & Inferences  
**Dominio de Producción:** `https://freight-graffiti.abundis.com.mx`  
**Stack:** Next.js 14.2 (React 18) + Static JSON First + WebGL Sigma/Graphology  
**Puerto Host asignado:** `3011` (interno `3000`)

---

## 1. Arquitectura de Despliegue (Static-First)

* Todas las tareas (40 hashtags de minería) y publicaciones están pre-exportadas en archivos JSON estáticos en `public/json/tasks/` y `public/data/tasks.json`.
* Durante `npm run build`, Next.js pre-renderiza 90 páginas estáticas con metadatos SEO enriquecidos (`generateStaticParams`).
* En producción (Docker runner), el servidor Node **no realiza consultas a SQLite ni cálculos de grafos**. Opera como un servidor ultraligero que entrega páginas estáticas y JSONs a 0 ms con consumo menor a 100 MB de RAM.
* Los visores de red interactivos (Sigma.js / Graphology) corren exclusivamente en el navegador del cliente (WebGL / Web Workers).

## 2. Construcción y Ejecución Local con Docker

```bash
# 1. Construir la imagen (gracias a .dockerignore se excluyen volcados SQL pesados)
docker build -t freight-graffiti-test .

# 2. Correr el contenedor en puerto 3011
docker run -d -p 3011:3000 --name freight_local freight-graffiti-test

# 3. Validar estado y código HTTP 200
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3011

# 4. Limpiar contenedor de prueba
docker rm -f freight_local
```

## 3. Integración en el Stack Maestro (`abeja`)

Este proyecto forma parte del stack central `/opt/stacks/sitios-web/`.
* Se actualiza mediante `sync-repos.sh` jalando directamente de GitHub (`abundis-rmn2/dvi`) con Token Clásico HTTPS.
* Dockge administra sus reinicios y monitoreo de salud (`healthcheck` en puerto 3000 con Node fetch y `start_period: 30s`).
