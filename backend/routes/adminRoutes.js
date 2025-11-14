import express from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getSystemStats,
  getMonthlyStats
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/users", addUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/stats", getSystemStats);
router.get("/monthly-stats", getMonthlyStats);

export default router;
