"use client";

import { useState } from "react";
import "../styles/auth.css";

function SignUp() {
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Fjalëkalimet nuk përputhen!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emri, mbiemri, email, fjalekalimi: password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert("Regjistrimi u krye me sukses!");

      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Krijo llogarinë tënde</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Emri"
            className="auth-input"
            value={emri}
            onChange={(e) => setEmri(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Mbiemri"
            className="auth-input"
            value={mbiemri}
            onChange={(e) => setMbiemri(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Konfirmo fjalëkalimin"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">
            Regjistrohu
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;