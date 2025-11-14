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

export const shtoLiber = async (req, res) => {
  const { titulli, autori, vitiBotimit, foto, sasia } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO liber (titulli, autori, vitiBotimit, foto, sasia) VALUES (?, ?, ?, ?, ?)",
      [titulli, autori, vitiBotimit, foto, sasia]
    );

    const id_liber = result.insertId;

    for (let i = 0; i < sasia; i++) {
      await pool.query(
        "INSERT INTO kopja_librit (id_liber, statusi) VALUES (?, 'i_lire')",
        [id_liber]
      );
    }

    res.json({ message: "Libri dhe kopjet u shtuan me sukses!" });

  } catch (err) {
    console.error("Gabim shtoLiber:", err);
    res.status(500).json({ message: "Gabim gjatë shtimit të librit." });
  }
};

export const editoLiber = async (req, res) => {
  const { id } = req.params;
  const { titulli, autori, vitiBotimit, foto, sasia } = req.body;

  try {
    await pool.query(
      "UPDATE liber SET titulli=?, autori=?, vitiBotimit=?, foto=?, sasia=? WHERE id_liber=?",
      [titulli, autori, vitiBotimit, foto, sasia, id]
    );

    res.json({ message: "Libri u ndryshua!" });
  } catch (err) {
    console.error("Gabim editoLiber:", err);
    res.status(500).json({ message: "Gabim gjatë ndryshimit të librit." });
  }
};

export const fshiLiber = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM liber WHERE id_liber = ?", [id]);
    await pool.query("DELETE FROM kopja_librit WHERE id_liber = ?", [id]);

    res.json({ message: "Libri dhe kopjet u fshinë." });
  } catch (err) {
    console.error("Gabim gjatë fshirjes së librit:", err);
    res.status(500).json({ message: "Gabim gjatë fshirjes së librit." });
  }
};

export const getLibraDetaje = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id_liber,
        l.titulli,
        l.autori,
        l.vitiBotimit,
        l.foto,

        (SELECT COUNT(*) FROM kopja_librit k WHERE k.id_liber = l.id_liber) AS total_kopje,

        (SELECT COUNT(*) FROM kopja_librit k WHERE k.id_liber = l.id_liber AND k.statusi = 'i_lire') AS kopje_lira,

        (SELECT COUNT(*) FROM kopja_librit k WHERE k.id_liber = l.id_liber AND k.statusi = 'i_huazuar') AS kopje_huazuara,

        (SELECT p.emri FROM huazim h 
          JOIN perdoruesi p ON h.id_perdoruesi = p.id_perdoruesi
          WHERE h.id_liber = l.id_liber AND h.statusi = 'aktive'
          LIMIT 1
        ) AS huazuar_nga
        
      FROM liber l
      ORDER BY l.id_liber DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Gabim getLibraDetaje:", err);
    res.status(500).json({ message: "Gabim gjatë marrjes së të dhënave." });
  }
};
