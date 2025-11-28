import express from "express";
import {
  rezervoLiber,
  getRezervimetByUser,
  fshiRezervim,
  ndryshoRezervim,
  getAllRezervimet,
  miratoRezervim,
  refuzoRezervim,
} from "../controllers/rezervimController.js";

const router = express.Router();

router.post("/rezervo", rezervoLiber);
router.get("/user/:id_perdoruesi", getRezervimetByUser);
router.delete("/fshi/:id_rezervimi", fshiRezervim);
router.put("/ndrysho/:id_rezervimi", ndryshoRezervim);
router.get("/admin", getAllRezervimet);
router.put("/mirato/:id_rezervimi", miratoRezervim);
router.put("/refuzo/:id_rezervimi", refuzoRezervim);

export default router;
