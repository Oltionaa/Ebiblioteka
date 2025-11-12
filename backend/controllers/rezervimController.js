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
        message: " Ka kopje të lira — mund ta huazosh direkt pa rezervim!",
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
        message: " Kjo datë është e zënë — zgjidh një tjetër!",
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
    res.status(500).json({ message: "Gabim në server gjatë rezervimit të librit." });
  }
};

export const getRezervimetByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
         r.id_rezervimi,
         l.titulli,
         r.dataRezervimit,
         r.dataRezervuar,
         r.statusi
       FROM rezervim r
       LEFT JOIN liber l ON r.id_liber = l.id_liber
       WHERE r.id_perdoruesi = ?
       ORDER BY r.dataRezervimit DESC`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Gabim gjatë marrjes së rezervimeve:", err);
    res.status(500).json({ message: "Gabim gjatë marrjes së rezervimeve." });
  }
};


export const fshiRezervim = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM rezervim WHERE id_rezervimi = ?", [id]);
    res.json({ message: "Rezervimi u fshi me sukses!" });
  } catch (err) {
    console.error("Gabim gjatë fshirjes së rezervimit:", err);
    res.status(500).json({ message: "Gabim gjatë fshirjes së rezervimit." });
  }
};

export const ndryshoRezervim = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    await pool.query("UPDATE rezervim SET dataRezervuar = ? WHERE id_rezervimi = ?", [data, id]);
    res.json({ message: "Data e rezervimit u ndryshua me sukses!" });
  } catch (err) {
    console.error("Gabim gjatë ndryshimit të rezervimit:", err);
    res.status(500).json({ message: "Gabim gjatë ndryshimit të rezervimit." });
  }
};
