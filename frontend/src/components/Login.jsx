import { useState } from "react";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fjalekalimi: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Ruaj user-in e kyçur
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("roli", data.user.roli);  // p.sh Bibliotekar ose User
      localStorage.setItem("emri", data.user.emri);

      alert("Kyçu me sukses!");
      window.location.href = "/";

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Kyçu në llogarinë tënde</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Fjalëkalimi"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button">
            Kyçu
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
