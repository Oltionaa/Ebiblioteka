import pool from "../utils/db.js";

class NjoftimController {
  async getNotifications(req, res) {
    const { id_perdoruesi } = req.params;

    try {
      const [rows] = await pool.query(
        "SELECT * FROM njoftim WHERE id_perdoruesi = ? ORDER BY created_at DESC",
        [id_perdoruesi]
      );
      res.json(rows);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Gabim gjatë marrjes së njoftimeve!" });
    }
  }

  async markAsRead(req, res) {
    const { id_perdoruesi } = req.params;

    try {
      await pool.query(
        "UPDATE njoftim SET lexuar = 1 WHERE id_perdoruesi = ?",
        [id_perdoruesi]
      );
      res.json({ message: "Njoftimet u lexuan!" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Gabim gjatë leximit të njoftimeve!" });
    }
  }
}


const controller = new NjoftimController();

export const getNotifications = (req, res) =>
  controller.getNotifications(req, res);

export const markAsRead = (req, res) =>
  controller.markAsRead(req, res);
