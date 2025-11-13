import express from "express";
import {
  huazoLiber,
  ktheLiber,
  getDatatEZena,
  getHuazimetByUser,
} from "../controllers/huazimController.js";

const router = express.Router();

router.post("/huazo", huazoLiber);
router.post("/kthe", ktheLiber);
router.get("/datat/:id_liber", getDatatEZena);
router.get("/user/:id", getHuazimetByUser);

export default router;
