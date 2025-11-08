import heroImg from "../assets/hero.jpg";



function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
         <h1>Bibloteka "Azem Shkreli" Peje</h1>
        <h1>Biblioteka Juaj Dixhitale në Dispozicion</h1>
        <p>
          Ebiblioteka është platforma moderne për menaxhimin e librave dhe
          shërbimeve bibliotekare. Kërkoni, rezervoni dhe lexoni libra me vetëm
          disa klikime.
        </p>
        <button className="btn-primary">Regjistrohu</button>
      </div>

      <div className="hero-image">
        <img src={heroImg} alt="Biblioteka" />
      </div>
    </section>
  );
}

export default Hero;