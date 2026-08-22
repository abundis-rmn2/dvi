'use client';

import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Link from 'next/link';

export const Navigation: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold">
          DVI - Data Visualization Interface
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};
