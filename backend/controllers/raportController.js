import pool from "../utils/db.js";

export const gjeneroRaport = async (req, res) => {
  console.log(">>> GjeneroRaport u thirr");

  try {
    const [[perdorues]] = await pool.query("SELECT COUNT(*) AS total FROM perdoruesi");
    const [[libra]] = await pool.query("SELECT COUNT(*) AS total FROM liber");
    const [[rezervime]] = await pool.query("SELECT COUNT(*) AS total FROM rezervim");
    const [[huazime]] = await pool.query("SELECT COUNT(*) AS total FROM huazim");

    const raport = {
      total_perdorues: perdorues.total,
      total_libra: libra.total,
      total_rezervime: rezervime.total,
      total_huazime: huazime.total,
    };

    await pool.query(
  "INSERT INTO raport (tipiRaportit, dataGjenerimit, permbajtja) VALUES (?, NOW(), ?)",
  ["Raport Statistikor", JSON.stringify(raport)]
);


    return res.json({ message: "Raporti u gjenerua me sukses!" });

  } catch (err) {
    console.error("Gabim gjatë gjenerimit të raportit:", err);
    res.status(500).json({ error: "Gabim gjatë gjenerimit të raportit" });
  }
};

export const merrRaportinEFundit = async (req, res) => {
  console.log(">>> merrRaportinEFundit u thirr");

  try {
    const [rows] = await pool.query(
      "SELECT * FROM raport ORDER BY id_raporti DESC LIMIT 1"
    );

    if (rows.length === 0)
      return res.json({ message: "Nuk ka raporte të ruajtura." });

    const raport = rows[0];
    raport.permbajtja = JSON.parse(raport.permbajtja);

    return res.json(raport);

  } catch (err) {
    console.error("Gabim gjatë marrjes së raportit:", err);
    res.status(500).json({ error: "Gabim gjatë marrjes së raportit" });
  }
};
