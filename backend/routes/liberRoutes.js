import express from "express";
import { getAllLibra } from "../controllers/liberController.js";

const router = express.Router();

router.get("/", getAllLibra);

export default router;
