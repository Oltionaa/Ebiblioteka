import pool from "../utils/db.js";

class RaportController {
  async gjeneroRaport(req, res) {
    try {
      const id_perdoruesi = Number(req.body.id_perdoruesi);

      if (!id_perdoruesi) {
        return res.status(400).json({
          message: "id_perdoruesi mungon ose nuk është valid",
        });
      }

      const [[perdorues]] = await pool.query(
        "SELECT COUNT(*) AS total FROM perdoruesi"
      );
      const [[libra]] = await pool.query(
        "SELECT COUNT(*) AS total FROM liber"
      );
      const [[rezervime]] = await pool.query(
        "SELECT COUNT(*) AS total FROM rezervim"
      );
      const [[huazime]] = await pool.query(
        "SELECT COUNT(*) AS total FROM huazim"
      );

      const raport = {
        total_perdorues: perdorues.total,
        total_libra: libra.total,
        total_rezervime: rezervime.total,
        total_huazime: huazime.total,
      };

      await pool.query(
        `INSERT INTO raport 
         (tipiRaportit, dataGjenerimit, permbajtja, id_perdoruesi)
         VALUES (?, CURDATE(), ?, ?)`,
        ["Raport Statistikor", JSON.stringify(raport), id_perdoruesi]
      );

      return res.status(201).json({
        message: "Raporti u gjenerua me sukses!",
        raport,
      });
    } catch (err) {
      console.error("Gabim gjatë gjenerimit të raportit:", err);
      return res.status(500).json({
        error: "Gabim gjatë gjenerimit të raportit",
      });
    }
  }

  async merrRaportinEFundit(req, res) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM raport ORDER BY id_raporti DESC LIMIT 1"
      );

      if (rows.length === 0) {
        return res.json({ message: "Nuk ka raporte të ruajtura." });
      }

      const raport = rows[0];
      if (raport.permbajtja) {
        raport.permbajtja = JSON.parse(raport.permbajtja);
      }

      return res.json(raport);
    } catch (err) {
      console.error("Gabim gjatë marrjes së raportit:", err);
      return res.status(500).json({
        error: "Gabim gjatë marrjes së raportit",
      });
    }
  }
}


const controller = new RaportController();

export const gjeneroRaport = (req, res) =>
  controller.gjeneroRaport(req, res);

export const merrRaportinEFundit = (req, res) =>
  controller.merrRaportinEFundit(req, res);
