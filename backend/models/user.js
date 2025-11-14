import db from "../utils/db.js";

class User {
  constructor(emri, mbiemri, email, fjalekalimi, roli = "User", numriKarteLexuesi = null) {
    this.emri = emri;
    this.mbiemri = mbiemri;
    this.email = email;
    this.fjalekalimi = fjalekalimi;
    this.roli = roli;
    this.numriKarteLexuesi = numriKarteLexuesi;
  }

  // gjenero numër rastësor: LEX-284193
  static gjeneroRandom() {
    return `LEX-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  // gjenero numër DHE kontrollo unikalitetin në DB
  static async gjeneroNumrinUnik() {
    let numri;

    while (true) {
      numri = this.gjeneroRandom();

      const [rows] = await db.execute(
        "SELECT 1 FROM perdoruesi WHERE numriKarteLexuesi = ?",
        [numri]
      );

      if (rows.length === 0) break; // gjetëm numër unik
    }

    return numri;
  }

  async save() {
    if (!this.numriKarteLexuesi) {
      this.numriKarteLexuesi = await User.gjeneroNumrinUnik();
    }

    const [result] = await db.execute(
      `INSERT INTO perdoruesi (emri, mbiemri, email, fjalekalimi, roli, numriKarteLexuesi)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        this.emri,
        this.mbiemri,
        this.email,
        this.fjalekalimi,
        this.roli,
        this.numriKarteLexuesi
      ]
    );

    this.id_perdoruesi = result.insertId;
    return this;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM perdoruesi WHERE email = ?", [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM perdoruesi WHERE id_perdoruesi = ?", [id]);
    return rows[0] || null;
  }
}

export default User;
