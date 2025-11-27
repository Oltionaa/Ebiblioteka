import pool from "../utils/db.js";

export const rezervoLiber = async (req, res) => {
  const { id_perdoruesi, id_liber, dataRezervuar } = req.body;

  try {
    const [kopje] = await pool.query(
      "SELECT id_kopja FROM kopja_librit WHERE id_liber = ? AND statusi = 'i_lire' LIMIT 1",
      [id_liber]
    );

    if (kopje.length > 0) {
      return res.json({
        message: "Ka kopje të lira — mund ta huazosh direkt pa rezervim!"
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
         WHERE id_liber = ? AND statusi = 'miratuar'
       ) as d
       WHERE ? BETWEEN start AND end`,
      [id_liber, id_liber, dataRezervuar]
    );

    if (datatEZena.length > 0) {
      return res.status(400).json({ message: "Kjo datë është e zënë, zgjidh një tjetër!" });
    }

    await pool.query(
      `INSERT INTO rezervim (id_perdoruesi, id_liber, dataRezervimit, dataRezervuar, statusi)
       VALUES (?, ?, CURDATE(), ?, 'ne_pritje')`,
      [id_perdoruesi, id_liber, dataRezervuar]
    );

    res.json({ message: `📅 Rezervimi u bë për datën ${dataRezervuar}!` });
  } catch (err) {
    console.error("Gabim gjatë rezervimit:", err);
    res.status(500).json({ message: "Gabim në server gjatë rezervimit." });
  }
};

export const getRezervimetByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
         r.id_rezervimi,
         l.titulli,
         r.dataRezervuar AS data,
         r.statusi,
         'rezervim' AS tipi
       FROM rezervim r
       JOIN liber l ON r.id_liber = l.id_liber
       WHERE r.id_perdoruesi = ?

       UNION ALL

       SELECT 
         h.id_huazimi,
         l.titulli,
         h.dataKthimit AS data,
         h.statusi,
         'huazim' AS tipi
       FROM huazim h
       JOIN liber l ON h.id_liber = l.id_liber
       WHERE h.id_perdoruesi = ?

       ORDER BY data DESC`,
      [id, id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Gabim gjatë marrjes së të dhënave:", err);
    res.status(500).json({ message: "Gabim në server." });
  }
};

export const fshiRezervim = async (req, res) => {
  try {
    await pool.query("DELETE FROM rezervim WHERE id_rezervimi = ?", [req.params.id]);
    res.json({ message: "Rezervimi u fshi me sukses!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë fshirjes së rezervimit." });
  }
};

export const ndryshoRezervim = async (req, res) => {
  try {
    await pool.query(
      "UPDATE rezervim SET dataRezervuar = ?, statusi = 'ne_pritje' WHERE id_rezervimi = ?",
      [req.body.dataRezervuar, req.params.id]
    );

    res.json({ message: "Data e rezervimit u ndryshua!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim në ndryshimin e rezervimit." });
  }
};

export const getAllRezervimet = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, l.titulli, CONCAT(p.emri, ' ', p.mbiemri) AS perdoruesi
       FROM rezervim r
       JOIN liber l ON r.id_liber = l.id_liber
       JOIN perdoruesi p ON r.id_perdoruesi = p.id_perdoruesi
       ORDER BY r.dataRezervimit DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gabim në marrjen e rezervimeve." });
  }
};

export const miratoRezervim = async (req, res) => {
  try {
    await pool.query("UPDATE rezervim SET statusi='miratuar' WHERE id_rezervimi = ?", [req.params.id]);
    res.json({ message: "Rezervimi u miratua!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë miratimit." });
  }
};

export const refuzoRezervim = async (req, res) => {
  try {
    await pool.query("UPDATE rezervim SET statusi='refuzuar' WHERE id_rezervimi = ?", [req.params.id]);
    res.json({ message: "Rezervimi u refuzua!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë refuzimit." });
  }
};
