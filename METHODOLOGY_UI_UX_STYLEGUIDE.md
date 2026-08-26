# 📜 Guía de Estilo UI/UX para Transpilación de Papers Académicos y Documentación Técnica

Esta guía establece la especificación técnica y de diseño UI/UX basada en el esquema de `/methodology` ([MethodologyPaper.tsx](file:///home/abundis/Documents/freight-graffiti/src/components/MethodologyPaper.tsx)). Su objetivo es servir como estándar para transpilar papers científicos, publicaciones académicas o reportes técnicos complejos a aplicaciones web interactivas (React / Next.js).

---

## 1. Principios de la Transpilación Académica UI/UX

1. **Rigurosidad Académica + Interactividad Web**: Preserva la fidelidad de la publicación original (citas, autores, figuras, metodología) mientras añade navegabilidad interactiva, badges informativos y enlaces a ejecuciones o datasets en vivo.
2. **Jerarquía Visual Clara**: Separación entre metadatos del journal, barra de contenidos persistente (TOC sticky) y el cuerpo modular del paper.
3. **Optimización de Lectura**: Espaciamiento confortable (`line-height: 1.8`), contraste equilibrado (fondos `bg-light` con tarjetas blancas `shadow-sm`), y uso de fuentes monospaciadas para código, variables e hipertextos.
4. **SEO Científico Nativo**: Integración de metadatos estructurados [JSON-LD (Schema.org ScholarlyArticle)](#4-seo-académico--metadatos-json-ld) para indexación en Google Scholar y buscadores web.

---

## 2. Arquitectura del Layout (Grid System 3/9)

El layout se estructura utilizando un sistema de cuadrícula flexible (Bootstrap / Tailwind equivalent):

```
+-------------------------------------------------------------------------------+
|                        Journal Top Header / Paper Hero                        |
|   [UXUC Journal Vol/Issue Pill]                 [PDF Badge] [Live Demo CTA]   |
|   Title (display-6)                                                           |
|   Author Info (Avatar, Name, Affiliation, Email)                              |
+-------------------------------------------------------------------------------+
|  Col lg={3} (Sidebar Sticky)         |  Col lg={9} (Cuerpo Principal Paper)   |
|                                      |                                        |
|  +--------------------------------+  |  +----------------------------------+  |
|  | 📑 Table of Contents (TOC)     |  |  | Abstract Card                    |  |
|  |  - Abstract & Keywords         |  |  |  - Abstract Paragraphs           |  |
|  |  - 1. Introduction             |  |  |  - Keyword Badges                |  |
|  |  - 2. Mine & Inference         |  |  +----------------------------------+  |
|  |    - 2.1 Data Collection       |  |  +----------------------------------+  |
|  |    - 2.2 Machine Learning      |  |  | Section Cards (1, 2, 3...)       |  |
|  |  - 3. Modeling & Graphology    |  |  |  - Subsections & Visual Captions |  |
|  |  - 4. Node Reduction           |  |  |  - Side-by-side Figure Cards     |  |
|  |  - 5. Case Studies             |  |  |  - Metric Tables                 |  |
|  |  - 6. Conclusion               |  |  |  - GitHub Repo Buttons           |  |
|  |  - 7. References               |  |  +----------------------------------+  |
|  +--------------------------------+  |  +----------------------------------+  |
|  | 📊 Live Dataset CTA Card       |  |  | References Card                  |  |
|  +--------------------------------+  |  +----------------------------------+  |
+-------------------------------------------------------------------------------+
```

---

## 3. Especificación de Componentes UI

### 3.1 Top Journal Header (Hero)
El encabezado del paper sitúa al lector en el contexto editorial e institucional:
- **Journal Sub-header Strip**: Etiqueta monospaciada (`font-monospace text-uppercase text-primary small`) indicando revista, volumen, número y rango de páginas (`UXUC — Journal V5 — N2 (pp. 68–87)`).
- **Acciones Rápidas**:
  - Badge indicador de versión transpilada / PDF original (`📄 Original Paper PDF Transpiled`).
  - Botón primario de enlace a herramientas en vivo (`📊 Live Mining Tasks (/hashtags)`).
- **Título Principal**: Typo grande `display-6 fw-bold text-dark` con `line-height: 1.25`.
- **Firma de Autor**: Avatar circular con iniciales, nombre en negrita, superíndice de afiliación (`Angel R. Abundis 1,*`) y detalles institucionales en fuente secundaria.
- **Barra de Metadatos de Contacto**: Email de autor correspondencia + filiación científica.

### 3.2 Tabla de Contenidos Sticky (Sidebar Nav)
- **Posicionamiento**: `sticky-top` con offset superior (`top: 20px`).
- **Navegación Fluida**: Implementación de `scrollIntoView({ behavior: 'smooth', block: 'start' })`.
- **Indicador Visual de Sección Activa**: Resaltado interactivo mediante estado `activeTab` (`.active` en la pestaña seleccionada).
- **Jerarquía con Sangría**: Secciones secundarias (2.1, 2.2, 3.1, etc.) llevan padding izquierdo (`ps-3`) y texto secundario (`text-muted`).
- **Card de Llamado a la Acción (CTA Widget)**: Ubicado debajo del TOC para dirigir al usuario a demos, ejecutables o tableros en tiempo real.

### 3.3 Tarjetas de Sección (Section Cards)
Cada sección lógica o capítulo del paper se encapsula en una tarjeta limpia:
- **Estilo Base**: `Card className="shadow-sm border-0 mb-4"`.
- **Separadores de Sección**: Títulos `h2` con border inferior (`border-bottom pb-2 mb-3`).
- **Tipografía de Texto**: `fs-6 text-secondary` con interlineado holgado `lineHeight: '1.8'`.

### 3.4 Visores de Figuras e Imágenes (Figure Viewports)
Para gráficos de redes, capturas de modelos o esquemas conceptuales:
- **Contenedores Adaptativos**:
  - `Card className="my-4 border-0 shadow-sm overflow-hidden bg-dark text-white"` para visualizaciones densas de redes o diagramas oscuros.
  - Ajuste de imagen `maxHeight: '500px'`, `objectFit: 'contain'`.
- **Badges de Identificación de Figuras**: Badge identificador de color según tipo (`Badge bg-info`, `Badge bg-primary`, `Badge bg-success`).
- **Pie de Figura (Caption)**: Texto descriptivo en el footer de la tarjeta (`small text-muted` o `small text-light`).
- **Comparativa Side-by-Side (2 Columnas)**: Para comparar layouts antes/después o configuraciones alternativas (`Row className="g-3 my-3"` conteniendo tarjetas de medio ancho).

### 3.5 Enlaces a Repositorios & Código Fuente
En las secciones técnicas que refieren scripts, modelos o algoritmos:
- Botón/Badge alineado a la derecha del título de sección:
  ```tsx
  <a href="https://github.com/usuario/repo" target="_blank" rel="noopener noreferrer" 
     className="btn btn-outline-primary btn-sm font-monospace fw-bold">
    📦 GitHub Repo: nombre_repo 🔗
  </a>
  ```

### 3.6 Tablas de Reducción y Datos Experimentos
Para reportar métricas de minería, nodos, precisión o datasets:
- **Estilo de Tabla**: `Table bordered hover size="sm" className="align-middle text-center font-monospace small"`.
- **Resaltado de Filas de Impacto**:
  - Fila inicial o benchmark en estado neutro o advertencia (`table-dark` o `text-danger`).
  - Fila de resultado optimizado en estado éxito (`table-success`).

### 3.7 Cajas de Destacado Conceptual (Callout Boxes)
Para resaltar definiciones, triadas teóricas o algoritmos clave:
- `p-3 bg-light rounded border border-start border-4 border-primary mb-4`

---

## 4. SEO Académico & Metadatos (JSON-LD Schema.org)

Para asegurar que las páginas transpiladas mantengan validez y descubribilidad científica en motores de búsqueda, incluye siempre el esquema JSON-LD al inicio del componente:

```tsx
const paperJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  headline: 'Título Completo del Paper Académico',
  name: 'Nombre Corto o Título del Paper',
  author: [
    {
      '@type': 'Person',
      name: 'Nombre del Autor',
      email: 'autor@dominio.com',
      affiliation: {
        '@type': 'EducationalOrganization',
        name: 'Institución / Universidad',
      },
    },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Nombre de la Revista / Journal',
  },
  isPartOf: {
    '@type': 'PublicationIssue',
    issueNumber: 'N2',
    volumeNumber: 'V5',
    name: 'Nombre de la Edición',
    pageStart: '68',
    pageEnd: '87',
  },
  keywords: [
    'Palabra Clave 1',
    'Palabra Clave 2',
    'Machine Learning',
    'Graphology',
  ],
  inLanguage: 'es', // o 'en'
};

// Inyección en JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(paperJsonLd) }}
/>
```

---

## 5. Plantilla Base de Transpilación (React / Next.js)

```tsx
'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Nav, Table } from 'react-bootstrap';
import Link from 'next/link';

export function TranspiledPaperTemplate() {
  const [activeTab, setActiveTab] = useState<string>('abstract');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container>
        {/* Header del Journal */}
        <header className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-2">
            <span className="text-uppercase tracking-wider fw-bold text-primary font-monospace small">
              REVISTA / JOURNAL — VOL. X — N. Y (pp. 00–00)
            </span>
            <Badge bg="dark" className="px-3 py-2">
              📄 Original Paper PDF Transpiled
            </Badge>
          </div>

          <h1 className="display-6 fw-bold text-dark mb-3">
            Título del Artículo o Investigación Científica
          </h1>

          <div className="d-flex align-items-center gap-3 my-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 42, height: 42 }}>
              AU
            </div>
            <div>
              <strong className="d-block text-dark">Nombre del Autor</strong>
              <small className="text-muted">Institución o Departamento de Investigación</small>
            </div>
          </div>
        </header>

        {/* Layout Grid (3/9) */}
        <Row className="gy-4">
          {/* TOC Sidebar */}
          <Col lg={3} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: '20px', zIndex: 10 }}>
              <Card className="shadow-sm border-0 mb-3">
                <Card.Header className="bg-dark text-white fw-bold py-2 font-monospace small">
                  📑 Tabla de Contenidos
                </Card.Header>
                <Card.Body className="p-2">
                  <Nav className="flex-column nav-pills small">
                    <Nav.Link
                      onClick={() => scrollToSection('abstract')}
                      className={`py-1 px-2 ${activeTab === 'abstract' ? 'active' : 'text-dark'}`}
                    >
                      Resumen &amp; Palabras Clave
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-1')}
                      className={`py-1 px-2 ${activeTab === 'sec-1' ? 'active' : 'text-dark'}`}
                    >
                      1. Introducción
                    </Nav.Link>
                    {/* Agregar secciones adicionales aquí */}
                  </Nav>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Cuerpo Principal */}
          <Col lg={9}>
            {/* Abstract */}
            <Card id="abstract" className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-primary text-white fw-bold py-3 fs-5">
                Resumen / Abstract
              </Card.Header>
              <Card.Body className="p-4">
                <p className="fs-6 text-dark" style={{ lineHeight: '1.8' }}>
                  Texto del resumen científico...
                </p>
                <hr />
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <strong className="text-dark me-2">Palabras Clave:</strong>
                  <Badge bg="secondary" className="px-2 py-1 font-monospace fw-normal">Concepto 1</Badge>
                  <Badge bg="secondary" className="px-2 py-1 font-monospace fw-normal">Concepto 2</Badge>
                </div>
              </Card.Body>
            </Card>

            {/* Sección 1 */}
            <Card id="sec-1" className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">1. Introducción</h2>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  Contenido de la introducción...
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
```

---

## 6. Resumen de Buenas Prácticas UI/UX

1. **Uso de IDs Normalizados**: Todos los elementos contenedores de sección deben tener `id` limpios (`sec-1`, `sec-2-1`) para asegurar el funcionamiento del scroll interactivo.
2. **Feedback Visual en Enlaces**: Los badges y botones interactivos hacia datasets o código externo deben abrirse en pestañas nuevas con `target="_blank" rel="noopener noreferrer"`.
3. **Accesibilidad e Imágenes**: Todas las imágenes de figuras deben contar con `alt` descriptivo y leyenda clara.
4. **Validación de Compilación**: Al realizar cualquier transpilación o nuevo componente, ejecutar `npx vite build` o `npm run build` para garantizar la integridad de las rutas de importación.
