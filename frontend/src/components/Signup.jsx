"use client"

import { useState } from "react"
import "../styles/auth.css";

function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Fjalëkalimet nuk përputhen!")
      return
    }
    setError("")
    console.log("Sign Up:", { email, password })
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Krijo llogarinë tënde</h2>

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
  )
}

export default SignUp
