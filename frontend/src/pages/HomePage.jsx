import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import AllBooks from "../components/AllBooks"; 

function HomePage() {
  return (
    <div className="homepage">
      <Header />
      <Hero />
      <section id="all-books" style={{ padding: "40px 0", backgroundColor: "#f7f7f7" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Të gjithë librat në dispozicion</h2>
        <AllBooks /> 
      </section>

      <About />
      <CTA />
      <Footer />
    </div>
  );
}

export default HomePage;
