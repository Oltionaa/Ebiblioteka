import { Link } from "react-router-dom";
import "../styles/style.css";

function Header() {
  const roli = localStorage.getItem("roli"); 
  const isLoggedIn = localStorage.getItem("user") !== null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="header-content">

        {/* LOGO */}
        <Link to="/" className="logo">
          📚 EbibloteKa
        </Link>

        {/* NAV LINKS */}
        <nav className="nav">
          <Link to="/">Ballina</Link>
          <Link to="/features">Veçoritë</Link>
          <Link to="/about">Rreth Nesh</Link>
          <Link to="/contact">Kontakti</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="header-actions">

          {/* NËSE ËSHTË I KYÇUR */}
          {isLoggedIn ? (
            <>
              {/* PROFILI VETËM PËR BIBLIOTEKAR */}
              {roli === "Bibliotekar" && (
                <Link to="/dashboard-bibliotekar" className="btn btn-primary">
                  👤 Profili im
                </Link>
              )}

              {/* LOGOUT – I KALTËR SI REGJISTROHU */}
              <button onClick={handleLogout} className="btn btn-primary">
                Dil
              </button>
            </>
          ) : (
            <>
              {/* USER NORMAL */}
              <Link to="/login" className="btn btn-outline">Kyçu</Link>
              <Link to="/signup" className="btn btn-primary">Regjistrohu</Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Header;
