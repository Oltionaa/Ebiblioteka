import express from "express";
import {
  rezervoLiber,
  getRezervimetByUser,
  fshiRezervim,
  ndryshoRezervim,
  getAllRezervimet,
  miratoRezervim,
  refuzoRezervim
} from "../controllers/rezervimController.js";

const router = express.Router();

router.post("/rezervo", rezervoLiber);
router.get("/user/:id", getRezervimetByUser);
router.delete("/fshi/:id", fshiRezervim);
router.put("/ndrysho/:id", ndryshoRezervim);

// Routes për bibliotekar/admin
router.get("/admin", getAllRezervimet);
router.put("/mirato/:id", miratoRezervim);
router.put("/refuzo/:id", refuzoRezervim);

export default router;
