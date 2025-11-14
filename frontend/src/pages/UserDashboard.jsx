import React, { useEffect, useState } from "react";

function UserDashboard() {
  const [huazimet, setHuazimet] = useState([]);
  const [rezervimet, setRezervimet] = useState([]);
  const [njoftime, setNjoftime] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [popup, setPopup] = useState({ show: false, message: "", color: "#28a745" });

  const user = JSON.parse(localStorage.getItem("user"));
  const id_perdoruesi = user?.id_perdoruesi;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toISOString().split("T")[0];
  };

  const fetchData = async () => {
    if (!id_perdoruesi) return;

    try {
      const resHuazime = await fetch(`http://localhost:5000/api/huazime/user/${id_perdoruesi}`);
      const resRezervime = await fetch(`http://localhost:5000/api/rezervime/user/${id_perdoruesi}`);
      const resNjoftime = await fetch(`http://localhost:5000/api/njoftime/${id_perdoruesi}`);

      const dataHuazime = await resHuazime.json();
      const dataRezervime = await resRezervime.json();
      const dataNjoftime = await resNjoftime.json();

      setHuazimet(dataHuazime);
      setRezervimet(dataRezervime);
      setNjoftime(dataNjoftime);
    } catch (err) {
      console.error("Gabim:", err);
      showPopup("Gabim gjatë marrjes së të dhënave!", "#dc3545");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showPopup = (message, color = "#28a745") => {
    setPopup({ show: true, message, color });
    setTimeout(() => setPopup({ show: false, message: "" }), 3000);
  };

  const ktheLiber = async (id_liber) => {
    if (!window.confirm("A dëshiron ta kthesh librin?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/huazime/kthe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_liber, id_perdoruesi }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showPopup("Libri u kthye me sukses!", "#28a745");
      fetchData();
    } catch (err) {
      showPopup(err.message || "Gabim!", "#dc3545");
    }
  };

  const fshiRezervim = async (id_rezervimi) => {
    if (!window.confirm("A je i sigurt për fshirje?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rezervime/fshi/${id_rezervimi}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showPopup("Rezervimi u fshi me sukses!", "#28a745");
      fetchData();
    } catch {
      showPopup("Gabim gjatë fshirjes!", "#dc3545");
    }
  };

  const ndryshoDate = async (id_rezervimi) => {
    const dataRe = prompt("Shkruaj datën e re (YYYY-MM-DD):");
    if (!dataRe) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rezervime/ndrysho/${id_rezervimi}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataRe }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showPopup("Data u ndryshua me sukses!", "#28a745");
      fetchData();
    } catch {
      showPopup("Gabim gjatë ndryshimit!", "#dc3545");
    }
  };

  const renderTable = (title, data, type) => (
    <div
      style={{
        marginBottom: "3rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        padding: "1.5rem",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{title}</h2>

      {data.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nuk ka të dhëna.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr style={{ background: "#007bff", color: "white" }}>
              <th>#</th>
              <th>Titulli</th>
              <th>Data e Marrjes</th>
              <th>Data e Kthimit / Rezervuar</th>
              <th>Statusi</th>
              <th>Veprime</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{index + 1}</td>
                <td>{row.titulli}</td>
                <td>{formatDate(row.dataHuazimit || row.dataRezervimit)}</td>
                <td>{formatDate(row.dataKthimit || row.dataRezervuar)}</td>
                <td style={{ fontWeight: "bold" }}>{row.statusi}</td>

                <td>
                  {type === "rezervim" ? (
                    <>
                      <button
                        onClick={() => ndryshoDate(row.id_rezervimi)}
                        style={{ marginRight: "8px", background: "#ffc107", padding: "6px 10px" }}
                      >
                        Ndrysho
                      </button>
                      <button
                        onClick={() => fshiRezervim(row.id_rezervimi)}
                        style={{ background: "#dc3545", color: "white", padding: "6px 10px" }}
                      >
                        Fshi
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => ktheLiber(row.id_liber)}
                      disabled={row.statusi === "kthyer"}
                      style={{
                        background: row.statusi === "kthyer" ? "#aaa" : "#17a2b8",
                        color: "white",
                        padding: "6px 10px",
                      }}
                    >
                      {row.statusi === "kthyer" ? "Kthyer" : "Kthe librin"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div style={{ padding: "2rem", background: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* 🔔 IKONA E NJOFTIMEVE */}
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{ background: "transparent", border: "none", fontSize: "26px", cursor: "pointer", position: "relative" }}
        >
          🔔
          {njoftime.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "3px 7px",
                fontSize: "12px",
              }}
            >
              {njoftime.length}
            </span>
          )}
        </button>
      </div>

      {/* PANELI I NJOFTIMEVE */}
      {showNotifications && (
        <div
          style={{
            background: "white",
            padding: "1rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Njoftimet</h2>

          {njoftime.length === 0 ? (
            <p>Nuk ka njoftime.</p>
          ) : (
            <ul>
              {njoftime.map((n) => (
                <li
                  key={n.id_njoftimi}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    color: n.tipi === "success" ? "green" : "red",
                    fontWeight: "600",
                  }}
                >
                  {n.mesazh}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>📚 Dashboard i Përdoruesit</h1>

      {renderTable("Librat e Huazuar", huazimet, "huazim")}
      {renderTable("Librat e Rezervuar", rezervimet, "rezervim")}

      {popup.show && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: popup.color,
            color: "white",
            padding: "15px 25px",
            borderRadius: "10px",
            zIndex: 9999,
          }}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
