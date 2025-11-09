const db = require("../db");
const bcrypt = require("bcryptjs");

class User {
  constructor(emri, mbiemri, email, fjalekalimi, roli = "Perdorues") {
    this.emri = emri;
    this.mbiemri = mbiemri;
    this.email = email;
    this.fjalekalimi = fjalekalimi;
    this.roli = roli;
  }

  // ✅ Ruaj përdoruesin në DB
  async save() {
    const hashedPassword = await bcrypt.hash(this.fjalekalimi, 10);
    const [result] = await db.execute(
      "INSERT INTO perdoruesi (emri, mbiemri, email, fjalekalimi, roli) VALUES (?, ?, ?, ?, ?)",
      [this.emri, this.mbiemri, this.email, hashedPassword, this.roli]
    );
    return result;
  }

  // ✅ Gjej përdoruesin sipas email
  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM perdoruesi WHERE email = ?", [email]);
    return rows[0]; // kthen objektin ose undefined
  }
}

module.exports = User;
