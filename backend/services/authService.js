import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {
  static async register(data) {
    const { emri, mbiemri, email, fjalekalimi } = data;

    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new Error("Ky email ekziston tashmë!");

    const hashedPassword = await bcrypt.hash(fjalekalimi, 10);

    const user = new User(
      emri,
      mbiemri,
      email,
      hashedPassword,
      "Perdorues" 
    );

    await user.save();

    const token = jwt.sign(
      { id: user.id_perdoruesi, roli: user.roli },
      "secretkey",
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id_perdoruesi: user.id_perdoruesi,
        emri: user.emri,
        mbiemri: user.mbiemri,
        email: user.email,
        roli: user.roli,
        numriKarteLexuesi: user.numriKarteLexuesi,
      },
    };
  }

  static async login(data) {
    const { email, fjalekalimi } = data;

    const user = await User.findByEmail(email);
    if (!user) throw new Error("Email ose fjalëkalimi i gabuar!");

    const isMatch = await bcrypt.compare(fjalekalimi, user.fjalekalimi);
    if (!isMatch) throw new Error("Email ose fjalëkalimi i gabuar!");

    const token = jwt.sign(
      { id: user.id_perdoruesi, roli: user.roli },
      "secretkey",
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id_perdoruesi: user.id_perdoruesi,
        emri: user.emri,
        mbiemri: user.mbiemri,
        email: user.email,
        roli: user.roli,
        numriKarteLexuesi: user.numriKarteLexuesi,
      },
    };
  }
}

export default AuthService;
