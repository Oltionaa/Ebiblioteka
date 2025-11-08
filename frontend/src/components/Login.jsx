"use client"

import { useState } from "react"
import "../styles/auth.css";


function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login:", { email, password })
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Kyçu në llogarinë tënde</h2>

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
  )
}

export default Login
