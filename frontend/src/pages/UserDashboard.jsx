import React, { useEffect, useState } from "react";

function UserDashboard() {
  const [huazimet, setHuazimet] = useState([]);
  const [rezervimet, setRezervimet] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", color: "#28a745" });

  const user = JSON.parse(localStorage.getItem("user"));
  const id_perdoruesi = user?.id_perdoruesi || user?.id || null;

  useEffect(() => {
    if (!id_perdoruesi) {
      setPopup({ show: true, message: "Ju lutem kyçuni për të parë dashboard-in!", color: "#dc3545" });
      return;
    }
  }, [id_perdoruesi]);

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

      const dataHuazime = await resHuazime.json();
      const dataRezervime = await resRezervime.json();

      setHuazimet(dataHuazime);
      setRezervimet(dataRezervime);
    } catch (err) {
      console.error("Gabim gjatë marrjes së të dhënave:", err);
      setPopup({ show: true, message: "Gabim gjatë marrjes së të dhënave!", color: "#dc3545" });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPopup = (message, color = "#28a745") => {
    setPopup({ show: true, message, color });
    setTimeout(() => setPopup({ show: false, message: "" }), 3000);
  };

  const ktheLiber = async (id_liber) => {
    if (window.confirm("A dëshiron ta kthesh librin?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/huazime/kthe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_liber, id_perdoruesi }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setHuazimet((prev) =>
          prev.map((h) =>
            h.id_liber === id_liber
              ? { ...h, statusi: "kthyer", dataKthimit: new Date().toISOString().split("T")[0] }
              : h
          )
        );

        showPopup("Libri u kthye me sukses!", "#28a745");
      } catch (err) {
        showPopup(err.message || "Gabim gjatë kthimit!", "#dc3545");
      }
    }
  };

  const fshiRezervim = async (id_rezervimi) => {
    if (window.confirm("A je i sigurt që dëshiron ta fshish këtë rezervim?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/rezervime/fshi/${id_rezervimi}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        showPopup("Rezervimi u fshi me sukses!", "#28a745");
        fetchData();
      } catch {
        showPopup("Gabim gjatë fshirjes së rezervimit!", "#dc3545");
      }
    }
  };

  const ndryshoDate = async (id_rezervimi) => {
    const dataRe = prompt("Shkruaj datën e re (format: YYYY-MM-DD):");
    if (!dataRe) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rezervime/ndrysho/${id_rezervimi}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataRe }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showPopup("Data u përditësua me sukses!", "#28a745");
      fetchData();
    } catch {
      showPopup("Gabim gjatë ndryshimit të datës!", "#dc3545");
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
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>{title}</h2>

      {data.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nuk ka të dhëna.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr style={{ background: "#007bff", color: "white" }}>
              <th style={{ padding: "10px" }}>#</th>
              <th style={{ padding: "10px" }}>Titulli</th>
              <th style={{ padding: "10px" }}>Data Huazimit / Rezervimit</th>
              <th style={{ padding: "10px" }}>Data Kthimit / Rezervuar</th>
              <th style={{ padding: "10px" }}>Statusi</th>
              <th style={{ padding: "10px" }}>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #ddd",
                  backgroundColor:
                    row.statusi === "kthyer"
                      ? "#f0f0f0"
                      : index % 2 === 0
                      ? "#fafafa"
                      : "#fff",
                }}
              >
                <td style={{ padding: "10px" }}>{index + 1}</td>
                <td style={{ padding: "10px", fontWeight: "500" }}>{row.titulli}</td>
                <td style={{ padding: "10px" }}>
                  {formatDate(row.dataHuazimit || row.dataRezervimit)}
                </td>
                <td style={{ padding: "10px" }}>
                  {formatDate(row.dataKthimit || row.dataRezervuar)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    color:
                      row.statusi === "aktive"
                        ? "green"
                        : row.statusi === "rezervuar"
                        ? "red"
                        : "gray",
                  }}
                >
                  {row.statusi}
                </td>
                <td style={{ padding: "10px" }}>
                  {type === "rezervim" ? (
                    <>
                      <button
                        onClick={() => ndryshoDate(row.id_rezervimi)}
                        style={{
                          marginRight: "8px",
                          background: "#ffc107",
                          color: "#222",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Ndrysho datën
                      </button>
                      <button
                        onClick={() => fshiRezervim(row.id_rezervimi)}
                        style={{
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
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
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: row.statusi === "kthyer" ? "not-allowed" : "pointer",
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
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#222" }}>
        📚 Dashboard i Përdoruesit
      </h1>

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
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
            fontWeight: "500",
          }}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;