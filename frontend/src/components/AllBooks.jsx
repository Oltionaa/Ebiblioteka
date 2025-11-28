import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/searchBooks.css";

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); 
  const [popup, setPopup] = useState({ show: false, message: "", color: "#28a745" });
  const [bookDates, setBookDates] = useState([]);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const id_perdoruesi = user?.id_perdoruesi; 


  const showPopup = (message, color = "#28a745") => {
    setPopup({ show: true, message, color });
    setTimeout(() => setPopup({ show: false, message: "" }), 4000);
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libra");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBooks(data);
        setFilteredBooks(data);
      } else {
        setBooks([]);
        setFilteredBooks([]);
      }
    } catch {
      console.error("Gabim gjatë marrjes së librave!");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredBooks(
      books.filter(
        (b) =>
          b.titulli?.toLowerCase().includes(q) ||
          b.autori?.toLowerCase().includes(q) ||
          b.kategoria?.toLowerCase().includes(q)
      )
    );
  }, [search, books]);

  const handleHuazo = async (id_liber) => {
    if (!id_perdoruesi) return alert("Duhet të jeni i kyçur!");
    if (!selectedDate) return alert("Zgjedh datën e kthimit!");

    try {
      const res = await fetch("http://localhost:5000/api/huazime/huazo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_liber, id_perdoruesi, dataKthimit: selectedDate }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showPopup(data.message);
      setShowDatePicker(null);
      setSelectedDate("");
      fetchBooks();
    } catch (err) {
      showPopup(err.message, "#dc3545");
    }
  };

  const handleRezervo = async (id_liber, data) => {
    try {
      const res = await fetch("http://localhost:5000/api/rezervime/rezervo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_liber,
          id_perdoruesi,
          dataRezervimit: data,
        }),
      });

      const dataRes = await res.json();

      if (res.status === 409) return showPopup(dataRes.message, "#ffc107");
      if (res.status === 400) return showPopup(dataRes.message, "#dc3545");

      showPopup(dataRes.message, "#28a745");
      setShowDatesModal(false);
      setBookDates([]);
    } catch {
      showPopup("Gabim në server!", "#dc3545");
    }
  };

  const fetchDatatEZena = async (id_liber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/huazime/datat/${id_liber}`);
      const data = await res.json();
      setBookDates(data);
      setShowDatesModal(true);
      setSelectedBookId(id_liber);
    } catch {
      alert("Gabim gjatë marrjes së datave!");
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

      {filteredBooks.length > 0 ? (
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
                background: "white",
                padding: "1rem",
                borderRadius: "10px",
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
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "250px",
                    background: "#eee",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  (Pa foto)
                </div>
              )}

              <h3>{book.titulli}</h3>
              <p>Autor: {book.autori}</p>
              <p>Viti: {book.vitiBotimit || "—"}</p>
              <p>Kopje gjithsej: <b>{book.total_kopje}</b></p>
              <p>Kopje të lira: <b>{book.kopje_lira}</b></p>

              {showDatePicker === book.id_liber ? (
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                  <button
                    onClick={() => handleHuazo(book.id_liber)}
                    style={{ marginLeft: "10px", padding: "6px 10px", background: "#007bff", color: "white", border: "none", borderRadius: "6px" }}
                  >
                    Konfirmo
                  </button>
                  <button
                    onClick={() => setShowDatePicker(null)}
                    style={{ marginLeft: "10px", padding: "6px 10px", background: "#ccc", border: "none", borderRadius: "6px" }}
                  >
                    Anulo
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button
                    onClick={() => setShowDatePicker(book.id_liber)}
                    disabled={book.kopje_lira === 0}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: book.kopje_lira === 0 ? "#bbb" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                    }}
                  >
                    {book.kopje_lira === 0 ? "S'ka kopje" : "Huazo"}
                  </button>

                  <button
                    onClick={() => fetchDatatEZena(book.id_liber)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: "#ffc107",
                      color: "#222",
                      border: "none",
                      borderRadius: "6px",
                    }}
                  >
                    Rezervo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Nuk ka libra që përputhen.</p>
      )}

      {popup.show && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
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

      {showDatesModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: "2rem", borderRadius: "10px", width: "420px" }}>
            <h3 style={{ textAlign: "center" }}>📅 Datat e librave</h3>

            <Calendar
              tileClassName={({ date }) => {
                const isZene = bookDates.some(
                  (d) => date >= new Date(d.start) && date <= new Date(d.end)
                );
                return isZene ? "zene" : "lire";
              }}
              onClickDay={(value) => {
                const selected = value.toISOString().split("T")[0];
                const book = books.find((b) => b.id_liber === selectedBookId);

                if (book?.kopje_lira > 0) return showPopup("Ka kopje të lira — huazo direkt!", "#ffc107");

                if (bookDates.some((d) => value >= new Date(d.start) && value <= new Date(d.end)))
                  return alert("Kjo datë është e zënë!");

                if (window.confirm(`📖 Rezervo më: ${selected}?`))
                  handleRezervo(selectedBookId, selected);
              }}
            />

            <button
              onClick={() => {
                setShowDatesModal(false);
                setBookDates([]);
              }}
              style={{ marginTop: "1rem", padding: "8px", background: "#007bff", color: "white", borderRadius: "6px", border: "none" }}
            >
              Mbyll
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllBooks;
