const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  // ✅ Regjistrimi i përdoruesit
  static async register(data) {
    const { emri, mbiemri, email, fjalekalimi } = data;

    // Kontrollo nëse email ekziston
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error("Email ekziston!");
    }

    // Krijo dhe ruaj përdoruesin
    const user = new User(emri, mbiemri, email, fjalekalimi);
    await user.save();

    return "Përdoruesi u krijua me sukses!";
  }

  // ✅ Login
  static async login(data) {
    const { email, fjalekalimi } = data;

    const user = await User.findByEmail(email);
    if (!user) throw new Error("Email ose fjalëkalimi i gabuar!");

    const isMatch = await bcrypt.compare(fjalekalimi, user.fjalekalimi);
    if (!isMatch) throw new Error("Email ose fjalëkalimi i gabuar!");

    // Gjenero JWT
    const token = jwt.sign(
      { id: user.id_perdoruesi, roli: user.roli },
      "secretkey",      // në prodhim përdor env variable
      { expiresIn: "1d" }
    );

    return { token, user: { emri: user.emri, email: user.email, roli: user.roli } };
  }
}

module.exports = AuthService;
