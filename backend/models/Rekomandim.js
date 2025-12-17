import pool from "../utils/db.js";

class Rekomandim {
  static async shto({ id_perdoruesi, id_liber, mesazhi }) {
    return pool.query(
      "INSERT INTO rekomandim (id_perdoruesi, id_liber, mesazhi, dataRekomandimit) VALUES (?, ?, ?, NOW())",
      [id_perdoruesi, id_liber || null, mesazhi]
    );
  }

  static async merrTeGjitha() {
    return pool.query(`
      SELECT r.id_rekomandimi, r.mesazhi, r.dataRekomandimit,
             p.emri, p.mbiemri, l.titulli
      FROM rekomandim r
      LEFT JOIN perdoruesi p ON r.id_perdoruesi = p.id_perdoruesi
      LEFT JOIN liber l ON r.id_liber = l.id_liber
      ORDER BY r.dataRekomandimit DESC
    `);
  }
}

export default Rekomandim;
