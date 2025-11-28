import pool from "../utils/db.js";

export const rezervoLiber = async (req, res) => {
  const { id_perdoruesi, id_liber, dataRezervimit } = req.body;

  if (!dataRezervimit)
    return res.status(400).json({ message: "Ju lutem zgjidhni një datë!" });

  try {
    const d = new Date(dataRezervimit);
    d.setDate(d.getDate() + 7);
    const dataRezervuar = d.toISOString().split("T")[0];

    await pool.query(
      `INSERT INTO rezervim (id_perdoruesi, id_liber, dataRezervimit, dataRezervuar, statusi)
       VALUES (?, ?, ?, ?, 'ne_pritje')`,
      [id_perdoruesi, id_liber, dataRezervimit, dataRezervuar]
    );

    res.json({ message: `Rezervimi u bë me sukses! Kthimi deri më ${dataRezervuar}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gabim në server!" });
  }
};

export const getRezervimetByUser = async (req, res) => {
  const { id_perdoruesi } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT r.id_rezervimi,
              l.titulli,
              r.dataRezervimit AS data_marrjes,
              r.dataRezervuar AS data_kthimit,
              r.statusi,
              'rezervim' AS tipi
       FROM rezervim r
       JOIN liber l ON r.id_liber = l.id_liber
       WHERE r.id_perdoruesi = ?
       ORDER BY r.dataRezervimit DESC`,
      [id_perdoruesi]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gabim në server!" });
  }
};

export const fshiRezervim = async (req, res) => {
  const { id_rezervimi } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM rezervim WHERE id_rezervimi = ?",
      [id_rezervimi]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Rezervimi nuk ekziston!" });

    res.json({ message: "Rezervimi u fshi me sukses!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë fshirjes!" });
  }
};

export const ndryshoRezervim = async (req, res) => {
  const { id_rezervimi } = req.params;
  const { dataRezervimit } = req.body;

  try {
    const d = new Date(dataRezervimit);
    d.setDate(d.getDate() + 7);
    const dataKthimit = d.toISOString().split("T")[0];

    await pool.query(
      `UPDATE rezervim SET dataRezervimit=?, dataRezervuar=? WHERE id_rezervimi=?`,
      [dataRezervimit, dataKthimit, id_rezervimi]
    );

    res.json({ message: "Data u ndryshua me sukses!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë ndryshimit!" });
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
    res.status(500).json({ message: "Gabim gjatë marrjes së rezervimeve!" });
  }
};export const miratoRezervim = async (req, res) => {
  const { id_rezervimi } = req.params;

  try {
    const [[rez]] = await pool.query(
      "SELECT id_perdoruesi FROM rezervim WHERE id_rezervimi = ?",
      [id_rezervimi]
    );

    if (!rez) return res.status(404).json({ message: "Rezervimi nuk u gjet!" });

    await pool.query(
      "UPDATE rezervim SET statusi='miratuar' WHERE id_rezervimi = ?",
      [id_rezervimi]
    );

   await pool.query(
  "INSERT INTO njoftim (id_perdoruesi, mesazh, tipi) VALUES (?, ?, ?)",
  [rez.id_perdoruesi, "Rezervimi juaj u MIRATUA ✔", "success"]
);

    res.json({ message: "Rezervimi u miratua!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gabim gjatë miratimit!" });
  }
};

export const refuzoRezervim = async (req, res) => {
  const { id_rezervimi } = req.params;

  try {
    const [[rez]] = await pool.query(
      "SELECT id_perdoruesi FROM rezervim WHERE id_rezervimi = ?",
      [id_rezervimi]
    );

    await pool.query(
      "UPDATE rezervim SET statusi='refuzuar' WHERE id_rezervimi = ?",
      [id_rezervimi]
    );

await pool.query(
  "INSERT INTO njoftim (id_perdoruesi, mesazh, tipi) VALUES (?, ?, ?)",
  [rez.id_perdoruesi, "Rezervimi juaj u REFUZUA ❌", "error"]
);


    res.json({ message: "Rezervimi u refuzua!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë refuzimit!" });
  }
};
