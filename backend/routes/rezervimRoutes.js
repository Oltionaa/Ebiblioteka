import express from "express";
import {
  rezervoLiber,
  getRezervimetByUser,
  fshiRezervim,
  ndryshoRezervim,
} from "../controllers/rezervimController.js";

const router = express.Router();

router.post("/rezervo", rezervoLiber);
router.get("/user/:id", getRezervimetByUser);
router.delete("/fshi/:id", fshiRezervim);
router.put("/ndrysho/:id", ndryshoRezervim);

export default router;