function Footer() {
  return (
    <footer className="footer" id="kontakti">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>📚 Ebibloteka</h3>
            <p>Biblioteka "Azem Shkreli" Pejë</p>
            <p>Transformimi digjital i shërbimeve bibliotekare</p>
          </div>

          <div className="footer-section">
            <h3>Linqe të Shpejta</h3>
            <ul className="footer-links">
              <li>
                <a href="#ballina">Ballina</a>
              </li>
              <li>
                <a href="#vecorite">Veçoritë</a>
              </li>
              <li>
                <a href="#rreth">Rreth Nesh</a>
              </li>
              <li>
                <a href="#kontakti">Kontakti</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Kontakti</h3>
            <p>📍 Rruga Mbretëresha Teutë, Pejë</p>
            <p>📞 +383 39 123 456</p>
            <p>✉️ info@ebibloteka-peja.com</p>
          </div>

          <div className="footer-section">
            <h3>Orari i Punës</h3>
            <p>E Hënë - E Premte: 08:00 - 20:00</p>
            <p>E Shtunë: 09:00 - 16:00</p>
            <p>E Diel: Mbyllur</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Ebibloteka - Biblioteka "Azem Shkreli". Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
