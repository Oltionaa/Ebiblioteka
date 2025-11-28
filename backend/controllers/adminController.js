import pool from "../utils/db.js";
import { addLog } from "./logController.js";


export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM perdoruesi");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gabim gjatë marrjes së përdoruesve." });
  }
};
export const addUser = async (req, res) => {
  const { emri, mbiemri, email, fjalekalimi, roli } = req.body;

  try {
    const [last] = await pool.query(`
      SELECT numriKarteLexuesi 
      FROM perdoruesi 
      ORDER BY id_perdoruesi DESC 
      LIMIT 1
    `);

    let nextNumber = 1;
    if (last.length > 0) {
      nextNumber = parseInt(last[0].numriKarteLexuesi.split("-")[1]) + 1;
    }

    const newCard = `LEX-${String(nextNumber).padStart(6, "0")}`;

    await pool.query(
      `INSERT INTO perdoruesi (emri, mbiemri, email, fjalekalimi, numriKarteLexuesi, roli)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [emri, mbiemri, email, fjalekalimi, newCard, roli]
    );

    await addLog(1, `Shtoi përdoruesin ${emri} ${mbiemri}`, "Admin", req.ip);

    res.json({ message: "Përdoruesi u shtua!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gabim gjatë shtimit të përdoruesit." });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { emri, mbiemri, email, roli } = req.body;

  try {
    await pool.query(
      "UPDATE perdoruesi SET emri=?, mbiemri=?, email=?, roli=? WHERE id_perdoruesi=?",
      [emri, mbiemri, email, roli, id]
    );

    await addLog(1, `Përditësoi përdoruesin ID ${id}`, "Admin", req.ip);

    res.json({ message: "Përdoruesi u modifikua!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë modifikimit." });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM perdoruesi WHERE id_perdoruesi=?", [id]);

    await addLog(1, `Fshiu përdoruesin ID ${id}`, "Admin", req.ip);

    res.json({ message: "Përdoruesi u fshi!" });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë fshirjes." });
  }
};


export const getSystemStats = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT COUNT(*) AS total FROM perdoruesi");
    const [books] = await pool.query("SELECT COUNT(*) AS total FROM liber");
    const [rez] = await pool.query("SELECT COUNT(*) AS total FROM rezervim");
    const [huaz] = await pool.query("SELECT COUNT(*) AS total FROM huazim");

    res.json({
      total_perdorues: users[0].total,
      total_libra: books[0].total,
      total_rezervime: rez[0].total,
      total_huazime: huaz[0].total,
    });
  } catch (err) {
    res.status(500).json({ message: "Gabim në stats." });
  }
};

export const getMonthlyStats = async (req, res) => {
  try {
    const [rezervimeRows] = await pool.query(`
      SELECT MONTH(dataRezervimit) AS muaji, COUNT(*) AS total
      FROM rezervim
      GROUP BY MONTH(dataRezervimit)
    `);

    const [huazimeRows] = await pool.query(`
      SELECT MONTH(dataHuazimit) AS muaji, COUNT(*) AS total
      FROM huazim
      GROUP BY MONTH(dataHuazimit)
    `);

    const rezervime = {};
    const huazime = {};
    for (let i = 1; i <= 12; i++) {
      rezervime[i] = { total: 0 };
      huazime[i] = { total: 0 };
    }

    rezervimeRows.forEach((r) => {
      rezervime[r.muaji] = { total: r.total };
    });

    huazimeRows.forEach((h) => {
      huazime[h.muaji] = { total: h.total };
    });

    res.json({ rezervime, huazime });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Gabim në monthly stats." });
  }
};
