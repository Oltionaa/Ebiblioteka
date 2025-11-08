"use client"

import { useState } from "react"

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="#" className="logo">
            📚 Ebibloteka
          </a>

          <nav className="nav">
            <a href="#ballina">Ballina</a>
            <a href="#vecorite">Veçoritë</a>
            <a href="#rreth">Rreth Nesh</a>
            <a href="#kontakti">Kontakti</a>
          </nav>

          <div className="header-actions">
            <button className="btn btn-outline">Kyçu</button>
            <button className="btn btn-primary">Regjistrohu</button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header