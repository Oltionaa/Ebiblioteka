import express from "express";
import { getNotifications, markAsRead } from "../controllers/njoftimController.js";

const router = express.Router();

router.put("/lexo/:id_perdoruesi", markAsRead);  
router.get("/:id_perdoruesi", getNotifications);

export default router;
