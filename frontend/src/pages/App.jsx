import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./presentation/pages/HomePage"

function App() {
  return (
    <Router>
      <Routes>
        {/* Faqja kryesore - Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Mund të shtosh faqe të tjera këtu */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App
