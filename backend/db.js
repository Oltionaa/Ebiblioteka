import mysql from "mysql2/promise"; // me /promise për execute

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ebibloteka",
});
