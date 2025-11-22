import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <h2>Gati për të Filluar?</h2>
          <p>
            Bashkohu me mijëra lexues që përdorin Ebiblotekën çdo ditë. Regjistrohu falas dhe fillo të kërkosh librat e
            tua të preferuar.
          </p>
          <Link to="/signup" className="btn btn-white btn-lg">
            Regjistrohu Tani
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA