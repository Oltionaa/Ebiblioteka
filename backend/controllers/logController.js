import pool from "../utils/db.js";

class LogController {
  async addLog(id_perdoruesi, veprimi, roli, ip) {
    try {
      await pool.query(
        "INSERT INTO logs (id_perdoruesi, veprimi, roli, ip) VALUES (?, ?, ?, ?)",
        [id_perdoruesi, veprimi, roli, ip]
      );
    } catch (err) {
      console.error("Gabim gjatë shkrimit të logut:", err);
    }
  }

  async getLogs(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          l.id_log,
          CONCAT(p.emri, ' ', p.mbiemri) AS perdoruesi,
          l.roli,
          l.veprimi,
          l.ip,
          l.created_at
        FROM logs l
        LEFT JOIN perdoruesi p ON p.id_perdoruesi = l.id_perdoruesi
        ORDER BY l.id_log DESC
      `);

      res.json(rows);
    } catch (err) {
      console.error("Gabim gjatë marrjes së logs:", err);
      res.status(500).json({ message: "Gabim gjatë marrjes së logs." });
    }
  }
}

const controller = new LogController();


export const addLog = (id_perdoruesi, veprimi, roli, ip) =>
  controller.addLog(id_perdoruesi, veprimi, roli, ip);

export const getLogs = (req, res) =>
  controller.getLogs(req, res);
