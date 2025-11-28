import express from "express";
import { shtoRekomandim, merrRekomandimet } from "../controllers/rekomandimController.js";

const router = express.Router();

// POST /api/rekomandime/shto
router.post("/shto", shtoRekomandim);

// GET /api/rekomandime
router.get("/", merrRekomandimet);

export default router;
