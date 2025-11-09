import express from "express";
import { getAllBooks } from "../controllers/liberController.js"; // ✅ Sigurohu që është named export

const router = express.Router();

router.get("/", getAllBooks);

export default router;