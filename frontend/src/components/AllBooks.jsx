import React, { useEffect, useState } from "react";

function AllBooks() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/libra");
      if (!res.ok) throw new Error("Gabim gjatë marrjes së librave");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error( err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleHuazo = async (id_liber, id_perdoruesi) => {
    try {
      const res = await fetch("http://localhost:5000/api/huazim/huazo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_liber,
          id_perdoruesi,
          dataKthimit: "2025-12-01",
        }),
      });

      const data = await res.json();
      alert(data.message || "Huazimi u krye me sukses!");
      fetchBooks();
    } catch (err) {
      alert("Gabim gjatë huazimit!");
    }
  };

  const handleRezervo = async (id_liber, id_perdoruesi) => {
    try {
      const res = await fetch("http://localhost:5000/api/rezervim/rezervo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_liber, id_perdoruesi }),
      });

      const data = await res.json();
      alert(data.message || "Rezervimi u krye me sukses!");
      fetchBooks();
    } catch (err) {
      alert("Gabim gjatë rezervimit!");
    }
  };

  return (
    <div className="books-container" style={{ padding: "2rem" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#333",
          fontWeight: "600",
        }}
      >
      </h2>

      {books.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nuk ka libra në databazë.</p>
      ) : (
        <div
          className="books-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {books.map((book) => (
            <div
              key={book.id_liber}
              className="book-card"
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "white",
                transition: "transform 0.2s ease",
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
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontStyle: "italic",
                  }}
                >
                  (Pa foto)
                </div>
              )}
              <h3
                style={{
                  color: "#333",
                  fontWeight: "600",
                  marginBottom: "0.3rem",
                }}
              >
                {book.titulli}
              </h3>

              <p style={{ margin: "0.3rem 0" }}> {book.autori}</p>
              <p style={{ margin: "0.3rem 0" }}>
               Viti: {book.vitiBotimit || "—"}
              </p>
              <p style={{ margin: "0.3rem 0" }}>
                Kopje gjithsej: <b>{book.total_kopje}</b>
              </p>
              <p style={{ margin: "0.3rem 0" }}>
                Kopje të lira: <b>{book.kopje_lira}</b>
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => handleHuazo(book.id_liber, 1)} 
                  disabled={book.kopje_lira === 0}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor:
                      book.kopje_lira === 0 ? "#bbb" : "#007bff",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontWeight: "500",
                    cursor:
                      book.kopje_lira === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {book.kopje_lira === 0 ? "S'ka kopje" : "Huazo"}
                </button>
                <button
                  onClick={() => handleRezervo(book.id_liber, 1)}
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
                  Rezervo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllBooks;