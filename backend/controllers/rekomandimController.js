import Rekomandim from "../models/Rekomandim.js";
import pool from "../utils/db.js";

class RekomandimController {
  async shtoRekomandim(req, res) {
    try {
      const { id_perdoruesi, id_liber, mesazhi } = req.body;

      if (!id_perdoruesi || !id_liber || !mesazhi?.trim()) {
        return res.status(400).json({ message: "Të dhënat mungojnë!" });
      }

      await Rekomandim.shto({
        id_perdoruesi,
        id_liber,
        mesazhi,
      });

      const [bibliotekistet] = await pool.query(
        "SELECT id_perdoruesi FROM perdoruesi WHERE roli='bibliotekist'"
      );

      for (const b of bibliotekistet) {
        await pool.query(
          `INSERT INTO njoftime (id_perdoruesi, tipi, mesazh, dataNjoftimit)
           VALUES (?, 'info', ?, NOW())`,
          [
            b.id_perdoruesi,
            `Përdoruesi ${id_perdoruesi} ka lënë rekomandim për librin ${id_liber}`,
          ]
        );
      }

      return res
        .status(201)
        .json({ message: "Rekomandimi u dërgua me sukses!" });
    } catch (err) {
      console.log(" GABIM NE RUATJE:", err);
      return res
        .status(500)
        .json({ message: "Gabim gjatë ruajtjes së rekomandimit!" });
    }
  }

  async merrRekomandimet(req, res) {
    try {
      const [rows] = await Rekomandim.merrTeGjitha();
      return res.json(rows);
    } catch (err) {
      console.log("sGABIM NE MARRJE:", err);
      return res.status(500).json({
        message: "Gabim gjatë marrjes së rekomandimeve!",
        error: err,
      });
    }
  }
}
const controller = new RekomandimController();

export const shtoRekomandim = (req, res) =>
  controller.shtoRekomandim(req, res);

export const merrRekomandimet = (req, res) =>
  controller.merrRekomandimet(req, res);