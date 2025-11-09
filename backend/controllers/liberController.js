import db from "../utils/db.js";

export const getAllBooks = async (req, res) => {
  try {
    console.log(" Kontrolleri getAllBooks u thirr");
    
    const [rows] = await db.execute(`
      SELECT l.id_liber, l.titulli, l.autori, l.vitiBotimit, l.zhanri, l.statusi, 
             k.emri AS kategori
      FROM liber l
      LEFT JOIN kategori k ON l.id_kategori = k.id_kategori
    `);
    
    console.log(`Gjetëm ${rows.length} libra`);
    
    res.json({ 
      success: true, 
      books: rows 
    });
  } catch (err) {
    console.error("Gabim në databazë:", err);
    res.status(500).json({ 
      success: false, 
      message: "Gabim në marrjen e librave" 
    });
  }
};
