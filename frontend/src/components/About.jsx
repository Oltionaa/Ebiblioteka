import { useState } from "react";
import "../styles/about.css"; 

function About() {
  const roles = [
    {
      icon: "👤",
      title: "Për Lexuesit",
      short: "Përvojë moderne leximi dhe rezervimi librash, krejt online.",
      features: [
        "Regjistrim dhe qasje e lehtë në platformë",
        "Kërkim dhe rezervim i librave online",
        "Historik i plotë i leximeve",
        "Rekomandime të personalizuara",
        "Njoftime për afatet dhe librat e rinj",
      ],
    },
    {
      icon: "👨‍💼",
      title: "Për Bibliotekarët",
      short: "Menaxhim i lehtë i stokut, huazimeve dhe rezervimeve.",
      features: [
        "Menaxhim i plotë i librave dhe stokut",
        "Miratim dhe menaxhim i rezervimeve",
        "Monitorim i huazimeve dhe kthimeve",
        "Dërgim i njoftimeve për përdoruesit",
        "Raporte dhe statistika detajuese",
      ],
    },
    {
      icon: "⚙️",
      title: "Për Administratorët",
      short: "Kontroll i plotë mbi sistemin dhe sigurinë e tij.",
      features: [
        "Menaxhim i llogarive të përdoruesve",
        "Kontroll i plotë mbi sistemin",
        "Gjenerim i raporteve të avancuara",
        "Zgjidhje e problemeve teknike",
        "Monitorim i performancës së sistemit",
      ],
    },
  ];

  const [active, setActive] = useState(null);

  const toggleCard = (index) => {
    setActive((prev) => (prev === index ? null : index));
  };

  return (
    <section className="about" id="rreth">
      <div className="container">
        <div className="section-header">
          <h2>Rreth Platformës</h2>
          <p>Ebibloteka ofron zgjidhje moderne për të gjithë përdoruesit e bibliotekës</p>
        </div>

        <div className="roles-grid flip-layout">
          {roles.map((role, index) => (
            <div
              key={index}
              className={`role-card flip-card ${active === index ? "is-flipped" : ""}`}
              onClick={() => toggleCard(index)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-face flip-card-front">
                  <div className="role-icon">{role.icon}</div>
                  <h3>{role.title}</h3>
                  <p className="role-short">{role.short}</p>
                  <button className="flip-btn">Shiko më shumë</button>
                </div>

                <div className="flip-card-face flip-card-back">
                  <h3>{role.title}</h3>
                  <ul>
                    {role.features.map((feature, fIndex) => (
                      <li key={fIndex}>{feature}</li>
                    ))}
                  </ul>
                  <button className="flip-btn back-btn">Mbylle kartën</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="about-hint">
          Kliko mbi një kartë për të parë më shumë detaje për secilin rol 👆
        </p>
      </div>
    </section>
  );
}

export default About;
