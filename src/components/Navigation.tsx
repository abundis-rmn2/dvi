import React from 'react';
import Link from 'next/link';

export const Navigation: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span>DVI — Freight Graffiti Research</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-navbar-nav"
          aria-controls="main-navbar-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="main-navbar-nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                🏠 Home (Intro)
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/methodology" className="nav-link">
                📘 Methodology Paper
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/hashtags" className="nav-link">
                📊 Data Mining Tasks &amp; Hashtags (/hashtags)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
