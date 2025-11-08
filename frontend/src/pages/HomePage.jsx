import Header from "../components/Header"
import Hero from "../components/Hero"
import Features from "../components/Features"
import About from "../components/About"
import CTA from "../components/CTA"
import Footer from "../components/Footer"

function HomePage() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Features />
      <About />
      <CTA />
      <Footer />
    </div>
  )
}

export default HomePage