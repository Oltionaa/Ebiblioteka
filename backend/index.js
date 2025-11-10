import express from "express";
import cors from "cors";
import liberRoutes from "./routes/liberRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import huazimRoutes from "./routes/huazimRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/libra", liberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/huazim", huazimRoutes);

app.listen(5000, () => {
  console.log("Serveri po funksionon në portin 5000");
});