import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import liberRoutes from "./routes/liberRoutes.js";
import huazimRoutes from "./routes/huazimRoutes.js";
import rezervimRoutes from "./routes/rezervimRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";   // <-- KËTU !!!
import njoftimRoutes from "./routes/njoftimRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/libra", liberRoutes);
app.use("/api/huazime", huazimRoutes);
app.use("/api/rezervime", rezervimRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/admin", adminRoutes);               
app.use("/api/njoftime", njoftimRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveri po funksionon në portin ${PORT}`));
