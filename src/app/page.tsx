'use client';

import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function HomeIndexPage() {
  const paperUrl =
    '/methodology/mining-shaping-visualizing-and-interpreting-instagram-hypertextual-networks-of-freight-train-graffiti-communalities-in-north-america-using-machine-learning-custom-models-and-graphology';
  const externalThesisUrl =
    'https://www.abundis.com.mx/en/thesis/visualization-of-a-hypertextual-interaction-field-in-the-form-of-a-network-graph-using-computational-processes-case-study-graffiti-on-freight-trains-in-north-america';

  return (
    <Container className="py-3">
      {/* Hero Header */}
      <section className="bg-dark text-white p-4 p-md-5 rounded-4 shadow mb-5 border border-secondary relative overflow-hidden">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Badge bg="primary" className="px-3 py-2 fs-6 fw-normal">
            🔬 Master&apos;s Research Project
          </Badge>
          <Badge bg="info" text="dark" className="px-3 py-2 fs-6 fw-normal">
            CADS — Universidad de Guadalajara
          </Badge>
          <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 fw-normal">
            Machine Learning + Network Graphing
          </Badge>
        </div>

        <h1 className="display-5 fw-bold mb-3 text-white" style={{ lineHeight: '1.2' }}>
          Use of Machine Learning Classification Models, both Image and Text, in Network Graphing
        </h1>
        <p className="lead text-light mb-4 fs-4 opacity-90">
          Case Study: Community of Practice Among Graffiti Writers on Freight Trains
        </p>

        <div className="d-flex flex-wrap align-items-center gap-3 border-top border-secondary pt-3">
          <div>
            <span className="text-white-50 small d-block">Author</span>
            <strong className="text-white fs-5">Angel Abundis</strong>
            <span className="text-white-50 ms-2 small">(Communication Master&apos;s Student)</span>
          </div>

          <div className="ms-auto d-flex gap-2 flex-wrap">
            <Link href={paperUrl} className="btn btn-primary btn-lg fw-bold">
              📘 Read Full Methodology Paper
            </Link>
            <Link href="/listing" className="btn btn-outline-light btn-lg fw-bold">
              📊 Explore Data Tasks (/listing)
            </Link>
          </div>
        </div>
      </section>

      {/* Main Index Content */}
      <Row className="gy-4">
        {/* Main Column */}
        <Col lg={8}>
          {/* Epigraph Card */}
          <Card className="border-0 shadow-sm bg-light mb-4 border-start border-primary border-4">
            <Card.Body className="p-4">
              <blockquote className="blockquote mb-0">
                <p className="fs-5 italic text-dark mb-2">
                  &ldquo;Man is an animal suspended in webs of significance he himself has spun.&rdquo;
                </p>
                <footer className="blockquote-footer fw-bold text-primary mt-1">
                  Clifford Geertz
                </footer>
              </blockquote>
            </Card.Body>
          </Card>

          {/* Section: Introduction */}
          <article className="prose mb-5">
            <h2 className="fw-bold mb-3 text-dark border-bottom pb-2">Introduction</h2>
            <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
              Contemporary graffiti has transcended traditional static urban interventions to become a nomadic, hyper-connected system of communication. In the specific context of <strong>freight train graffiti</strong>, railcars operate as mobile canvases, carrying visual messages across vast intercontinental logistics corridors throughout North America (Mexico, the United States, and Canada). This phenomenon represents not merely a physical appropriation of industrial space, but what Cruz-Gómez (2014) defines as a <strong>geographically dispersed <em>onlife</em> community</strong>: an ecosystem where physical transit along railroad tracks is inextricably linked with digital circulation across social media networks, primarily Instagram.
            </p>

            <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
              As anthropologist Clifford Geertz observed, human experience is embedded within self-created webs of meaning. In signature graffiti, this web of significance aligns with Figueroa&apos;s (2014) conceptual framework: the <strong>Triad of the Self-Announcement</strong>. This triad articulates the simultaneous assertion of existence (<em>&ldquo;I exist&rdquo; / Communalities</em>), spatial footprint (<em>&ldquo;I was here&rdquo; / Geographies</em>), and identity (<em>&ldquo;I am&rdquo; / Entities</em>). Within this dispersed community, two key actor roles emerge:
            </p>

            {/* Actor Roles Grid */}
            <Row className="g-3 my-3">
              <Col md={6}>
                <Card className="h-100 border-primary bg-primary bg-opacity-10 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold text-primary mb-2">🎨 Freight Graffiti Writers</h5>
                    <p className="small text-dark mb-0">
                      Mark freight cars to broadcast their signatures across a transnational network of writers, using mobile steel as medium.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 border-info bg-info bg-opacity-10 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold text-info mb-2 text-dark">📷 Freight Graffiti Benchers</h5>
                    <p className="small text-dark mb-0">
                      Spotters and photographers who document freight cars at train yards, uploading photos to Instagram enriched with location, date, and rail metadata.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <p className="fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
              Despite its rich sociocultural significance, empirical analysis of large-scale freight graffiti poses a severe methodological challenge due to the volume, ephemerality, and multimodal nature of the data. Traditional qualitative methods in the social sciences fall short when attempting to map thousands of social media posts, visual style variations, and domain-specific slang simultaneously.
            </p>
          </article>

          {/* Listing Section: Computational Multimodal Architecture */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4 text-dark d-flex align-items-center justify-content-between">
              <span>⚡ Computational Framework &amp; Multimodal Architecture</span>
              <Link href="/listing" className="btn btn-sm btn-outline-primary fw-bold">
                View All Tasks in /listing &rarr;
              </Link>
            </h3>

            <p className="text-muted mb-4">
              To address these methodological constraints, this research introduces an interdisciplinary framework integrating <strong>Multimodal Machine Learning Classification Models</strong> directly into dynamic <strong>Network Graphing</strong>:
            </p>

            {/* /listing Component Cards */}
            <div className="d-flex flex-column gap-3">
              {/* Item 1 */}
              <Card className="shadow-sm border-0 border-start border-4 border-primary hover-shadow transition-all">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-primary px-3 py-2 font-monospace">01 / DATA MINING</span>
                    <small className="text-muted">Python 3 + instagrapi</small>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">
                    Social Media Data Mining &amp; Relational Modeling
                  </h4>
                  <p className="text-secondary mb-3">
                    Systematic extraction of Instagram posts, user profiles, captions, hashtags, and interaction metadata through custom automated bots (`instagrapi`), structured inside a relational SQL database.
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <Badge bg="light" text="dark" className="border">Posts Data</Badge>
                    <Badge bg="light" text="dark" className="border">Hashtags Depth</Badge>
                    <Badge bg="light" text="dark" className="border">SQL Storage</Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Item 2 */}
              <Card className="shadow-sm border-0 border-start border-4 border-success hover-shadow transition-all">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-success px-3 py-2 font-monospace">02 / IMAGE_AI</span>
                    <small className="text-muted">TensorFlow + Computer Vision</small>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">
                    Computer Vision Object Detection &amp; Style Classification
                  </h4>
                  <p className="text-secondary mb-3">
                    Deployment of Convolutional Object Detection models (trained on 100+ instances per category) to recognize and bound visual graffiti typologies: <em>Wildstyle</em>, <em>Bomba</em>, <em>S_Tren</em>, <em>Moniker</em>, <em>Caracter</em>, and <em>Tag</em>.
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <Badge bg="light" text="dark" className="border">Wildstyle (0.94 score)</Badge>
                    <Badge bg="light" text="dark" className="border">S_Tren (0.95 score)</Badge>
                    <Badge bg="light" text="dark" className="border">Moniker &amp; Bomba</Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Item 3 */}
              <Card className="shadow-sm border-0 border-start border-4 border-warning hover-shadow transition-all">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-warning text-dark px-3 py-2 font-monospace">03 / TEXT_AI</span>
                    <small className="text-muted">spaCy + NLP Entity Recognition</small>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">
                    Natural Language Processing &amp; Out-of-Vocabulary Extraction
                  </h4>
                  <p className="text-secondary mb-3">
                    Utilization of NLP models (`spaCy`) with Bag-of-Words (BOW) dictionaries to index North American cities, railroad lingo, and graffiti terminology. Combined with Out-of-Vocabulary (OOV) named entity recognition to automatically isolate <em>writers</em> and <em>crews</em>.
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <Badge bg="light" text="dark" className="border">Rail Lingo</Badge>
                    <Badge bg="light" text="dark" className="border">City Toponyms</Badge>
                    <Badge bg="light" text="dark" className="border">OOV Writer Tags</Badge>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </section>
        </Col>

        {/* Sidebar Column */}
        <Col lg={4}>
          {/* Methodology Paper Card */}
          <Card className="shadow-sm border-0 mb-4 bg-primary text-white">
            <Card.Body className="p-4">
              <span className="badge bg-white text-primary fw-bold mb-2">UXUC Journal Paper</span>
              <h5 className="fw-bold text-white mb-2">Mining, Shaping, Visualizing, and Interpreting Instagram Hypertextual Networks</h5>
              <p className="small text-white-50 mb-3">
                Full academic paper published in UXUC Journal V5 - N2 (pp. 68–87).
              </p>
              <Link href={paperUrl} className="btn btn-light btn-lg w-100 fw-bold">
                📖 Read Paper in /methodology
              </Link>
            </Card.Body>
          </Card>

          {/* Quick Dashboard Action Card */}
          <Card className="shadow-sm border-primary mb-4 bg-dark text-white">
            <Card.Body className="p-4 text-center">
              <h5 className="fw-bold text-info mb-3">📊 Data Dashboard</h5>
              <p className="small text-light opacity-90 mb-4">
                Access the complete dataset of mined tasks, MUIDs, network graphs, and inference counts.
              </p>
              <Link href="/listing" className="btn btn-info btn-lg w-100 fw-bold py-2">
                Open /listing Dashboard
              </Link>
            </Card.Body>
          </Card>

          {/* Triad of Self Concept Card */}
          <Card className="shadow-sm mb-4 border-0 bg-light">
            <Card.Header className="bg-secondary text-white fw-bold">
              🔺 Triad of Self-Announcement
            </Card.Header>
            <Card.Body>
              <p className="small text-muted mb-3">
                Figueroa (2014) signature graffiti framework applied to railroad culture:
              </p>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 font-monospace small">
                <li className="p-2 bg-white rounded border">
                  <strong className="text-primary">I EXIST</strong> → Communalities
                </li>
                <li className="p-2 bg-white rounded border">
                  <strong className="text-success">I WAS HERE</strong> → Geographies
                </li>
                <li className="p-2 bg-white rounded border">
                  <strong className="text-warning text-dark">I AM</strong> → Entities (Writers/Crews)
                </li>
              </ul>
            </Card.Body>
          </Card>

          {/* External Thesis Link */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white fw-bold">
              🌐 External Publications
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              <a href={externalThesisUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark text-start btn-sm">
                🎓 Full Master&apos;s Thesis at abundis.com.mx 🔗
              </a>
              <Link href="/hashtags" className="btn btn-outline-primary text-start btn-sm">
                🏷️ Hashtags Network Analysis
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
