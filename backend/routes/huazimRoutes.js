import express from "express";
import { huazoLiber, ktheLiber } from "../controllers/huazimController.js";

const router = express.Router();

router.post("/huazo", huazoLiber);
router.post("/kthe", ktheLiber);

export default router;
