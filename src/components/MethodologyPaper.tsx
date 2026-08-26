'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Nav, Table } from 'react-bootstrap';
import Link from 'next/link';

export function MethodologyPaper() {
  const [activeTab, setActiveTab] = useState<string>('abstract');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const paperJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline:
      'Mining, Shaping, Visualizing, and Interpreting Instagram Hypertextual Networks of Freight Train Graffiti Communalities in North America Using Machine Learning Custom Models and Graphology',
    name:
      'Mining, Shaping, Visualizing, and Interpreting Instagram Hypertextual Networks of Freight Train Graffiti Communalities in North America',
    author: [
      {
        '@type': 'Person',
        name: 'Angel R. Abundis',
        email: 'abundiscomunicacion@gmail.com',
        affiliation: {
          '@type': 'EducationalOrganization',
          name: 'Departamento de Estudios de la Comunicación Social, CUCSH — Universidad de Guadalajara',
        },
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'UXUC Journal',
    },
    isPartOf: {
      '@type': 'PublicationIssue',
      issueNumber: 'N2',
      volumeNumber: 'V5',
      name: 'Designing Urban Experiences',
      pageStart: '68',
      pageEnd: '87',
    },
    keywords: [
      'Freight Train Graffiti',
      'Instagram Hypertextual Networks',
      'Graphology',
      'Machine Learning',
      'Computer Vision',
      'spaCy NLP',
      'Triad of Self-Announcement',
      'Communalities in North America',
    ],
    inLanguage: 'en',
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(paperJsonLd) }}
      />
      <Container>
        {/* Journal Top Header */}
        <header className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-2">
            <span className="text-uppercase tracking-wider fw-bold text-primary font-monospace small">
              UXUC — Journal V5 — N2 | Designing Urban Experiences (pp. 68–87)
            </span>
            <div className="d-flex gap-2">
              <Badge bg="dark" className="px-3 py-2">
                📄 Original Paper PDF Transpiled + High-Res Figures
              </Badge>
              <Link href="/hashtags" className="btn btn-sm btn-outline-primary fw-bold">
                📊 Live Mining Tasks (/hashtags)
              </Link>
            </div>
          </div>

          <h1 className="display-6 fw-bold text-dark mb-3" style={{ lineHeight: '1.25' }}>
            Mining, Shaping, Visualizing, and Interpreting Instagram Hypertextual Networks of Freight Train Graffiti Communalities in North America Using Machine Learning Custom Models and Graphology
          </h1>

          <div className="d-flex align-items-center gap-3 my-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 42, height: 42 }}
              >
                AA
              </div>
              <div>
                <strong className="d-block text-dark">Angel R. Abundis <sup>1,*</sup></strong>
                <small className="text-muted">
                  Departamento de Estudios de la Comunicación Social, CUCSH — UDG, 44260 Guadalajara, México
                </small>
              </div>
            </div>
          </div>

          <div className="bg-light p-3 rounded border text-muted small d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span>✉️ <strong>Corresponding Author:</strong> abundiscomunicacion@gmail.com</span>
            <span>🌐 <strong>Affiliation:</strong> Universidad de Guadalajara (UDG) — CADS</span>
          </div>
        </header>

        {/* Layout Grid with Sticky TOC */}
        <Row className="gy-4">
          {/* Sticky Table of Contents Sidebar */}
          <Col lg={3} className="d-none d-lg-block">
            <div className="sticky-top" style={{ top: '20px', zIndex: 10 }}>
              <Card className="shadow-sm border-0 mb-3">
                <Card.Header className="bg-dark text-white fw-bold py-2 font-monospace small">
                  📑 Table of Contents
                </Card.Header>
                <Card.Body className="p-2">
                  <Nav className="flex-column nav-pills small">
                    <Nav.Link
                      onClick={() => scrollToSection('abstract')}
                      className={`py-1 px-2 ${activeTab === 'abstract' ? 'active' : 'text-dark'}`}
                    >
                      Abstract &amp; Keywords
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-1')}
                      className={`py-1 px-2 ${activeTab === 'sec-1' ? 'active' : 'text-dark'}`}
                    >
                      1. Introduction
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-2')}
                      className={`py-1 px-2 ${activeTab === 'sec-2' ? 'active' : 'text-dark'}`}
                    >
                      2. Mine &amp; Inference #freightgraffiti
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-2-1')}
                      className={`py-1 px-2 ps-3 ${activeTab === 'sec-2-1' ? 'active' : 'text-muted'}`}
                    >
                      2.1 Data Collection &amp; idmb bot
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-2-2')}
                      className={`py-1 px-2 ps-3 ${activeTab === 'sec-2-2' ? 'active' : 'text-muted'}`}
                    >
                      2.2 Machine Learning (TensorFlow)
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-2-3')}
                      className={`py-1 px-2 ps-3 ${activeTab === 'sec-2-3' ? 'active' : 'text-muted'}`}
                    >
                      2.3 NLP Analysis (spaCy)
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-3')}
                      className={`py-1 px-2 ${activeTab === 'sec-3' ? 'active' : 'text-dark'}`}
                    >
                      3. Modeling &amp; Graphology
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-3-1')}
                      className={`py-1 px-2 ps-3 ${activeTab === 'sec-3-1' ? 'active' : 'text-muted'}`}
                    >
                      3.1 Network Layout &amp; Schemas
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-3-2')}
                      className={`py-1 px-2 ps-3 ${activeTab === 'sec-3-2' ? 'active' : 'text-muted'}`}
                    >
                      3.2 Clustering (ForceAtlas2 &amp; Louvain)
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-3-3')}
                      className={`py-1 px-2 ps-3 ${activeTab === 'sec-3-3' ? 'active' : 'text-muted'}`}
                    >
                      3.3 Centrality Metrics
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-4')}
                      className={`py-1 px-2 ${activeTab === 'sec-4' ? 'active' : 'text-dark'}`}
                    >
                      4. Node Reduction Filter
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-5')}
                      className={`py-1 px-2 ${activeTab === 'sec-5' ? 'active' : 'text-dark'}`}
                    >
                      5. Case Studies (#FreightGraffiti, #Kosm, #PortlandBench)
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-conclusion')}
                      className={`py-1 px-2 ${activeTab === 'sec-conclusion' ? 'active' : 'text-dark'}`}
                    >
                      6. Conclusion
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => scrollToSection('sec-references')}
                      className={`py-1 px-2 ${activeTab === 'sec-references' ? 'active' : 'text-dark'}`}
                    >
                      7. References
                    </Nav.Link>
                  </Nav>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-primary bg-primary text-white p-3 text-center">
                <h6 className="fw-bold mb-2">📊 Live Dataset Dashboard</h6>
                <p className="small mb-3 text-light opacity-90">
                  Explore mined tasks, node counts, and live Graphology visualizations.
                </p>
                <Link href="/hashtags" className="btn btn-light btn-sm fw-bold">
                  View Tasks (/hashtags)
                </Link>
              </Card>
            </div>
          </Col>

          {/* Main Academic Paper Body Column */}
          <Col lg={9}>
            {/* Section: Abstract */}
            <Card id="abstract" className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-primary text-white fw-bold py-3 fs-5">
                Abstract
              </Card.Header>
              <Card.Body className="p-4">
                <p className="fs-6 text-dark" style={{ lineHeight: '1.8' }}>
                  The practice of benching in graffiti has evolved over time, transitioning from a gathering point for graffiti writers in New York City subway stations, where they admired and valued the artwork on passenger vehicles, to becoming an integral part of graffiti on freight trains in North America. Nowadays, interventions decorating rolling stock that circulates transnationally are documented and shared in benching communities. Although the dynamics and geographical reach have shifted from hyper-local to international through online platforms, the underlying principle remains the same: benching serves as a meeting place where writers appreciate each other’s work and gain recognition.
                </p>
                <p className="fs-6 text-dark" style={{ lineHeight: '1.8' }}>
                  This methodological-practical study explores the possibilities of analyzing communalities among graffiti writers on freight trains through their online publications. Communalities can be derived from data such as the types of documented graffiti, the number of likes, the quantity of comments, the communal glossary used in hypertextual tags, and the volume of posts published inside those hashtags.
                </p>
                <p className="fs-6 text-dark" style={{ lineHeight: '1.8' }}>
                  This text revolves around the exposure of three hypertextual conversations with different mining scales and analyzing scopes. It showcases the hashtags of a graffiti writer in freight trains (<code>#kosm</code>), a communal meeting point hashtag (<code>#freightgraffiti</code>), and a geographically focused hashtag (<code>#portlandbench</code>). By selecting the seed node in the mining iterator, different types of symbolic exchanges, participants, and content within Instagram metadata and those generated through training and inference of machine learning models can be analyzed.
                </p>
                <p className="fs-6 text-dark mb-4" style={{ lineHeight: '1.8' }}>
                  While the interpretation of these three examples is central, the text also presents the encoded computational techniques for data extraction, construction, and visualization of user-generated conversations on Instagram. Parameters such as depth, the number of mined posts, and the concept of seed node in data mining are discussed. The text addresses the limitations and capabilities of the machine learning models used, including object detection in images and categorization of hypertextual tags in posts. Additionally, it highlights data cleansing and parameters such as gravity, scale-ratio, and centrality measures used for real-time visualization achieved through Graphology.
                </p>

                <hr />
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <strong className="text-dark me-2">Keywords:</strong>
                  {['computational social science', 'freight graffiti', 'datafication', 'digital methodology', 'network visualization', 'communication studies'].map((kw, i) => (
                    <Badge key={i} bg="secondary" className="px-2 py-1 font-monospace fw-normal">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Section 1: Introduction */}
            <Card id="sec-1" className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">1. Introduction</h2>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  Benching is a central practice in contemporary graffiti culture, with its roots tracing back to the subway stations of New York City during the golden era of subway graffiti. At these iconic benching spots such as GrandConcourse and 149st, graffiti writers would gather to observe, appreciate, and peer-review graffiti. These spots worked not only as observation points but also as social hubs where writers could engage with one another, exchange techniques, and earn recognition within their specific community of practice.
                </p>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  With the emergence and consolidation of user-generated content platforms like Instagram, the tradition of benching undergoes a transformation, adapting to new mediums. Hashtags such as <code>#FreightBenching</code> facilitate this transition, turning local benching spots into digital communities of practice. Here, graffiti writers and benchers gather to share evidence of active and live geographically dispersed graffiti scenes. This shift not only expands the reach of different graffiti writers&apos; self-promotion but also creates a transnational peer-to-peer community, while still preserving the core principle of graffiti culture: the competitive <em>getting up</em> (Castleman, 1980).
                </p>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  This paper aims to demonstrate the application of computational social science methods in visualizing and analyzing three hypertextual conversations with different mining scales and analytical scopes. Specifically, it explores the <em>autopromotion</em> of a freight graffiti writer using the hashtag <code>#kosm</code>, as well as the <em>communal retransmission</em> of graffiti interventions in two distinct spaces: the general meeting point hashtag <code>#freightgraffiti</code> and a geographically focused one, <code>#portlandbench</code>. Through these examples, the paper discusses the computational techniques employed in studying digital graffiti communities on Instagram.
                </p>
              </Card.Body>
            </Card>

            {/* Section 2: Mine and Inference #freightgraffiti */}
            <Card id="sec-2" className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">2. Mine and Inference #freightgraffiti</h2>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  Graffiti on freight trains in the North American region can be studied from various perspectives: from the expansion of transnational circulation circuits and the consolidation of a long-distance messaging system to the curating processes through the analysis of local and international specialized magazines, and the symbolic production of graffiti writers involved in this community of practice.
                </p>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  Physically, graffiti on freight trains has a particular spread dynamic. Writers mark the sides of freight vehicles in &ldquo;yards,&rdquo; railway tracks used as garages, located on the outskirts of cities or rural areas where rail vehicles may wait for days or months before embarking on their journeys, which can be local, national, or transnational. It is in distant latitudes where other writers or benchers watch, evaluate, and document these interventions, forming a transnational circuit of New York tradition graffiti, both physical and digital.
                </p>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  However, in the socio-digital dimension, particularly in Instagram posts as materiality, several analyzable elements come together. Instagram is a user-generated content platform where content is organized using hypertextual tags (or hashtags). A graffiti writer may tag a photograph of their recently completed piece with their name <code>#kosm</code> and a community hashtag like <code>#freightgraffiti</code> with the intention of having other writers or graffiti enthusiasts view it. Benchers, on the other hand, primarily document interventions and may tag the writer <code>#mecrograffiti</code>, the location <code>#portlandbenching</code> where they documented the railway vehicle, and a communal tag like <code>#fr8porn</code>. Together, these practices generate networks of symbolic exchange, which through self-promotion by writers and retransmission by benchers, allow us to approach this phenomenon with symbolic elements, geographical references, and writer/crew entities that participants in this community of practice share and value collectively, driven by a core practice in contemporary graffiti: <em>getting up</em> (Castleman, 1980).
                </p>

                {/* Subsections 2.1, 2.2, 2.3 */}
                <div id="sec-2-1" className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h4 className="fw-bold text-primary mb-0">2.1 Data Collection Processes &amp; idmb Bot</h4>
                    <a href="https://github.com/abundis-rmn2/idmb" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm font-monospace fw-bold">
                      📦 GitHub Repo: idmb 🔗
                    </a>
                  </div>
                  <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                    The Data Collection Processes detailed herein delineate the systematic approach undertaken by the <em>Instagram Data Mining Bot</em> (<a href="https://github.com/abundis-rmn2/idmb" target="_blank" rel="noopener noreferrer" className="text-primary font-monospace fw-bold">idmb 🔗</a>) to extract and process data from Instagram&apos;s extensive user-generated data repository.
                  </p>
                  <Row className="g-3 my-2">
                    <Col md={6}>
                      <Card className="bg-light h-100 border">
                        <Card.Body>
                          <h6 className="fw-bold text-dark">🤖 2.1.1 idmb: A Harmless Mining Bot</h6>
                          <p className="small text-muted mb-0">
                            Interacts with Instagram&apos;s API via the open-source <code>Instagrapi</code> library (AdW0rd, 2022). Backs up user information (ID, username, follower counts), media content (images/videos), captions, and engagement metrics (likes, comments).
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="bg-light h-100 border">
                        <Card.Body>
                          <h6 className="fw-bold text-dark">🌱 2.1.2 Seed Node &amp; 2.1.3 Hashtag Iterator</h6>
                          <p className="small text-muted mb-0">
                            The seed node serves as the focal point for initiating collection (e.g. <code>#freightgraffiti</code>). The <code>hashtag_iterator()</code> recursively traverses top-liked posts and associated hashtags up to the specified mining depth.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Figure 1 Image Card */}
                  <Card className="my-4 border-0 shadow-sm overflow-hidden bg-dark text-white">
                    <img
                      src="/images/paper/image1.png"
                      alt="Figure 1: Instagram #FreightGraffiti screenshot"
                      className="img-fluid w-100"
                      style={{ maxHeight: '500px', objectFit: 'contain', backgroundColor: '#000' }}
                    />
                    <Card.Body className="p-3 text-center bg-dark border-top border-secondary">
                      <Badge bg="info" text="dark" className="mb-1">Figure 1</Badge>
                      <p className="small text-light mb-0">
                        Instagram #FreightGraffiti screenshot showing seed node exploration and post metadata mined by `idmb`.
                      </p>
                    </Card.Body>
                  </Card>

                  {/* Figure 2 & Figure 3 Cards */}
                  <Row className="g-3 my-3">
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <img
                          src="/images/paper/image5.png"
                          alt="Figure 2: Graph of #freightgraffiti (0 mining depth)"
                          className="img-fluid w-100 p-2"
                          style={{ maxHeight: '350px', objectFit: 'contain' }}
                        />
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="primary" className="mb-1">Figure 2</Badge>
                          <p className="small text-muted mb-0">
                            Graph of #freightgraffiti seed node at 0 mining depth downloading 3 top posts for each hashtag.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <img
                          src="/images/paper/image6.png"
                          alt="Figure 3: Graph of Freightgraffiti (1 mining depth)"
                          className="img-fluid w-100 p-2"
                          style={{ maxHeight: '350px', objectFit: 'contain' }}
                        />
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="primary" className="mb-1">Figure 3</Badge>
                          <p className="small text-muted mb-0">
                            Graph of #freightgraffiti with 1 mining depth showing network expansion across hashtags.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* Machine Learning Section */}
                <div id="sec-2-2" className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h4 className="fw-bold text-success mb-0">2.2 Application of Machine Learning Techniques (TensorFlow)</h4>
                    <a href="https://github.com/abundis-rmn2/Graffiti_Detection_OD_TensorFlow" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm font-monospace fw-bold">
                      📦 GitHub Repo: Graffiti_Detection_OD_TensorFlow 🔗
                    </a>
                  </div>
                  <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                    This work employs <code>TensorFlow</code> (Abadi, 2015) and <code>spaCy</code> (Honnibal, 2020) to infer significant symbolic content in Instagram posts. Object detection models categorize visual graffiti styles, connecting these inferences back to post and user nodes.
                  </p>
                  <Card className="bg-light border-success border-2 p-3 my-3">
                    <h6 className="fw-bold text-success mb-2">🎯 2.2.1 TensorFlow Object Detection (ResNet Architecture)</h6>
                    <p className="small text-dark mb-2">
                      Trained on a dataset of <strong>1,592 images</strong> manually labeled using <code>LabelImg</code> across 8 distinct categories:
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge bg="success">🏷️ Tag (660 images)</Badge>
                      <Badge bg="success">🎨 Character (320 images)</Badge>
                      <Badge bg="success">💣 Bomb (309 images)</Badge>
                      <Badge bg="success">✍️ Wildstyle (309 images)</Badge>
                      <Badge bg="success">🚂 Train Identifiers (s_tren - 116 images)</Badge>
                      <Badge bg="success">🖌️ Roller (115 images)</Badge>
                      <Badge bg="success">🧊 3D (67 images)</Badge>
                      <Badge bg="success">📜 Moniker (64 images)</Badge>
                    </div>
                  </Card>

                  {/* Figure 4 Image Card */}
                  <Card className="my-4 border-0 shadow-sm overflow-hidden bg-dark text-white">
                    <img
                      src="/images/paper/image12.png"
                      alt="Figure 4: TensorFlow custom model detection"
                      className="img-fluid w-100"
                      style={{ maxHeight: '550px', objectFit: 'contain', backgroundColor: '#000' }}
                    />
                    <Card.Body className="p-3 text-center bg-dark border-top border-secondary">
                      <Badge bg="success" className="mb-1">Figure 4</Badge>
                      <p className="small text-light mb-0">
                        Image processed with TensorFlow custom model identifying Wildstyle graffiti and &ldquo;Ferromex&rdquo; train identifier bounding boxes.
                      </p>
                    </Card.Body>
                  </Card>
                </div>

                {/* NLP Section */}
                <div id="sec-2-3" className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h4 className="fw-bold text-warning text-dark mb-0">2.3 Natural Language Processing (NLP) Analysis (spaCy)</h4>
                    <a href="https://github.com/abundis-rmn2/Hashtag_Custom_NER_spaCy" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm font-monospace fw-bold">
                      📦 GitHub Repo: Hashtag_Custom_NER_spaCy 🔗
                    </a>
                  </div>
                  <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                    Deconstructing complex hashtags (e.g. <code>#FreightTrainGraffiti</code>) using custom <code>spaCy</code> functions:
                  </p>
                  <ul className="text-secondary small" style={{ lineHeight: '1.8' }}>
                    <li>
                      <strong>2.3.1 Hashtag Splitter (<code>parsetag</code> &amp; <code>findword</code>):</strong> Strips the <code>#</code> character and segments concatenated tokens (e.g. <code>#BoxcarArtGraffiti</code> &rarr; <em>Boxcar</em>, <em>Art</em>, <em>Graffiti</em>) against comprehensive English and Spanish wordlists.
                    </li>
                    <li>
                      <strong>2.3.2 Graffiti Entity Recognition (<code>graffitientitieslookup</code> &amp; OoV):</strong> Identifies writer names and crew acronyms. Out-of-Vocabulary (OoV) heuristic classifies 2–4 character strings as <strong>crews</strong> and 5–8 character strings as <strong>writers</strong>.
                    </li>
                  </ul>

                  {/* Figure 5 Image Card */}
                  <Card className="my-3 border-0 shadow-sm overflow-hidden">
                    <img
                      src="/images/paper/image14.png"
                      alt="Figure 5: Image and text inferences linked to nodes"
                      className="img-fluid w-100 p-2"
                      style={{ maxHeight: '450px', objectFit: 'contain' }}
                    />
                    <Card.Body className="p-3 bg-light text-center border-top">
                      <Badge bg="warning" text="dark" className="mb-1">Figure 5</Badge>
                      <p className="small text-muted mb-0">
                        Example #freightgraffiti graph with image classification and spaCy text inferences linked to hashtag/post nodes.
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>

            {/* Section 3: Modeling and Interpretation */}
            <Card id="sec-3" className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">3. Modeling and Interpretation of Hypertextual Conversations</h2>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  Network graphs are generated from relational text databases using <code>Graphology</code> syntax (Plique, 2021). Node sizes reflect centrality metrics or Louvain community membership, while spatial positions are calculated via ForceAtlas2 layout algorithms.
                </p>

                {/* Subsections 3.1 */}
                <div id="sec-3-1" className="mt-4 pt-3 border-top">
                  <h4 className="fw-bold text-dark mb-3">3.1 Network Structure Layout &amp; JSON Schemas</h4>
                  <p className="text-secondary small mb-3">
                    The network structure is composed of three core node types: <strong>Users</strong>, <strong>Posts</strong>, and <strong>Hashtags</strong>, linked as <code>User &rarr; Post &rarr; Hashtag</code>, alongside inferential Machine Learning nodes:
                  </p>

                  {/* Figure 6 & Figure 7 Diagrams */}
                  <Row className="g-3 my-3">
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <img
                          src="/images/paper/image18.png"
                          alt="Figure 6: Basic graph morphology"
                          className="img-fluid w-100 p-2"
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="dark" className="mb-1">Figure 6</Badge>
                          <p className="small text-muted mb-0">
                            Basic graph morphology with mined attributes (IG Users &rarr; IG Posts &rarr; IG Hashtags).
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <img
                          src="/images/paper/image3.png"
                          alt="Figure 7: Inference graph morphology with edge direction"
                          className="img-fluid w-100 p-2"
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="dark" className="mb-1">Figure 7</Badge>
                          <p className="small text-muted mb-0">
                            Inference graph morphology showing edge direction for ML object labels, dictionaries, and entities.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                <div id="sec-3-2" className="mt-4 pt-3 border-top">
                  <h4 className="fw-bold text-dark mb-3">3.2 Clustering &amp; Polysemic Divergence</h4>
                  <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                    Hypertextual conversations frequently suffer from polysemy. For instance, the hashtag <code>#Kosm</code> (a renowned Mexican freight graffiti writer) produces three distinct Louvain clusters:
                  </p>
                  <Row className="g-3 my-2">
                    <Col md={4}>
                      <Badge bg="primary" className="w-100 p-2 text-start fs-6">
                        🔵 Freight Graffiti Cluster (@__kosm, @jrb1067)
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <Badge bg="danger" className="w-100 p-2 text-start fs-6">
                        🔴 Religious / Spiritual Cluster (&ldquo;Cosmos&rdquo;, @Kosm_World)
                      </Badge>
                    </Col>
                    <Col md={4}>
                      <Badge bg="success" className="w-100 p-2 text-start fs-6">
                        🟢 Polish Cosmetics Cluster (#Kosmetyce, @happyrabbit_blog)
                      </Badge>
                    </Col>
                  </Row>

                  {/* Figure 8 & Figure 9 Image Cards */}
                  <Row className="g-3 my-3">
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <div className="d-flex bg-white p-2">
                          <img src="/images/paper/image9.png" alt="Figure 8 Left" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                          <img src="/images/paper/image17.png" alt="Figure 8 Right" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                        </div>
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="dark" className="mb-1">Figure 8</Badge>
                          <p className="small text-muted mb-0">
                            Left: Initial CirclePack layout. Right: ForceAtlas2 spatial layout with Louvain community colors.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <div className="d-flex bg-white p-2">
                          <img src="/images/paper/image16.png" alt="Figure 9 Left" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                          <img src="/images/paper/image8.png" alt="Figure 9 Right" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                        </div>
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="dark" className="mb-1">Figure 9</Badge>
                          <p className="small text-muted mb-0">
                            Left: NeighborsNeighbors of #Kosm. Right: Zoomed graffiti subnetwork cluster.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                <div id="sec-3-3" className="mt-4 pt-3 border-top">
                  <h4 className="fw-bold text-dark mb-3">3.3 Node Size by Centrality Metrics</h4>
                  <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                    Graphology calculates essential metrics: <strong>Degree Centrality</strong> (number of connections), <strong>Betweenness Centrality</strong> (bridge/intermediary nodes), and <strong>PageRank</strong>. Centrality measures are normalized to maintain comparability across mining depths (depth 0 vs depth 1 &amp; 2).
                  </p>

                  {/* Figure 10 & Figure 11 Image Cards */}
                  <Row className="g-3 my-3">
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <div className="d-flex bg-white p-2">
                          <img src="/images/paper/image13.png" alt="Figure 10 Left" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                          <img src="/images/paper/image11.png" alt="Figure 10 Right" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                        </div>
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="dark" className="mb-1">Figure 10</Badge>
                          <p className="small text-muted mb-0">
                            Left: CirclePack layout with fixed node type size. Right: Node size defined by degree centrality.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm overflow-hidden">
                        <div className="d-flex bg-white p-2">
                          <img src="/images/paper/image2.png" alt="Figure 11 Left" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                          <img src="/images/paper/image4.png" alt="Figure 11 Right" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                        </div>
                        <Card.Body className="p-3 bg-light text-center border-top">
                          <Badge bg="dark" className="mb-1">Figure 11</Badge>
                          <p className="small text-muted mb-0">
                            Left: Node size by degree centrality. Right: Node size by betweenness centrality.
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>

            {/* Section 4: Node Reduction */}
            <Card id="sec-4" className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">4. Node Reduction Filter</h2>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  Inference reduction simplifies hyperconnected networks by eliminating intermediate post and hashtag nodes while preserving direct relationships between content authors, Machine Learning image inferences, and dictionary/entity terms.
                </p>

                {/* Reduction Stats Table */}
                <div className="table-responsive my-3">
                  <Table bordered hover size="sm" className="align-middle text-center font-monospace small">
                    <thead className="table-dark">
                      <tr>
                        <th>Stage</th>
                        <th>Total Nodes</th>
                        <th>Posts</th>
                        <th>Users</th>
                        <th>Hashtags</th>
                        <th>Text Words</th>
                        <th>Entities</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fw-bold text-danger">Before Inference Reduction</td>
                        <td>18,089</td>
                        <td>1,860</td>
                        <td>1,226</td>
                        <td>14,067</td>
                        <td>353</td>
                        <td>412</td>
                      </tr>
                      <tr className="table-success">
                        <td className="fw-bold text-success">After Inference Reduction</td>
                        <td>1,732</td>
                        <td className="text-muted">0 (Removed)</td>
                        <td>954</td>
                        <td className="text-muted">0 (Removed)</td>
                        <td>353</td>
                        <td>412</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                {/* Figure 13 Image Card */}
                <Card className="my-3 border-0 shadow-sm overflow-hidden">
                  <div className="d-flex bg-white p-2">
                    <img src="/images/paper/image10.png" alt="Figure 13 Left" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                    <img src="/images/paper/image7.png" alt="Figure 13 Right" className="w-50 img-fluid" style={{ objectFit: 'contain' }} />
                  </div>
                  <Card.Body className="p-3 bg-light text-center border-top">
                    <Badge bg="dark" className="mb-1">Figure 13</Badge>
                    <p className="small text-muted mb-0">
                      Left: Initial graph with 18,089 nodes. Right: Network after inference reduction (1,732 nodes).
                    </p>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>

            {/* Section 5: Tool Application in Three Examples */}
            <Card id="sec-5" className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">5. Tool Application in Three Examples</h2>

                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  The theoretical framework leverages Figueroa&apos;s (2014) triadic concept of self-announcement:
                </p>
                <div className="p-3 bg-light rounded border border-start border-4 border-primary mb-4">
                  <h6 className="fw-bold text-primary mb-2">🔺 Triad of Self-Announcement (Figueroa, 2014)</h6>
                  <ul className="mb-0 small text-dark">
                    <li><strong>Yo-soy (I am):</strong> Self-referential tagging of entities (e.g. <em>&ldquo;I am Kosm&rdquo;</em> via <code>#Kosm</code>).</li>
                    <li><strong>Yo-existo (I exist):</strong> Symbolic community integration through shared glossaries, styles, and hashtags.</li>
                    <li><strong>Yo-estuve-aquí (I was here):</strong> Conquering physical railcars and digital location tags across geographical nodes.</li>
                  </ul>
                </div>

                <div className="d-flex flex-column gap-4">
                  {/* Case 1 */}
                  <div className="p-3 bg-white rounded border shadow-sm">
                    <Badge bg="primary" className="mb-2">5.1 Case Study: #FreightGraffiti</Badge>
                    <h5 className="fw-bold text-dark">Communal Meeting Point (&gt;600,000 Posts)</h5>
                    <p className="small text-secondary mb-2">
                      Serves as a mandatory digital gathering space. Node reduction compressed 18,089 initial nodes into 1,732 core nodes, connecting 879 users directly with 257 terms from the graffiti glossary.
                    </p>
                    <p className="small text-muted mb-2">
                      <strong>Top Writers Identified:</strong> Mecri, Trio, Skaf, Powder, Mesy, Kois, Ernst. <strong>Crews:</strong> KOG, LTS, KGS, SWV, PUC.
                    </p>

                    {/* Figure 14 Card */}
                    <div className="bg-light p-2 rounded border mt-2">
                      <img src="/images/paper/image15.png" alt="Figure 14" className="img-fluid w-100" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                      <p className="small text-muted text-center mb-0 mt-1">
                        <strong>Figure 14:</strong> First neighbors of &ldquo;bomb&rdquo; term after inference reduction vs before reduction.
                      </p>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="p-3 bg-white rounded border shadow-sm">
                    <Badge bg="success" className="mb-2">5.2 Case Study: #Kosm</Badge>
                    <h5 className="fw-bold text-dark">Writer Autopromotion &amp; Polysemic Disambiguation</h5>
                    <p className="small text-secondary mb-2">
                      Demonstrates self-promotion (writer tagging own pieces) vs relay-transmission (benchers broadcasting writer pieces as &ldquo;He-was-here&rdquo;). Filter reduced initial 510 users to 266 relevant participants.
                    </p>
                    <p className="small text-muted mb-0">
                      <strong>Top Benched Freight Writers:</strong> Ichabod (19 records), Mecro (13), Visah (12), Renik (11), Aser (10).
                    </p>
                  </div>

                  {/* Case 3 */}
                  <div className="p-3 bg-white rounded border shadow-sm">
                    <Badge bg="info" text="dark" className="mb-2">5.3 Case Study: #PortlandBench</Badge>
                    <h5 className="fw-bold text-dark">Geographically Anchored Locality (33 North American Cities)</h5>
                    <p className="small text-secondary mb-2">
                      Examines local benching networks within a broader transnational circuit. Identified 9 key benchers (including <code>@pacificnorthbench</code>, <code>@oddiophoto</code>, <code>@micah_hawaii</code>), 5 graffiti styles, and 26 writer/crew entities (VRS, ATD, 925, CFS).
                    </p>
                    <p className="small text-muted mb-0">
                      <strong>North American Rail Hubs Mined:</strong> Portland, Norfolk, Chicago, Seattle, Minneapolis, Winnipeg, Riverside, Atlanta, Philadelphia, Oakland, Vancouver, Oaxaca.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Section 6: Conclusion */}
            <Card id="sec-conclusion" className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-dark border-bottom pb-2 mb-3">6. Conclusion</h2>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  In summary, this paper has shown how computational techniques can help us understand conversations on Instagram, especially among freight train graffiti writers and benchers. We used machine learning and computational methods to back up and actually visualize how freight graffiti writers and benchers interact online. We simplified the network by reducing the number of nodes and links, making it easier to analyze. The process of node reduction has proved instrumental in simplifying the network structure, facilitating closer connections between nodes while enhancing analysis efficiency.
                </p>
                <p className="fs-6 text-secondary" style={{ lineHeight: '1.8' }}>
                  By addressing the challenge of polysemy, exemplified by the case of Kosm, our study has advanced thematic precision within network analysis. This strategic filtering approach ensures that our focus remains on genuinely relevant users and content, contributing to a more refined understanding of community dynamics. After simplifying the network, we found it easier to see connections between users and the symbolic content they share.
                </p>
              </Card.Body>
            </Card>

            {/* Section 7: References */}
            <Card id="sec-references" className="shadow-sm border-0 mb-4 bg-dark text-white">
              <Card.Body className="p-4">
                <h3 className="fw-bold text-info border-bottom border-secondary pb-2 mb-3">7. References</h3>
                <ul className="list-unstyled font-monospace small mb-0 d-flex flex-column gap-2" style={{ fontSize: '0.83rem', lineHeight: '1.6' }}>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Abadi, M., Agarwal, A., Barham, P., Brevdo, E., Chen, Z., Citro, C., &amp; Zheng, X. (2015). <em>TensorFlow: Large-Scale Machine Learning on Heterogeneous Systems.</em>
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Adams, A., &amp; Brown, B. (2012). Normalization techniques for network centrality measures. <em>Journal of Network Analysis</em>, 8(3), 123-135.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Castleman, C. (1980). <em>Getting Up: Subway Graffiti in New York.</em> MIT Press.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Figueroa, F. (2014). <em>El grafiti de firma: un recorrido histórico-social por el grafiti de ayer y hoy.</em> Minobitia.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Gomez-Cruz, E. (2022). <em>Technologies of Visibility: Visual Culture and Social Media.</em> Routledge.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Hepp, A. (2020). <em>Deep Datafication: The Automated Construction of Social Reality.</em> Polity Press.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Honnibal, M., Montani, I., Van Landeghem, S., &amp; Boyd, A. (2020). <em>spaCy: Industrial-strength Natural Language Processing in Python.</em> doi: 10.5281/zenodo.1212303
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Jacomy, M., Venturini, T., Heymann, S., &amp; Bastian, M. (2014). ForceAtlas2, a Continuous Graph Layout Algorithm for Handy Network Visualization Designed for the Gephi Software. <em>PLoS ONE</em>, 9(6), e98679. doi:10.1371/journal.pone.0098679
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Johnson, R., Smith, T., &amp; Davis, M. (2015). Exploring betweenness centrality in social networks. <em>Social Network Analysis</em>, 15(2), 45-58.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Moreno, J. (1934). <em>Who Shall Survive? A New Approach to the Problem of Human Interrelations.</em> Nervous and Mental Disease Publishing Co.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Page, L., &amp; Brin, S. (1998). <em>The PageRank citation ranking: Bringing order to the web.</em> Stanford InfoLab.
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Plique, G. (2021). <em>Graphology, a robust and multipurpose Graph object for JavaScript.</em> Zenodo. doi:10.5281/zenodo.5681257
                  </li>
                  <li className="p-2 bg-black bg-opacity-50 rounded border border-secondary">
                    Smith, J., &amp; Jones, R. (2010). Understanding degree centrality in network analysis. <em>Journal of Computational Sociology</em>, 5(1), 32-45.
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
