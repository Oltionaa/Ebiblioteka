import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "" });

  const [bookDates, setBookDates] = useState([]);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libra");
      if (!res.ok) throw new Error("Gabim gjatë marrjes së librave");
      const data = await res.json();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      console.error( err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const results = books.filter(
      (b) =>
        b.titulli?.toLowerCase().includes(q) ||
        b.autori?.toLowerCase().includes(q) ||
        b.kategoria?.toLowerCase().includes(q)
    );
    setFilteredBooks(results);
  }, [search, books]);

  const handleHuazo = async (id_liber, id_perdoruesi) => {
    if (!selectedDate) {
      alert("Zgjedh datën e kthimit para huazimit!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/huazime/huazo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_liber,
          id_perdoruesi,
          dataKthimit: selectedDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gabim gjatë huazimit!");
      }

      setPopup({
        show: true,
        message: ` ${data.message}\nData e kthimit: ${selectedDate}`,
      });

      setShowDatePicker(null);
      setSelectedDate("");
      fetchBooks();
      setTimeout(() => setPopup({ show: false, message: "" }), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

 const handleRezervo = async (id_liber, id_perdoruesi, data) => {
  try {
    const res = await fetch("http://localhost:5000/api/rezervime/rezervo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_liber, id_perdoruesi, data }),
    });

    const dataRes = await res.json();

    if (!res.ok) {
      throw new Error(dataRes.message || "Gabim gjatë rezervimit!");
    }

    setPopup({ show: true, message: `📖 ${dataRes.message}` });
    setTimeout(() => setPopup({ show: false, message: "" }), 3000);
    fetchBooks();
    fetchDatatEZena(id_liber);
  } catch (err) {
    alert(err.message);
  }
};

  const fetchDatatEZena = async (id_liber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/huazime/datat/${id_liber}`);
      const data = await res.json();
      setBookDates(data);
      setShowDatesModal(true);
      setSelectedBookId(id_liber);
    } catch (err) {
      alert("Gabim gjatë marrjes së datave të zëna!");
    }
  };

  return (
    <div className="books-container" style={{ padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Kërko sipas titullit, autorit ose kategorisë..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "60%",
            padding: "10px 15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      {filteredBooks.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nuk ka libra që përputhen me kërkimin.</p>
      ) : (
        <div
          className="books-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredBooks.map((book) => (
            <div
              key={book.id_liber}
              className="book-card"
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "white",
              }}
            >
              {book.foto ? (
                <img
                  src={book.foto}
                  alt={book.titulli}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "250px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                  }}
                >
                  (Pa foto)
                </div>
              )}

              <h3 style={{ color: "#333", fontWeight: "600" }}>{book.titulli}</h3>
              <p style={{ margin: "0.3rem 0" }}>Autor: {book.autori}</p>
              <p style={{ margin: "0.3rem 0" }}>Viti: {book.vitiBotimit || "—"}</p>
              <p style={{ margin: "0.3rem 0" }}>
                Kopje gjithsej: <b>{book.total_kopje}</b>
              </p>
              <p style={{ margin: "0.3rem 0" }}>
                Kopje të lira: <b>{book.kopje_lira}</b>
              </p>

              {showDatePicker === book.id_liber ? (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                  <button
                    onClick={() => handleHuazo(book.id_liber, 1)}
                    style={{
                      marginLeft: "10px",
                      padding: "6px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Konfirmo
                  </button>
                  <button
                    onClick={() => setShowDatePicker(null)}
                    style={{
                      marginLeft: "10px",
                      padding: "6px 10px",
                      backgroundColor: "#ccc",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Anulo
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "1rem",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setShowDatePicker(book.id_liber)}
                    disabled={book.kopje_lira === 0}
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: book.kopje_lira === 0 ? "#bbb" : "#007bff",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      fontWeight: "500",
                      cursor: book.kopje_lira === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    {book.kopje_lira === 0 ? "S'ka kopje" : "Huazo"}
                  </button>
                  <button
                    onClick={() => fetchDatatEZena(book.id_liber)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: "#ffc107",
                      border: "none",
                      borderRadius: "6px",
                      color: "#222",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Shiko datat
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {popup.show && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
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

      {showDatesModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "10px",
              width: "420px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>📅 Datat e librave</h3>

            <Calendar
              tileDisabled={({ date }) => {
                return bookDates.some((d) => {
                  const start = new Date(d.start);
                  const end = new Date(d.end);
                  return date >= start && date <= end;
                });
              }}
              tileClassName={({ date }) => {
                const isZene = bookDates.some((d) => {
                  const start = new Date(d.start);
                  const end = new Date(d.end);
                  return date >= start && date <= end;
                });
                return isZene ? "zene" : "lire";
              }}
              onClickDay={(value) => {
                const selected = value.toISOString().split("T")[0];
                const isZene = bookDates.some((d) => {
                  const start = new Date(d.start);
                  const end = new Date(d.end);
                  return value >= start && value <= end;
                });

                if (isZene) {
                  alert("Kjo datë është e zënë!");
                } else {
                  if (window.confirm(`Dëshiron ta rezervosh librin më: ${selected}?`)) {
                    handleRezervo(selectedBookId, 1, selected);
                    setShowDatesModal(false);
                  }
                }
              }}
            />

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <span style={{ color: "red", marginRight: "10px" }}>🔴 Zënë</span>
              <span style={{ color: "green" }}>🟢 Lirë</span>
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button
                onClick={() => {
                  setShowDatesModal(false);
                  setBookDates([]);
                }}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Mbyll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllBooks;
