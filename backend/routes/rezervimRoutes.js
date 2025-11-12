import express from "express";
import { rezervoLiber } from "../controllers/rezervimController.js";

const router = express.Router();

router.post("/rezervo", rezervoLiber);

export default router;
