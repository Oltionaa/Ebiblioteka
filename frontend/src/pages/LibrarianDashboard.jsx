import { useEffect, useState } from "react";
import "../styles/dashboardBibliotekar.css";

function LibrarianDashboard() {
  const [libra, setLibra] = useState([]);
  const [rezervime, setRezervime] = useState([]);
  const [activeTab, setActiveTab] = useState("libra");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadLibra();
    loadRezervime();
  }, []);

  // ===================== LOAD LIBRA =====================
  const loadLibra = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libra");
      const data = await res.json();
      setLibra(data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së librave:", err);
    }
  };

  // ===================== LOAD REZERVIME =====================
  const loadRezervime = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rezervime/admin");
      const data = await res.json();
      setRezervime(data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së rezervimeve:", err);
    }
  };

  // ===================== EDIT LIBËR =====================
  const startEdit = (libri) => setEditData(libri);

  const saveEdit = async () => {
    try {
      await fetch(`http://localhost:5000/api/libra/edit/${editData.id_liber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      setEditData(null);
      loadLibra();
    } catch (err) {
      console.error("Gabim gjatë editimit:", err);
    }
  };

  // ===================== FSHI LIBËR =====================
  const fshiLiber = async (id) => {
    if (!window.confirm("A dëshiron ta fshish librin?")) return;

    try {
      await fetch(`http://localhost:5000/api/libra/fshi/${id}`, {
        method: "DELETE",
      });

      loadLibra();
    } catch (err) {
      console.error("Gabim gjatë fshirjes:", err);
    }
  };

  // ===================== MIRATO / REFUZO =====================
  const mirato = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/rezervime/mirato/${id}`, {
        method: "PUT",
      });
      loadRezervime();
    } catch (err) {
      console.error("Gabim gjatë miratimit:", err);
    }
  };

  const refuzo = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/rezervime/refuzo/${id}`, {
        method: "PUT",
      });
      loadRezervime();
    } catch (err) {
      console.error("Gabim gjatë refuzimit:", err);
    }
  };

  // ===================== FORMATIMI I DATAVE =====================
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="admin-container">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>📚 Bibliotekari</h2>

        <button 
          className={activeTab === "libra" ? "active" : ""}
          onClick={() => setActiveTab("libra")}
        >
          📘 Librat
        </button>

        <button 
          className={activeTab === "rezervime" ? "active" : ""}
          onClick={() => setActiveTab("rezervime")}
        >
          📝 Rezervimet
        </button>
      </aside>

      <main className="content">

        {/* MODALI PËR EDITIM */}
        {editData && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edito Librin</h3>

              <input
                type="text"
                value={editData.titulli}
                onChange={(e) =>
                  setEditData({ ...editData, titulli: e.target.value })
                }
                placeholder="Titulli"
              />

              <input
                type="text"
                value={editData.autori}
                onChange={(e) =>
                  setEditData({ ...editData, autori: e.target.value })
                }
                placeholder="Autori"
              />

              <input
                type="number"
                value={editData.vitiBotimit}
                onChange={(e) =>
                  setEditData({ ...editData, vitiBotimit: e.target.value })
                }
                placeholder="Viti i botimit"
              />

              <input
                type="text"
                value={editData.foto || ""}
                onChange={(e) =>
                  setEditData({ ...editData, foto: e.target.value })
                }
                placeholder="Foto URL"
              />

              <button onClick={saveEdit}>Ruaj Ndryshimet</button>
              <button className="cancel-btn" onClick={() => setEditData(null)}>
                Anulo
              </button>
            </div>
          </div>
        )}

        {/* ================= LIBRAT ================= */}
        {activeTab === "libra" && (
          <section>
            <h1>📘 Librat në Sistem</h1>

            <table>
              <thead>
                <tr>
                  <th>Titulli</th>
                  <th>Autori</th>
                  <th>Kopje Totale</th>
                  <th>Kopje të Lira</th>
                  <th>Veprime</th>
                </tr>
              </thead>

              <tbody>
                {libra.map((l) => (
                  <tr key={l.id_liber}>
                    <td>{l.titulli}</td>
                    <td>{l.autori}</td>
                    <td>{l.total_kopje}</td>
                    <td>{l.kopje_lira}</td>

                    <td>
                      <button onClick={() => startEdit(l)}>Edito</button>
                      <button onClick={() => fshiLiber(l.id_liber)}>Fshi</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ================= REZERVIMET ================= */}
        {activeTab === "rezervime" && (
          <section>
            <h1>📝 Rezervimet e Pritura</h1>

            <table>
              <thead>
                <tr>
                  <th>Libri</th>
                  <th>Përdoruesi</th>
                  <th>Data Rezervimit</th>
                  <th>Data e kërkuar</th>
                  <th>Statusi</th>
                  <th>Veprime</th>
                </tr>
              </thead>

              <tbody>
                {rezervime.map((r) => (
                  <tr key={r.id_rezervimi}>
                    <td>{r.titulli}</td>
                    <td>{r.emri_perdoruesit}</td>
                    <td>{formatDate(r.dataRezervimit)}</td>
                    <td>{formatDate(r.dataRezervuar)}</td>
                    <td>{r.statusi}</td>

                    <td>
                      <button onClick={() => mirato(r.id_rezervimi)}>Mirato</button>
                      <button onClick={() => refuzo(r.id_rezervimi)}>Refuzo</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}

export default LibrarianDashboard;
