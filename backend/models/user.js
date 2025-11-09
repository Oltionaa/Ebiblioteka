import db from "../utils/db.js";

class User {
  constructor(emri, mbiemri, email, fjalekalimi, numriKarteLexuesi = null, roli = "Perdorues") {
    this.emri = emri;
    this.mbiemri = mbiemri;
    this.email = email;
    this.fjalekalimi = fjalekalimi;
    this.roli = roli;
    this.numriKarteLexuesi = numriKarteLexuesi; // do ta gjenerojmë në save()
  }

  static async gjeneroNumrinKarteles() {
    // Merr ID më të madhe ekzistuese nga tabela
    const [rows] = await db.execute(
      "SELECT MAX(id_perdoruesi) AS maxId FROM perdoruesi"
    );

    const maxId = rows[0].maxId || 0; // nëse s’ka përdorues, fillo nga 0
    const nextId = maxId + 1;

    // Formo numrin e kartelës me format LEX-000001
    const formatted = nextId.toString().padStart(6, "0");
    return `LEX-${formatted}`;
  }

  async save() {
    // Gjenero numrin e kartelës nëse s’është caktuar
    if (!this.numriKarteLexuesi) {
      this.numriKarteLexuesi = await User.gjeneroNumrinKarteles();
    }

    const [result] = await db.execute(
      "INSERT INTO perdoruesi (emri, mbiemri, email, fjalekalimi, numriKarteLexuesi, roli) VALUES (?, ?, ?, ?, ?, ?)",
      [this.emri, this.mbiemri, this.email, this.fjalekalimi, this.numriKarteLexuesi, this.roli]
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
