import "../styles/aboutus.css";

function AboutUs() {
  return (
    <section className="about" id="rreth">
      <div className="container">

        <div className="section-header">
          <h2>Historia e Bibliotekës “Azem Shkreli”</h2>
          <p>
            Nga rrënjët tradicionale te transformimi modern digjital — rrugëtimi i një institucioni kulturor.
          </p>
        </div>

        <div className="history-image">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80" 
            alt="Biblioteka Azem Shkreli"
          />
        </div>

        <div className="history-box">

          <p>
            Biblioteka “Azem Shkreli” në Pejë, e themeluar në vitin <b>1952</b>, për dekada me radhë ka qenë 
            një ndër institucionet kulturore më të rëndësishme të rajonit. Ajo ka shërbyer si një vatër 
            e dijes dhe edukimit, ku breza të tërë studentësh, studiuesish dhe lexuesish janë frymëzuar 
            dhe kanë gjetur qasje në një koleksion të pasur librash, dorëshkrimesh dhe botimesh të 
            çmuara të letërsisë vendore dhe asaj botërore.
          </p>

          <p>
            Me kalimin e viteve, biblioteka jo vetëm që ka rritur fondin e saj, por edhe ka zgjeruar 
            misionin — duke u bërë hapësirë sociale, edukative dhe shkencore, ku janë mbajtur aktivitete 
            letrare, takime me autorë, punëtori kulturore dhe programe edukative për të rinjtë. 
            Për shumë qytetarë, biblioteka ka qenë jo vetëm vend i librave, por vend i përkatësisë 
            dhe komunitetit.
          </p>

          <div className="history-image">
            <img 
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80" 
              alt="Rafte librash"
            />
          </div>

          <p>
            Me zhvillimin e teknologjisë dhe rritjen e nevojës për qasje të shpejtë në materiale 
            bibliotekare, lindi ideja për një hap të ri madhor — transformimi digjital i bibliotekës. 
            Kështu filloi krijimi i platformës <b>Ebibloteka</b>, një sistem që mundëson kërkim online, 
            rezervime të librave, njoftime automatike, menaxhim të huazimeve dhe një historik të plotë 
            personal të leximeve.
          </p>

          <p>
            Qëllimi i platformës është të ofrojë një shërbim modern që i përgjigjet ritmit të sotëm 
            të jetës: qasje 24/7 në katalogun e librave, informacione të azhurnuara në kohë reale, 
            komunikim të lehtë me stafin dhe një përvojë të thjeshtë për çdo kategori përdoruesi.
          </p>

          <p>
            Për bibliotekarët, kjo platformë ka sjellë lehtësi të jashtëzakonshme, duke 
            minimizuar punën manuale, gabimet dhe vonesat. Për administratorët, ka hapur 
            mundësi të reja për raportim, statistika dhe kontroll të plotë të sistemit.
          </p>

          <p>
            Sot, Biblioteka “Azem Shkreli” është në fazën e modernizimit të plotë. 
            Integrimi i platformës Ebibloteka shënon një hap të rëndësishëm drejt së ardhmes, 
            duke e bërë bibliotekën më të qasshme, më efikase dhe më të afërt me nevojat e 
            lexuesve të gjeneratave të reja — të cilët kërkojnë shërbime digjitale, të shpejta 
            dhe funksionale.
          </p>

        </div>
      </div>
    </section>
  );
}

export default AboutUs;
