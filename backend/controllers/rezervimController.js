import pool from "../utils/db.js";

export const rezervoLiber = async (req, res) => {
  const { id_perdoruesi, id_liber, data } = req.body;

  try {
    const [kopje] = await pool.query(
      "SELECT id_kopja FROM kopja_librit WHERE id_liber = ? AND statusi = 'i_lire' LIMIT 1",
      [id_liber]
    );

    if (kopje.length > 0) {
      return res.json({
        message: "Ka kopje të lira — mund ta huazosh direkt pa rezervim!",
      });
    }
    const [datatEZena] = await pool.query(
      `SELECT 1 FROM (
         SELECT dataHuazimit AS start, dataKthimit AS end
         FROM huazim
         WHERE id_liber = ? AND statusi = 'aktive'
         UNION
         SELECT dataRezervuar AS start, dataRezervuar AS end
         FROM rezervim
         WHERE id_liber = ? AND (statusi = 'aktiv' OR statusi = 'rezervuar')
       ) AS datat
       WHERE ? BETWEEN start AND end`,
      [id_liber, id_liber, data]
    );

    if (datatEZena.length > 0) {
      return res.status(400).json({
        message: "Kjo datë është e zënë — zgjidh një tjetër!",
      });
    }

    await pool.query(
      `INSERT INTO rezervim (id_perdoruesi, id_liber, dataRezervimit, dataRezervuar, statusi)
       VALUES (?, ?, CURDATE(), ?, 'rezervuar')`,
      [id_perdoruesi, id_liber, data]
    );

    res.json({ message: `Libri u rezervua për datën ${data}!` });
  } catch (err) {
    console.error("Gabim gjatë rezervimit:", err);
    res
      .status(500)
      .json({ message: "Gabim në server gjatë rezervimit të librit." });
  }
};
