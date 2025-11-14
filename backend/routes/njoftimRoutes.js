import express from "express";
import { getNotifications } from "../controllers/njoftimController.js";

const router = express.Router();

router.get("/:id_perdoruesi", getNotifications);

export default router;
