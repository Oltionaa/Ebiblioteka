import pool from "../utils/db.js";

export const getAllLibra = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id_liber,
        l.titulli,
        l.autori,
        l.vitiBotimit,
        l.foto,
        IFNULL(k_total.total_kopje, 0) AS total_kopje,
        IFNULL(k_lira.kopje_lira, 0) AS kopje_lira
      FROM liber l
      LEFT JOIN (
        SELECT id_liber, COUNT(*) AS total_kopje
        FROM kopja_librit
        GROUP BY id_liber
      ) AS k_total ON l.id_liber = k_total.id_liber
      LEFT JOIN (
        SELECT id_liber, COUNT(*) AS kopje_lira
        FROM kopja_librit
        WHERE statusi = 'i_lire'
        GROUP BY id_liber
      ) AS k_lira ON l.id_liber = k_lira.id_liber
      ORDER BY l.id_liber ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gabim gjatë marrjes së librave:", err);
    res.status(500).json({ message: "Gabim gjatë marrjes së librave." });
  }
};
