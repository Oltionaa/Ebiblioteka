import express from "express";
import { gjeneroRaport, merrRaportinEFundit } from "../controllers/raportController.js";

const router = express.Router();

router.post("/gjenero", gjeneroRaport);
router.get("/fundit", merrRaportinEFundit);

export default router;
