import { useEffect, useState } from "react";
import "../styles/dashboardBibliotekar.css";

function LibrarianDashboard() {
  const [libra, setLibra] = useState([]);
  const [rezervime, setRezervime] = useState([]);
  const [rekomandime, setRekomandime] = useState([]);
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
    loadRekomandime();
  }, []);

  const loadLibra = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libra");
      setLibra(await res.json());
    } catch (err) {
      console.error("Gabim gjatë marrjes së librave:", err);
    }
  };

  const loadRezervime = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rezervime/admin");
      setRezervime(await res.json());
    } catch (err) {
      console.error("Gabim gjatë marrjes së rezervimeve:", err);
    }
  };

  const loadRekomandime = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rekomandime");
      setRekomandime(await res.json());
    } catch (err) {
      console.error("Gabim gjatë marrjes së rekomandimeve:", err);
    }
  };

  const startEdit = (libri) => setEditData(libri);

  const saveEdit = async () => {
    try {
      await fetch(`http://localhost:5000/api/libra/edit/${editData.id_liber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulli: editData.titulli,
          autori: editData.autori,
          foto: editData.foto,
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

  const mirato = async (id_rezervimi) => {
    try {
      await fetch(`http://localhost:5000/api/rezervime/mirato/${id_rezervimi}`, {
        method: "PUT",
      });
      loadRezervime();
    } catch (err) {
      console.error("Gabim gjatë miratimit:", err);
    }
  };

  const refuzo = async (id_rezervimi) => {
    try {
      await fetch(`http://localhost:5000/api/rezervime/refuzo/${id_rezervimi}`, {
        method: "PUT",
      });
      loadRezervime();
    } catch (err) {
      console.error("Gabim gjatë refuzimit:", err);
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const shtoLiber = async () => {
    try {
      await fetch("http://localhost:5000/api/libra/shto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulli: newBook.titulli,
          autori: newBook.autori,
          foto: newBook.foto,
          vitiBotimit: Number(newBook.vitiBotimit),
          sasia: Number(newBook.sasia),
        }),
      });

      alert("Libri u shtua me sukses!");
      setNewBook({
        titulli: "",
        autori: "",
        vitiBotimit: "",
        foto: "",
        sasia: "",
      });
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
        <button className={activeTab === "libra" ? "active" : ""} onClick={() => setActiveTab("libra")}>📘 Librat</button>
        <button className={activeTab === "rezervime" ? "active" : ""} onClick={() => setActiveTab("rezervime")}>📝 Rezervimet</button>
        <button className={activeTab === "rekomandime" ? "active" : ""} onClick={() => setActiveTab("rekomandime")}>💬 Rekomandimet</button>
        <button className={activeTab === "shto" ? "active" : ""} onClick={() => setActiveTab("shto")}>➕ Shto Liber</button>
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
                  <th>Sasia</th>
                  <th>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {libra.map((l) => (
                  <tr key={l.id_liber}>
                    <td>{l.titulli}</td>
                    <td>{l.autori}</td>
                    <td>{l.sasia}</td>
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
                    <td>{r.perdoruesi}</td>
                    <td>{formatDate(r.dataRezervimit)}</td>
                    <td>{formatDate(r.dataRezervuar)}</td>
                    <td>{r.statusi}</td>
                    <td>
                      <button className="btn-blue" onClick={() => mirato(r.id_rezervimi)}>Mirato</button>
                      <button className="btn-red" onClick={() => refuzo(r.id_rezervimi)}>Refuzo</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "rekomandime" && (
          <section>
            <h1>💬 Rekomandimet e Përdoruesve</h1>
            {rekomandime.length === 0 ? (
              <p style={{ textAlign: "center" }}>Nuk ka rekomandime deri tani.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Përdoruesi</th>
                    <th>Libri</th>
                    <th>Mesazhi</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {rekomandime.map((r) => (
                    <tr key={r.id_rekomandimi}>
                      <td>{r.emri} {r.mbiemri}</td>
                      <td>{r.titulli || "—"}</td>
                      <td>{r.mesazhi}</td>
                      <td>{r.dataRekomandimit?.split("T")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {activeTab === "shto" && (
          <section>
            <h1>➕ Shto Liber të Ri</h1>
            <div className="add-book-form">
              <input type="text" placeholder="Titulli" value={newBook.titulli} onChange={(e) => setNewBook({ ...newBook, titulli: e.target.value })}/>
              <input type="text" placeholder="Autori" value={newBook.autori} onChange={(e) => setNewBook({ ...newBook, autori: e.target.value })}/>
              <input type="number" placeholder="Viti i Botimit" value={newBook.vitiBotimit} onChange={(e) => setNewBook({ ...newBook, vitiBotimit: e.target.value })}/>
              <input type="text" placeholder="URL e fotos" value={newBook.foto} onChange={(e) => setNewBook({ ...newBook, foto: e.target.value })}/>
              <input type="number" placeholder="Sasia" value={newBook.sasia} onChange={(e) => setNewBook({ ...newBook, sasia: e.target.value })}/>
              <button className="btn-add" onClick={shtoLiber}>Shto Librin</button>
            </div>
          </section>
        )}

        {editData && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edito Librin</h3>
              <input type="text" value={editData.titulli} onChange={(e) => setEditData({ ...editData, titulli: e.target.value })}/>
              <input type="text" value={editData.autori} onChange={(e) => setEditData({ ...editData, autori: e.target.value })}/>
              <input type="number" value={editData.vitiBotimit} onChange={(e) => setEditData({ ...editData, vitiBotimit: e.target.value })}/>
              <input type="text" value={editData.foto || ""} onChange={(e) => setEditData({ ...editData, foto: e.target.value })}/>
              <input type="number" value={editData.sasia ?? ""} onChange={(e) => setEditData({ ...editData, sasia: e.target.value })}/>
              <button onClick={saveEdit}>Ruaj</button>
              <button className="cancel-btn" onClick={() => setEditData(null)}>Anulo</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default LibrarianDashboard;
