// frontend/src/services/bookService.js
const API_URL = "http://localhost:5000/api/liber";

export async function searchBooks(query) {
  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Gabim në kërkimin e librave");
  return res.json();
}

export async function reserveBook(bookId) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) throw new Error("Përdoruesi nuk është i kyçur");

  const res = await fetch(`${API_URL}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_perdoruesi: user.id_perdoruesi, id_liber: bookId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Gabim gjatë rezervimit");
  }
  return res.json();
}
