import { Link } from "react-router-dom";
import "../styles/style.css";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roli = user?.roli || null;
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="header-content">

        <Link to="/" className="logo">
          📚 Ebibloteka
        </Link>

        <nav className="nav">
          <Link to="/">Ballina</Link>
          <Link to="/features">Veçoritë</Link>
          <Link to="/about">Rreth Nesh</Link>
          <Link to="/contact">Kontakti</Link>
        </nav>

        <div className="header-actions">

          {isLoggedIn ? (
            <>
              {roli === "Admin" && (
                <Link to="/admin" className="btn btn-green">
                  Admin Panel
                </Link>
              )}

              {roli === "Bibliotekar" && (
                <Link to="/dashboard-bibliotekar" className="btn btn-blue">
                  👤 Profili im
                </Link>
              )}

              {(roli === "Perdorues") && (
                <Link to="/dashboard" className="btn btn-blue">
                  👤 Profili im
                </Link>
              )}

              <button onClick={handleLogout} className="btn btn-red">
                Dil
              </button>
            </>
          ) : (
            <>
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
