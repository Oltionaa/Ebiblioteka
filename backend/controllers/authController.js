import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecretkey"; // vendos më të sigurt në prodhim

// Register
export const register = async (req, res) => {
  try {
    const { email, fjalekalimi, emri = "Test", mbiemri = "User" } = req.body;

    if (!email || !fjalekalimi) {
      return res.status(400).json({ message: "Email dhe password kërkohen!" });
    }

    const [rows] = await db.execute("SELECT * FROM perdoruesi WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email është përdorur!" });
    }

    const hash = await bcrypt.hash(fjalekalimi, 10);

    await db.execute(
      "INSERT INTO perdoruesi (emri, mbiemri, email, fjalekalimi) VALUES (?, ?, ?, ?)",
      [emri, mbiemri, email, hash]
    );

    res.status(201).json({ message: "Përdoruesi u krijua me sukses!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gabim serveri!" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, fjalekalimi } = req.body;
    if (!email || !fjalekalimi) {
      return res.status(400).json({ message: "Email dhe password kërkohen!" });
    }

    const [rows] = await db.execute("SELECT * FROM perdoruesi WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Email ose fjalëkalim i gabuar!" });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(fjalekalimi, user.fjalekalimi);
    if (!validPassword) {
      return res.status(400).json({ message: "Email ose fjalëkalim i gabuar!" });
    }

    const token = jwt.sign(
      { id: user.id_perdoruesi, email: user.email, roli: user.roli },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Kyçu me sukses!", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gabim serveri!" });
  }
};
