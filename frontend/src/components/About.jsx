function About() {
  const roles = [
    {
      icon: "👤",
      title: "Për Lexuesit",
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
      features: [
        "Menaxhim i llogarive të përdoruesve",
        "Kontroll i plotë mbi sistemin",
        "Gjenerim i raporteve të avancuara",
        "Zgjidhje e problemeve teknike",
        "Monitorim i performancës së sistemit",
      ],
    },
  ]

  return (
    <section className="about" id="rreth">
      <div className="container">
        <div className="section-header">
          <h2>Rreth Platformës</h2>
          <p>Ebibloteka ofron zgjidhje moderne për të gjithë përdoruesit e bibliotekës</p>
        </div>

        <div className="roles-grid">
          {roles.map((role, index) => (
            <div key={index} className="role-card">
              <div className="role-icon">{role.icon}</div>
              <h3>{role.title}</h3>
              <ul>
                {role.features.map((feature, fIndex) => (
                  <li key={fIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About