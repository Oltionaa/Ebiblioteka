import db from "../utils/db.js";

class Liber {
  static async findByCriteria({ titulli, autori, zhanri }) {
    let query = `
      SELECT l.*, k.emri as kategori 
      FROM liber l 
      LEFT JOIN kategori k ON l.id_kategori = k.id_kategori 
      WHERE 1=1
    `;
    const params = [];

    if (titulli) {
      query += " AND l.titulli LIKE ?";
      params.push(`%${titulli}%`);
    }
    if (autori) {
      query += " AND l.autori LIKE ?";
      params.push(`%${autori}%`);
    }
    if (zhanri) {
      query += " AND l.zhanri LIKE ?";
      params.push(`%${zhanri}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async reserve(id_liber, id_perdoruesi) {
    const [libri] = await db.execute("SELECT statusi FROM liber WHERE id_liber = ?", [id_liber]);
    if (!libri.length) throw new Error("Liberi nuk ekziston");

    if (libri[0].statusi === "i_lire") {
      await db.execute(
        "INSERT INTO huazim (id_perdoruesi, id_liber, statusi) VALUES (?, ?, 'aktive')", 
        [id_perdoruesi, id_liber]
      );
      await db.execute(
        "UPDATE liber SET statusi='i_huazuar' WHERE id_liber=?", 
        [id_liber]
      );
      return "Liberi u huazua me sukses!";
    } else {
      await db.execute(
        "INSERT INTO rezervim (id_perdoruesi, id_liber, statusi) VALUES (?, ?, 'ne_pritje')", 
        [id_perdoruesi, id_liber]
      );
      return "Liberi u rezervua me sukses! Do të njoftoheni kur të jetë i lirë.";
    }
  }

  static async getBookStats() {
    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_books,
        SUM(CASE WHEN statusi = 'i_lire' THEN 1 ELSE 0 END) as available_books,
        SUM(CASE WHEN statusi = 'i_huazuar' THEN 1 ELSE 0 END) as borrowed_books,
        SUM(CASE WHEN statusi = 'i_rezervuar' THEN 1 ELSE 0 END) as reserved_books
      FROM liber
    `);
    return stats[0];
  }
}

export default Liber;