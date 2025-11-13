import express from "express";
import { 
  getAllLibra,
  shtoLiber,
  editoLiber,
  fshiLiber
} from "../controllers/liberController.js";

const router = express.Router();

router.get("/", getAllLibra);
router.post("/shto", shtoLiber);
router.put("/edit/:id", editoLiber);
router.delete("/fshi/:id", fshiLiber);

export default router;
