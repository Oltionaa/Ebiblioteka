import pool from "./db.js";

export const addLog = async (id_perdoruesi, veprimi, roli, ip) => {
  try {
    await pool.query(
      "INSERT INTO logs (id_perdoruesi, veprimi, roli, ip) VALUES (?, ?, ?, ?)",
      [id_perdoruesi, veprimi, roli, ip]
    );
  } catch (err) {
    console.error("Gabim gjatë regjistrimit të log-ut:", err);
  }
};
