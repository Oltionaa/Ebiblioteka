import pool from "../utils/db.js";

export const huazoLiber = async (req, res) => {
  const { id_perdoruesi, id_liber, dataKthimit } = req.body;

  try {
    const [kopje] = await pool.query(
      "SELECT id_kopja FROM kopja_librit WHERE id_liber = ? AND statusi = 'i_lire' LIMIT 1",
      [id_liber]
    );

    if (kopje.length === 0) {
      return res.status(400).json({ message: "Nuk ka kopje të lira për këtë libër." });
    }

    const id_kopja = kopje[0].id_kopja;

    await pool.query("UPDATE kopja_librit SET statusi = 'i_huazuar' WHERE id_kopja = ?", [id_kopja]);

    await pool.query(
      `INSERT INTO huazim (id_perdoruesi, id_liber, dataHuazimit, dataKthimit, statusi)
       VALUES (?, ?, CURDATE(), ?, 'aktive')`,
      [id_perdoruesi, id_liber, dataKthimit]
    );

    res.json({
      message: "Libri u huazua me sukses!",
      id_kopja,
      dataHuazimit: new Date().toISOString().split("T")[0],
      dataKthimit,
    });
  } catch (err) {
    console.error("Gabim gjatë huazimit të librit:", err);
    res.status(500).json({ message: "Gabim në server gjatë huazimit të librit." });
  }
};

export const ktheLiber = async (req, res) => {
  const { id_liber, id_perdoruesi } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT h.id_huazimi, k.id_kopja
       FROM huazim h
       JOIN kopja_librit k ON h.id_liber = k.id_liber
       WHERE h.id_liber = ? AND h.id_perdoruesi = ? AND h.statusi = 'aktive'
       LIMIT 1`,
      [id_liber, id_perdoruesi]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Nuk u gjet ndonjë huazim aktiv për këtë libër." });
    }

    const id_huazimi = rows[0].id_huazimi;
    const id_kopja = rows[0].id_kopja;

    await pool.query("UPDATE kopja_librit SET statusi = 'i_lire' WHERE id_kopja = ?", [id_kopja]);
    await pool.query(
      "UPDATE huazim SET statusi = 'kthyer', dataKthimit = CURDATE() WHERE id_huazimi = ?",
      [id_huazimi]
    );

    res.json({ message: "Libri u kthye me sukses!" });
  } catch (err) {
    console.error("Gabim gjatë kthimit të librit:", err);
    res.status(500).json({ message: "Gabim në server gjatë kthimit të librit." });
  }
};
export const getDatatEZena = async (req, res) => {
  const { id_liber } = req.params;

  try {
    const [huazime] = await pool.query(
      `SELECT dataHuazimit AS start, dataKthimit AS end
       FROM huazim
       WHERE id_liber = ? AND statusi = 'aktive'`,
      [id_liber]
    );

    const [rezervime] = await pool.query(
      `SELECT dataRezervuar AS start, DATE_ADD(dataRezervuar, INTERVAL 7 DAY) AS end
       FROM rezervim
       WHERE id_liber = ? AND (statusi='ne_pritje' OR statusi='miratuar')`,
      [id_liber]
    );

    const datat = [...huazime, ...rezervime].map(d => ({
      start: d.start,
      end: d.end
    }));

    res.json(datat);
  } catch (err) {
    console.error("Gabim gjatë datave të zëna:", err);
    res.json([]);
  }
};

export const getHuazimetByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        h.id_huazimi AS id_huazimi,
        h.id_liber,
        l.titulli,
        h.dataHuazimit AS data_marrjes,
        h.dataKthimit AS data_kthimit,
        h.statusi
      FROM huazim h
      JOIN liber l ON h.id_liber = l.id_liber
      WHERE h.id_perdoruesi = ?
      ORDER BY h.dataHuazimit DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë marrjes së huazimeve." });
  }
};

