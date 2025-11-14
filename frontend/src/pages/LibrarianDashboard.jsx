import { useEffect, useState } from "react";
import "../styles/dashboardBibliotekar.css";

function LibrarianDashboard() {
  const [libra, setLibra] = useState([]);
  const [rezervime, setRezervime] = useState([]);
  const [activeTab, setActiveTab] = useState("libra");
  const [editData, setEditData] = useState(null);

  const [newBook, setNewBook] = useState({
    titulli: "",
    autori: "",
    vitiBotimit: "",
    foto: "",
    sasia: "",
  });

  useEffect(() => {
    loadLibra();
    loadRezervime();
  }, []);

  const loadLibra = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libra");
      const data = await res.json();
      setLibra(data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së librave:", err);
    }
  };

  const loadRezervime = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rezervime/admin");
      const data = await res.json();
      setRezervime(data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së rezervimeve:", err);
    }
  };

  const startEdit = (libri) => setEditData(libri);

  const saveEdit = async () => {
    try {
      await fetch(`http://localhost:5000/api/libra/edit/${editData.id_liber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editData,
          vitiBotimit: Number(editData.vitiBotimit),
          sasia: Number(editData.sasia),
        }),
      });

      setEditData(null);
      loadLibra();
    } catch (err) {
      console.error("Gabim gjatë editimit:", err);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const shtoLiber = async () => {
    try {
      const dataToSend = {
        titulli: newBook.titulli,
        autori: newBook.autori,
        vitiBotimit: Number(newBook.vitiBotimit),
        foto: newBook.foto,
        sasia: Number(newBook.sasia),
      };

      await fetch("http://localhost:5000/api/libra/shto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      alert("Libri u shtua me sukses!");

      setNewBook({ titulli: "", autori: "", vitiBotimit: "", foto: "", sasia: "" });
      setActiveTab("libra");
      loadLibra();
    } catch (err) {
      console.error("Gabim gjatë shtimit të librit:", err);
    }
  };

  return (
    <div className="admin-container">
      
      <aside className="sidebar">
        <h2>📚 Bibliotekari</h2>

        <button className={activeTab === "libra" ? "active" : ""} onClick={() => setActiveTab("libra")}>
          📘 Librat
        </button>

        <button className={activeTab === "rezervime" ? "active" : ""} onClick={() => setActiveTab("rezervime")}>
          📝 Rezervimet
        </button>

        <button className={activeTab === "shto" ? "active" : ""} onClick={() => setActiveTab("shto")}>
          ➕ Shto Liber
        </button>
      </aside>

      <main className="content">

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

        {editData && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edito Librin</h3>

              <input type="text" value={editData.titulli} onChange={(e) => setEditData({ ...editData, titulli: e.target.value })} />
              <input type="text" value={editData.autori} onChange={(e) => setEditData({ ...editData, autori: e.target.value })} />
              <input type="number" value={editData.vitiBotimit} onChange={(e) => setEditData({ ...editData, vitiBotimit: Number(e.target.value) })} />
              <input type="text" value={editData.foto || ""} onChange={(e) => setEditData({ ...editData, foto: e.target.value })} />
              <input type="number" value={editData.sasia} onChange={(e) => setEditData({ ...editData, sasia: Number(e.target.value) })} />

              <button onClick={saveEdit}>Ruaj</button>
              <button className="cancel-btn" onClick={() => setEditData(null)}>Anulo</button>
            </div>
          </div>
        )}

        {activeTab === "shto" && (
          <section>
            <h1>➕ Shto Liber të Ri</h1>

            <div className="add-book-form">
              <input type="text" placeholder="Titulli" value={newBook.titulli} onChange={(e) => setNewBook({ ...newBook, titulli: e.target.value })} />
              <input type="text" placeholder="Autori" value={newBook.autori} onChange={(e) => setNewBook({ ...newBook, autori: e.target.value })} />
              <input type="number" placeholder="Viti i Botimit" value={newBook.vitiBotimit} onChange={(e) => setNewBook({ ...newBook, vitiBotimit: Number(e.target.value) })} />
              <input type="text" placeholder="URL e fotos" value={newBook.foto} onChange={(e) => setNewBook({ ...newBook, foto: e.target.value })} />
              <input type="number" placeholder="Sasia" value={newBook.sasia} onChange={(e) => setNewBook({ ...newBook, sasia: Number(e.target.value) })} />

              <button className="btn-add" onClick={shtoLiber}>Shto Librin</button>
            </div>
          </section>
        )}

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