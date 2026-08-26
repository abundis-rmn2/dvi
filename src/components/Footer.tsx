'use client';

import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';

export function Footer() {
  const thesisUrl =
    'https://www.abundis.com.mx/en/thesis/visualization-of-a-hypertextual-interaction-field-in-the-form-of-a-network-graph-using-computational-processes-case-study-graffiti-on-freight-trains-in-north-america';

  return (
    <footer className="bg-dark text-light border-top border-secondary pt-5 pb-4 mt-5">
      <Container>
        <Row className="gy-4 mb-4">
          <Col lg={7}>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <Badge bg="primary" className="px-2 py-1">🎓 Research Project</Badge>
              <Badge bg="outline-light" className="border text-light px-2 py-1">Universidad de Guadalajara</Badge>
              <Badge bg="info" className="px-2 py-1 text-dark">Master in Communication Studies, 2024</Badge>
            </div>

            <h5 className="fw-bold text-white mb-2">
              <a
                href={thesisUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none hover-underline"
                style={{ lineHeight: '1.4' }}
              >
                Visualization of a Hypertextual Interaction Field in Network Form Using Computational Processes. Case Study: Freight Train Graffiti in North America 🔗
              </a>
            </h5>

            <p className="text-white-50 small mb-3">
              Developed by <strong>A. J. Ramírez Abundis</strong>
            </p>

            <div className="d-flex flex-wrap gap-2 mb-3">
              <Badge bg="secondary">🔍 Researcher</Badge>
              <Badge bg="secondary">🌐 Ethnography</Badge>
              <a href="https://github.com/abundis-rmn2/idmb" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                <Badge bg="secondary" className="hover-opacity">🐍 idmb Mining Bot 🔗</Badge>
              </a>
              <a href="https://github.com/abundis-rmn2/Graffiti_Detection_OD_TensorFlow" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                <Badge bg="secondary" className="hover-opacity">👁️ ML Vision (ResNet) 🔗</Badge>
              </a>
              <a href="https://github.com/abundis-rmn2/Hashtag_Custom_NER_spaCy" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                <Badge bg="secondary" className="hover-opacity">🔤 spaCy Custom NER 🔗</Badge>
              </a>
              <a href="https://github.com/abundis-rmn2/dvi" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                <Badge bg="secondary" className="hover-opacity">⚛️ DVI Web Interface 🔗</Badge>
              </a>
            </div>

            <p className="text-light small mb-2" style={{ lineHeight: '1.6' }}>
              Master&apos;s Thesis in Communication Studies at Universidad de Guadalajara. This pioneering study explored the subcultural phenomenon of freight train graffiti and the structuring of a hidden transnational community of practice along North American railway tracks.
            </p>

            <p className="text-white-50 small mb-0" style={{ lineHeight: '1.6' }}>
              Methodologically, field and digital ethnography were combined with automated Instagram hashtag data mining through the development of the <a href="https://github.com/abundis-rmn2/idmb" target="_blank" rel="noopener noreferrer" className="text-info font-monospace text-decoration-none fw-bold">idmb bot 🔗</a>. Hypertextual interaction metadata was modeled in complex network graphs using ForceAtlas layouts with SigmaJS and Graphology to analyze style propagation and recognition flows. Additionally, a CNN classifier (<a href="https://github.com/abundis-rmn2/Graffiti_Detection_OD_TensorFlow" target="_blank" rel="noopener noreferrer" className="text-info text-decoration-none fw-bold">ResNet 🔗</a>) was trained to recognize graffiti styles (monikers, tags, throw-ups). The conceptual framework integrated Jenkins&apos; participatory culture and Thompson&apos;s social mediation theories.
            </p>
          </Col>

          <Col lg={5}>
            <div className="bg-black bg-opacity-50 p-3 rounded border border-secondary h-100 d-flex flex-column justify-content-between">
              <div>
                <h6 className="text-uppercase text-muted fw-bold mb-2 font-monospace" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
                  📖 APA Citation
                </h6>
                <blockquote className="blockquote text-light font-monospace small mb-3 p-2 bg-dark rounded border border-secondary" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Ramírez Abundis, A. J. (2024). <em>Visualization of a Hypertextual Interaction Field in Network Form Using Computational Processes. Case Study: Freight Train Graffiti in North America</em> (Master&apos;s thesis). Universidad de Guadalajara, Mexico.
                </blockquote>
              </div>

              <div>
                <a
                  href={thesisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
                >
                  <span>🌐 Read Full Thesis at abundis.com.mx</span>
                </a>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-3" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <small className="text-white-50">
              &copy; {new Date().getFullYear()} DVI - Data Visualization Interface | Developed by Javier Abundis
            </small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <a
              href="https://www.abundis.com.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-info text-decoration-none small fw-bold"
            >
              abundis.com.mx
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
