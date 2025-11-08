function Features() {
  const features = [
    {
      icon: "🔍",
      title: "Kërkim i Avancuar",
      description: "Gjej librat e dëshiruar lehtë dhe shpejt sipas titullit, autorit, kategorisë ose fjalëve kyçe.",
    },
    {
      icon: "📖",
      title: "Rezervime Online",
      description: "Rezervo librat që dëshiron dhe merr njoftim automatik kur janë të gatshëm për huazim.",
    },
    {
      icon: "📊",
      title: "Historiku Personal",
      description: "Shiko të gjithë historikun e leximeve dhe mbaj evidencën e librave të lexuar.",
    },
    {
      icon: "🔔",
      title: "Njoftime Automatike",
      description: "Merr njoftim për afatet e kthimit, librat e rinj dhe rekomandimet e personalizuara.",
    },
    {
      icon: "💡",
      title: "Rekomandime Inteligjente",
      description: "Merr sugjerime të personalizuara bazuar në preferencat dhe historikun tënd të leximit.",
    },
    {
      icon: "🔒",
      title: "Siguri e Lartë",
      description: "Të dhënat e tua janë të mbrojtura me enkriptim dhe mekanizma të avancuar sigurie.",
    },
  ]

  return (
    <section className="features" id="vecorite">
      <div className="container">
        <div className="section-header">
          <h2>Veçoritë Kryesore</h2>
          <p>Zbulo çfarë mundëson platforma jonë për ty</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
