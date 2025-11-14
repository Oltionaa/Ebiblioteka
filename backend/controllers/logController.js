import pool from "../utils/db.js";

export const addLog = async (id_perdoruesi, veprimi, roli, ip) => {
  try {
    await pool.query(
      "INSERT INTO logs (id_perdoruesi, veprimi, roli, ip) VALUES (?, ?, ?, ?)",
      [id_perdoruesi, veprimi, roli, ip]
    );
  } catch (err) {
    console.error("Gabim gjatë shkrimit të logut:", err);
  }
};

export const getLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        l.id_log,
        p.emri,
        p.mbiemri,
        p.roli,
        l.veprimi,
        l.ip,
        l.created_at
       FROM logs l
       LEFT JOIN perdoruesi p ON p.id_perdoruesi = l.id_perdoruesi
       ORDER BY l.id_log DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Gabim gjatë marrjes së logs:", err);
    res.status(500).json({ message: "Gabim gjatë marrjes së logs." });
  }
};
