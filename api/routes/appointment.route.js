import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import { getUserAppointments } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/my-appointments", verifyToken, getUserAppointments);

export default router;
