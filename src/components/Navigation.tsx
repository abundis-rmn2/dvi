'use client';

import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Link from 'next/link';

export const Navigation: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold d-flex align-items-center gap-2">
          <span>DVI — Freight Graffiti Research</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="/">
              🏠 Home (Intro)
            </Nav.Link>
            <Nav.Link as={Link} href="/methodology">
              📘 Methodology Paper
            </Nav.Link>
            <Nav.Link as={Link} href="/hashtags">
              📊 Data Mining Tasks & Hashtags (/hashtags)
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
