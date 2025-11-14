import pool from "../utils/db.js";

export const getNotifications = async (req, res) => {
  const { id_perdoruesi } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM njoftim WHERE id_perdoruesi = ? ORDER BY created_at DESC",
      [id_perdoruesi]
    );

    res.json(rows);
  } catch (err) {
    console.error("Gabim në njoftime:", err);
    res.status(500).json({ message: "Gabim gjatë marrjes së njoftimeve." });
  }
};
