"use client";

import { useState, useEffect } from "react";

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Duke u lidhur me:", "http://localhost:5000/api/liber");
      
      const res = await fetch("http://localhost:5000/api/liber");
      
      console.log("Statusi i përgjigjes:", res.status);
      
      const contentType = res.headers.get("content-type");
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error(" Serveri ktheu:", text.substring(0, 100));
        throw new Error("Serveri ktheu HTML në vend të JSON. Kontrollo routes në backend.");
      }
      
      const data = await res.json();
      console.log("Të dhënat e marra:", data);
      
      if (!res.ok) {
        throw new Error(data.message || `HTTP gabim! status: ${res.status}`);
      }
      
      setBooks(data.books || data || []);
      
    } catch (err) {
      console.error("Gabim në fetch:", err);
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Të gjithë librat</h2>
      
      <button onClick={fetchBooks} style={{ marginBottom: "20px" }}>
        Testo Lidhjen
      </button>
      
      {error && (
        <div style={{ 
          background: "#ffebee", 
          color: "#c62828", 
          padding: "15px", 
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          <strong>Gabim:</strong> {error}
        </div>
      )}
      
      {loading ? (
        <p>Duke ngarkuar...</p>
      ) : (
        <div>
          {books.length === 0 ? (
            <p>Nuk ka libra për të shfaqur</p>
          ) : (
            books.map((book) => (
              <div key={book.id_liber} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}>
                <h3>{book.titulli}</h3>
                <p>Autori: {book.autori}</p>
                <p>Statusi: {book.statusi}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AllBooks;