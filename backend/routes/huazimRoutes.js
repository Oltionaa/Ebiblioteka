import express from "express";
import {
  huazoLiber,
  ktheLiber,
  getDatatEZena,
} from "../controllers/huazimController.js";

const router = express.Router();

router.post("/huazo", huazoLiber);
router.post("/kthe", ktheLiber);
router.get("/datat/:id_liber", getDatatEZena);

export default router;
