import express from "express";
import { shtoRekomandim, merrRekomandimet } from "../controllers/rekomandimController.js";

const router = express.Router();


router.post("/shto", shtoRekomandim);
router.get("/", merrRekomandimet);

export default router;
